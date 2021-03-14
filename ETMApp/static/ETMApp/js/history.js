function listParties(parties) {

    let table = document.getElementById('games');

    //Clear the current table
    table.innerHTML = '';

    //Add parties in element then in the html table
    for (let game of games) {
        let tr = document.createElement('tr');

        //Number of players
        let td1 = document.createElement('td');
        td1.innerHTML = game.players.length;
        
        //Names of players
        let td2 = document.createElement('td');
        td2.innerHTML = game.players.join(', ');
        td2.classList.add("text-truncate");

        //Date
        let td3 = document.createElement('td');
        td3.innerHTML = game.date;

        //Add to the row
        tr.appendChild(td1);
        tr.appendChild(td2);
        tr.appendChild(td3);

        //Add to the table
        table.appendChild(tr);
    }
}

let games = [
    { "players" : ["Gurix", "LaouLeLardon", "LaMousseAuLini"], "date" : "14.03.2021"},
    { "players" : ["Gurix", "Yo ?"], "date" : "10.03.2021"},
    { "players" : ["Gurix", "Momo", "SUCE", "LaouLeLardon", "LaMousseAuLini"], "date" : "27.02.2021"},
    { "players" : ["Gurix", "LaouLeLardon", "LaMousseAuLini"], "date" : "10.02.2021"}
];

listParties(games);