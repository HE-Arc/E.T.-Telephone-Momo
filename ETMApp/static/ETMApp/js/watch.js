
// TODO delete
//let conversations = [{"urlConversation":"0PkY1T02","messages":[{"user":"Nicolas","url_drawing":null,"description":"Nico la taupe"},{"user":"Fence Plus 928","url_drawing":"ETMApp/games/cgJmDmwn/0PkY1T02/1.png","description":null},{"user":"Laptop Post office","url_drawing":null,"description":"Nico la taupe"}]},{"urlConversation":"cse3vkGh","messages":[{"user":"Laptop Post office","url_drawing":null,"description":"Yo2"},{"user":"Nicolas","url_drawing":"ETMApp/games/cgJmDmwn/cse3vkGh/1.png","description":null},{"user":"Fence Plus 928","url_drawing":null,"description":"yo"}]},{"urlConversation":"w7kTnYaR","messages":[{"user":"Fence Plus 928","url_drawing":null,"description":"Marty is the taupe"},{"user":"Laptop Post office","url_drawing":"ETMApp/games/cgJmDmwn/w7kTnYaR/1.png","description":null},{"user":"Nicolas","url_drawing":null,"description":"Marty la taupe"}]}]

let conversations;
let currentConv = 0;
let currentMessage = 1;

function setConversations(conv) {
    conversations = conv;
    document.getElementById('watchContainer').removeAttribute('hidden');
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

    //Clear the current table
    table.innerHTML = '';

    let first = true;
    let text = true;

    //Add parties in element then in the html table
    for (let message of messages) {
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
        text = !text;
    }
}


