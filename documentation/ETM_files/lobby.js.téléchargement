const game_url = JSON.parse(document.getElementById('game_url').textContent);

const chatSocket = new WebSocket(
    'ws://'
    + window.location.host
    + '/ws/chat/'
    + game_url
    + '/'
);

chatSocket.onmessage = function(e) {
    const data = JSON.parse(e.data);
    console.log(data);
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