
let conversations;
let currentConv = 0;
let currentMessage = 0;

let ss;
let ssu;

setSpeech().then((voices) => initVoice(voices));

function setConversations(conv) {
    conversations = conv;
    document.getElementById('watchContainer').removeAttribute('hidden');
    // initSpeech();
}

function nextMessage() {
    currentMessage++;
    if (currentMessage > conversations[currentConv].messages.length) {
        currentMessage = 1;
        currentConv++;
        currentConv = currentConv % conversations.length
    }
    goto(currentConv, currentMessage);


    chatSocket.send(JSON.stringify({
        'type': 'nextMessage',
        'data': {
            'messageID': currentMessage,
            'conversationID': currentConv
        }
    }));
}


function goto(conversationID, messageID) {
    console.log(`${conversationID}, ${messageID}`);
    listMessages(conversations[conversationID].messages.slice(0, messageID));

    let message = conversations[conversationID].messages[messageID-1];
    if(message.url_drawing == null){
        speak(message.description);
    }
        
    setTimeout(() => {
        window.scrollTo(0, document.body.scrollHeight);
    }, 10);
}

function listMessages(messages) {

    let table = document.getElementById('messages');

    let first = true;
    let text = true;

    let html = '';
    //Add parties in element then in the html table
    for (let [index, message] of messages.entries()) {
        if (message.url_drawing == null) {
            let isChoose = 'found'
            if (first) {
                isChoose = 'choose'
            }
            html +=
            `<div class="card-text-container">
                <div class="mb-3 card overlay-container conversations-card inline card-text">
                    <div class="card-body">
                        <p class="card-text crop-text-2">${message.user} ${isChoose}</p>
                        <h5 class="card-title">${message.description}</h5>
                    </div>
                </div>
            </div>`;
        } else {
            html += `
            <div class="card-img-container">
                <div class="mb-3 card overlay-container conversations-card card-img">
                    <div class="card-body">
                        <p class="card-text crop-text-2">${message.user} draw</p>
                    </div>
                    <img class="card-img-top card-image card-image-large" src="/media/${message.url_drawing}">
                </div>
            </div>`;
        }

        first = false;
    }

    document.getElementById('roundContent').innerHTML = html;
}

function setSpeech() {
    ss = window.speechSynthesis;
    ssu = new SpeechSynthesisUtterance();

    return new Promise(
        function (resolve, reject) {
            let id;

            id = setInterval(() => {
                if (ss.getVoices().length !== 0) {
                    resolve(ss.getVoices());
                    clearInterval(id);
                }
            }, 10);
        }
    )
}

function initVoice(voices) {
    console.log(voices);

    for(let voice of voices) {
        console.log(voice.lang);
        if(voice.lang == "fr-FR") {
            ssu.voice = voice;
            break;
        }
    }

    console.log(ssu.voice == null ? "defaults to EN-en" : ssu.voice.lang);
}

function speak(text) {
    if (ss.speaking) {
        ss.cancel();
    }
    ssu.text = text;
    ss.speak(ssu);
}


