function listRounds(parties) {

    let table = document.getElementById('rounds');

    //Clear the current table
    table.innerHTML = '';

    //Add parties in element then in the html table
    for (let round of rounds) {
        let tr = document.createElement('tr');

        //Who said what
        let td = document.createElement('td');
        td.innerHTML = round.who + ' choose "<b>' + round.what + '</b>"';
        td.classList.add("text-truncate");

        //Add to the row
        tr.appendChild(td);
        //Add to the table
        table.appendChild(tr);
    }
}

let rounds = [
    { "who" : "Gurix", "what" : "Val a un mic qui pu du cullllllllllllllllll"},
    { "who" : "Laon", "what" : "JS bad"},
    { "who" : "LaMousseAuLini", "what" : "Le HashMaster"},
];

listRounds(rounds);