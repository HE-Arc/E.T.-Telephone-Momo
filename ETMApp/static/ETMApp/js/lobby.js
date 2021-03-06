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
    console.log(players);
}