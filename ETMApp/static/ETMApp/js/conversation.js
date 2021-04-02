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
        let content = (text ? '<b>' + message.what + '</b>' : '<br/><img src="' + message.img + '"/>');
        td.innerHTML = message.who + (first ? ' choose ' : ' found ') + content;
        td.classList.add("text-truncate");

        //Add to the row
        tr.appendChild(td);
        //Add to the table
        table.appendChild(tr);

        first = false;
        text = !text;
    }
}

let messages = [
    { "who" : "Gurix", "what" : "Val a un mic qui pu du cullllllllllllllllll", "img" : null},
    { "who" : "Laon", "what" : null, "img" : "https://www.speedskating.ca/sites/speedskating.ca/files/styles/large/public/img/person/balboa_teamportraits3-13_0.jpg"},
    { "who" : "LaMousseAuLini", "what" : "Le HashMaster", "img" : null},
];

listMessages(messages);