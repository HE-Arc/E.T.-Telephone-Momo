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
    let str = "";
    for (let player of players) {
        str += "<tr><td>" + player.pseudo + "</td></tr>";
    }
    document.getElementById('users').innerHTML = str;
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