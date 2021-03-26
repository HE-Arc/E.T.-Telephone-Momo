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

let drawing = false;
let sent = false;

//Set on click event
let btnPseudo = document.getElementById("btnPseudo");
if (btnPseudo)
    btnPseudo.addEventListener("click", changePseudo);

let pageTitle = document.getElementById('pageTitle');
let sliderRound = document.getElementById('sliderRound');
let lobbyContainer = document.getElementById('lobbyContainer');
let chooseContainer = document.getElementById('chooseContainer');
let drawContainer = document.getElementById('drawContainer');

let textContent = document.getElementById('textContent');
let btnValidateChoose = document.getElementById("btnValidateChoose");

btnValidateChoose.addEventListener('click', sendCurrent);

chatSocket.onmessage = function (e) {
    e = JSON.parse(e.data);
    console.log("received", e);

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
        case "round_end":
            sendCurrent();
            break;
        case "new_round_draw":
            nextRound()
            displayDraw(e.data)
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
                initPlayer(me);
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
    console.log(me);
    if (initMe.isAdmin === true) {
        document.getElementById('roundContainer').style.display = "block";
        document.getElementById('btnStartGame').disabled = false;
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
    textContent.disabled = false;
    btnValidateChoose.disabled = false;
    displayChoose();
}


function sendMessage() {
    textContent.disabled = true;
    chatSocket.send(JSON.stringify({
        'type': 'message',
        'data': textContent.value
    }));
}


function sendCanvas() {
    ctxb.drawImage(cnv, 0, 0);
    canDraw = false;
    chatSocket.send(JSON.stringify({
        'type': 'image',
        'data': cnvb.toDataURL()
    }));
}


function sendCurrent(sentByServer) {
    console.log(sent, drawing);
    if (!sent) {
        if(drawing) {

            sendCanvas();
            console.log('send canvas');
        } else {
            
            sendMessage();
        }

        btnValidateChoose.disabled = true;
        
        //todo marty page en attente d'autre joueurs
    }

    if(sentByServer) {
        //todo marty round finishing soon
    }
}

function nextRound() {
    canDraw = true;
    textContent.disabled = false;
    btnValidateChoose.disabled = false;

    drawing = !drawing;
    sent = false;
}