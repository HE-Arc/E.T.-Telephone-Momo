const game_url = JSON.parse(document.getElementById('game_url').textContent);

const chatSocket = new WebSocket(
    'ws://'
    + window.location.host
    + '/ws/chat/'
    + game_url
    + '/'
);

chatSocket.onmessage = function(e) {
    e = JSON.parse(e.data);

    switch (e.type) {
        case "lobby_players":
            lobbyPlayers(e.data);
            break;
        case "init_player":
            initPlayer(e.data);
            break;
        case "game_start":
            gameStarted();
    
        default:
            console.error("Unknown event type", e);
            break;
    }
};

chatSocket.onclose = function(e) {
    console.error('Chat socket closed unexpectedly');
};

function sendMessage() {
    chatSocket.send(JSON.stringify({
        'message': "yo"
    }));
    console.log("sended yo");
}

function lobbyPlayers(players) {

    let table = document.getElementById('players');

    //Clear the current table
    table.innerHTML = '';

    //Add elements
    document.getElementById('players').innerHTML = "";
    for (let player of players) {
        let tr = document.createElement('tr');

        //If it's the actual client, put it in evidence
        if(me.id === player.id) {
            tr.classList.add("bg-success")
        }

        let td = document.createElement('td');
        td.innerHTML = player.pseudo;
        tr.appendChild(td);
        table.appendChild(tr);
    }
}

let me = null;
function initPlayer(initMe) {
    me = initMe;
    document.getElementById('pseudo').value = me.pseudo
    document.getElementById('pseudo').disabled = false;
    document.getElementById('btnPseudo').disabled = false;
}

function changePseudo() {
    let pseudo = document.getElementById('pseudo').value;
    chatSocket.send(JSON.stringify({
        'type': 'changePseudo',
        'pseudo': pseudo
    }));
    me.pseudo = pseudo;
}

function startGame() {
    chatSocket.send(JSON.stringify({
        'type': 'startGame'
    }));
}

//Set on click event
let btnPseudo = document.getElementById("btnPseudo");
if(!btnPseudo) addEventListener("click", changePseudo);

function gameStarted() {
    alert("the game has started");
}
