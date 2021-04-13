function listGames(games) {

    let table = document.getElementById('history_table');

    //Clear the current table
    table.innerHTML = '';

    let html = '';
    //Add parties in element then in the html table
    for (let game of games) {

        html += `
        <div class="mb-3 card overlay-container game-card">
            <div class="overlay">
                <p class="overlay-text">Click to get the full game</p>
            </div>
            <div class="card-body">
                <h5 class="card-title">${timeSince(game.date)} ago</h5>
                <a class="stretched-link" href="history/${game.urlGame}"></a>
                <p class="card-text crop-text-2">${game.players.join(', ')}</p>
                <p class="card-text">
                    <small class="text-muted">${game.players.length} players</small>
                </p>
            </div>
        </div>
        `;
    }
    table.innerHTML = html;
}

const games = JSON.parse(document.getElementById('games').textContent);
console.log(games);
listGames(games);

