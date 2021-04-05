const conversation = JSON.parse(document.getElementById('conversation').textContent);
const game_url = JSON.parse(document.getElementById('game_url').textContent);

listMessages(conversation.messages);

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