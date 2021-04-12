function listGames(games) {

    let table = document.getElementById('history_table');

    //Clear the current table
    table.innerHTML = '';

    //Add parties in element then in the html table
    for (let game of games) {

        let card = document.createElement('div');
        card.classList.add("mb-3");
        card.classList.add("card");
        card.classList.add("overlay-container");
        card.classList.add("game-card");

        let overlay = document.createElement('div');
        overlay.classList.add('overlay');
        let text = document.createElement('p');
        text.classList.add('overlay-text');
        text.innerHTML = 'Click to get the full conversation';
        overlay.appendChild(text);
        card.appendChild(overlay);

        let body = document.createElement('div');
        body.classList.add('card-body');
        let title = document.createElement('h5');
        title.classList.add('card-title');
        title.innerHTML = game.date;
        body.appendChild(title);
        let link = document.createElement('a');
        link.classList.add('stretched-link');
        link.setAttribute('href', 'history/' + game.urlGame);
        link.setAttribute('style', "display:none");
        body.appendChild(link);
        let card_text = document.createElement('p');
        card_text.classList.add('card-text');
        card_text.classList.add('crop-text-2');
        card_text.innerHTML = game.players.join(', ');
        body.appendChild(card_text);
        let playerN = document.createElement('p');
        playerN.classList.add('card-text');
        let playerN_inside = document.createElement('small');
        playerN_inside.classList.add('text-muted');
        playerN_inside.innerHTML = game.players.length + ' players';
        playerN.appendChild(playerN_inside);
        body.appendChild(playerN);
        card.appendChild(body);

        table.appendChild(a);
    }
}

// let games = [
//     { "players" : ["Gurix", "LaouLeLardon", "LaMousseAuLini"], "date" : "14.03.2021"},
//     { "players" : ["Gurix", "Yo ?"], "date" : "10.03.2021"},
//     { "players" : ["Gurix", "Momo", "SUCE", "LaouLeLardon", "LaMousseAuLini"], "date" : "27.02.2021"},
//     { "players" : ["Gurix", "LaouLeLardon", "LaMousseAuLini"], "date" : "10.02.2021"}
// ];


const games = JSON.parse(document.getElementById('games').textContent);
console.log(games);
listGames(games);

