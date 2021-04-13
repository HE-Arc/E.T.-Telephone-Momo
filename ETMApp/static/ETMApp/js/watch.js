
let conversations;
let currentConv = 0;
let currentMessage = 1;

let ss;
let ssu

function setConversations(conv) {
    conversations = conv;
    document.getElementById('watchContainer').removeAttribute('hidden');
    initSpeech();
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
    listMessages(conversations[conversationID].messages.slice(0, messageID))
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

            if(index == messages.length - 1) {
                //speak(message.description);
            }
        } else {
            html += `
            <div class="card-img-container">
                <div class="mb-3 card overlay-container conversations-card card-img">
                    <div class="card-body">
                        <p class="card-text crop-text-2">Nico draw</p>
                    </div>
                    <img class="card-img-top card-image" src="/media/${message.url_drawing}">
                </div>
            </div>`;
        }

        first = false;
        
        /*<div class="card-img-container">
            <div class="mb-3 card overlay-container conversations-card card-img">
                <div class="card-body">
                    <p class="card-text crop-text-2">Nico draw</p>
                </div>
                <img class="card-img-top card-image" src="/media/ETMApp/games/cgJmDmwn/0PkY1T02/1.png">
            </div>
        </div>*/

/*
        
        let tr = document.createElement('tr');

        //Who said what
        let td = document.createElement('td');
        let content = (message.url_drawing == null ? '<b>' + message.description + '</b>' : '<br/><img src="/media/' + message.url_drawing + '"/>');
        td.innerHTML = '<i>' + message.user + '</i>' + (first ? ' choose ' : ' found ') + content;
        //td.classList.add("text-truncate");

        //Add to the row
        tr.appendChild(td);
        //Add to the table
        table.appendChild(tr);

        first = false;
        text = !text;*/
    }

    document.getElementById('roundContent').innerHTML = html;
}

function initSpeech() {
    ss = window.speechSynthesis;
    ssu = new SpeechSynthesisUtterance();

    let voices = ss.getVoices();
    for(let voice of voices) {
        if(voice.lang == "fr-FR") {
            ssu.voice = voice;
            break;
        }
    }
}

function speak(text) {
    if (ss.speaking) {
        ss.cancel();
    }
    ssu.text = text;
    ss.speak(ssu);
}


