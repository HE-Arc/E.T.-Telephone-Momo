const game_url = JSON.parse(document.getElementById('game_url').textContent);

let protocol = "ws";
if (window.location.protocol === "https:") {
    protocol = "wss";
}
const chatSocket = new WebSocket(
    protocol + '://'
    + window.location.host
    + '/ws/chat/'
    + game_url
    + '/'
);

//Set on click event
let btnPseudo = document.getElementById("btnPseudo");
if (btnPseudo)
    btnPseudo.addEventListener("click", changePseudo);

let pageTitle = document.getElementById('pageTitle');
let sliderRound = document.getElementById('sliderRound');
let lobbyContainer = document.getElementById('lobbyContainer');
let textContainer = document.getElementById('textContainer');
let drawingContainer = document.getElementById('drawingContainer');

let textContent = document.getElementById('textContent');
let btnValidate = document.getElementById("btnValidate");

btnValidate.addEventListener('click', sendMessage);

chatSocket.onmessage = function (e) {
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
            break;
        default:
            console.error("Unknown event type", e);
            break;
    }
};

chatSocket.onclose = function (e) {
    console.error('Chat socket closed unexpectedly');
};


function lobbyPlayers(players) {
    sliderRound.max = players.length;
    let table = document.getElementById('players');

    //Clear the current table
    table.innerHTML = '';

    //Add players in element then in the html table
    table.innerHTML = "";
    for (let player of players) {
        if (!player.isDisconnected) {
            let tr = document.createElement('tr');

            //If it's the actual client, put it in evidence
            if (me.id === player.id) {
                tr.classList.add("bg-success")
            }

            let td = document.createElement('td');
            td.innerHTML = player.pseudo;
            tr.appendChild(td);
            table.appendChild(tr);
        }
    }

    //Update the number of players
    document.getElementById("numberOfPlayers").innerHTML = players.length + ' players ready !';
}

let me = null;
function initPlayer(initMe) {
    me = initMe;
    if (btnPseudo) {
        document.getElementById('pseudo').value = me.pseudo
        document.getElementById('pseudo').disabled = false;
        document.getElementById('btnPseudo').disabled = false;
    }
    if (initMe.isAdmin === true) {
        document.getElementById('roundContainer').style.display = "block";
    }
}

function changePseudo() {
    let pseudo = document.getElementById('pseudo').value;
    chatSocket.send(JSON.stringify({
        'type': 'changePseudo',
        'data': pseudo
    }));
    me.pseudo = pseudo;
}

function startGame() {
    chatSocket.send(JSON.stringify({
        'type': 'startGame'
    }));
}

function gameStarted() {
    lobbyContainer.style.display = 'none';
    textContainer.style.display = 'block';
    pageTitle.innerHTML = 'Write a text to draw';
}

function sendMessage() {
    console.log(textContent.value);
    chatSocket.send(JSON.stringify({
        'type': 'message',
        'data': textContent.value
    }));
}


function sendCanvas() {
    chatSocket.send(JSON.stringify({
        'type': 'image',
        'data': cnv.toDataURL()
    }));
}