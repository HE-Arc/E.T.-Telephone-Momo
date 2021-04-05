const conversations = JSON.parse(document.getElementById('conversations').textContent);
const game_url = JSON.parse(document.getElementById('game_url').textContent);
listConversations(conversations);

function listConversations(conversations) {

    let table = document.getElementById('conversations_body');

    //Clear the current table
    table.innerHTML = '';



    //Add parties in element then in the html table
    for (let conversation of conversations) {
        let tr = document.createElement('tr');
        console.log(conversation);

        //Who said what
        let td = document.createElement('td');
        td.innerHTML = conversation.messages[0].user + ' choose "<b>' + conversation.messages[0].description + '</b>"';
        td.classList.add("text-truncate");

        tr.setAttribute('onclick', 'window.location = "' + game_url + '/' + conversation.urlConversation + '"');

        //Add to the row
        tr.appendChild(td);
        //Add to the table
        table.appendChild(tr);
    }
}