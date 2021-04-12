function listGames(games) {

    let table = document.getElementById('history_table');

    //Clear the current table
    table.innerHTML = '';

    //Add parties in element then in the html table
    for (let game of games) {

        let card = document.createElement('div');
        card.classList.add("mb-3", "card", "overlay-container", "game-card");

        let overlay = document.createElement('div');
        overlay.classList.add('overlay');
        let text = document.createElement('p');
        text.classList.add('overlay-text');
        text.innerHTML = 'Click to get the full conversation';
        
        let body = document.createElement('div');
        body.classList.add('card-body');
        
        let title = document.createElement('h5');
        title.classList.add('card-title');
        title.innerHTML = game.date;
        
        let link = document.createElement('a');
        link.classList.add('stretched-link');
        link.setAttribute('href', 'history/' + game.urlGame);
        
        let card_text = document.createElement('p');
        card_text.classList.add('card-text');
        card_text.classList.add('crop-text-2');
        card_text.innerHTML = game.players.join(', ');
        
        let playerN = document.createElement('p');
        playerN.classList.add('card-text');
        
        let playerN_inside = document.createElement('small');
        playerN_inside.classList.add('text-muted');
        playerN_inside.innerHTML = game.players.length + ' players';
        
        overlay.appendChild(text);
        card.appendChild(overlay);
        body.appendChild(title);
        body.appendChild(link);
        body.appendChild(card_text);
        playerN.appendChild(playerN_inside);
        body.appendChild(playerN);
        card.appendChild(body);

        table.appendChild(card);
    }
}

const games = JSON.parse(document.getElementById('games').textContent);
console.log(games);
listGames(games);

