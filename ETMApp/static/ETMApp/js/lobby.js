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
let totalTime;

//Set on click event
let btnPseudo = document.getElementById("btnPseudo");
if (btnPseudo)
    btnPseudo.addEventListener("click", changePseudo);

let pageTitle = document.getElementById('pageTitle');
let nbRound = document.getElementById('nbRound');
let roundLength = document.getElementById('roundLength');
let sliderRound = document.getElementById('sliderRound');
let lobbyContainer = document.getElementById('lobbyContainer');
let chooseContainer = document.getElementById('chooseContainer');
let drawContainer = document.getElementById('drawContainer');

let textContent = document.getElementById('textContent');
let textFind = document.getElementById('textFind');
let btnValidateChoose = document.getElementById("btnValidateChoose");
let btnValidateDraw = document.getElementById("btnValidateDraw");
let btnValidateFind = document.getElementById("btnValidateFind");
let btnStartGame = document.getElementById('btnStartGame');

btnValidateChoose.addEventListener('click', sendCurrent);
sliderRound.addEventListener('input', sliderRoundChange);
btnStartGame.addEventListener('click', startGame);

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
            gameStarted(e.data);
            break;
        case "round_end":
            sendCurrent();
            break;
        case "new_round_draw":
            nextRound()
            displayDraw(e.data)
            break;
        case "new_round_find":
            nextRound()
            displayFind(e.data)
            break;
        case "end_game":
            gameEnd()
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
    let nbPlayer = 0;
    let table = document.getElementById('players');

    //Clear the current table
    table.innerHTML = '';

    //Add players in element then in the html table
    table.innerHTML = "";
    for (let player of players) {
        if (!player.isDisconnected) {
            nbPlayer++;
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
    
    sliderRound.max = nbPlayer;

    if (nbPlayer < 3) {
        btnStartGame.disabled = true;
    } else if (me.isAdmin) {
        btnStartGame.disabled = false;
    }

    //Update the number of players
    document.getElementById("numberOfPlayers").innerHTML = nbPlayer;
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

function sliderRoundChange() {
    nbRound.innerHTML = sliderRound.value;
}

function startGame() {
    console.log('startgame');
    chatSocket.send(JSON.stringify({
        'type': 'startGame',
        'data': {
            'nbRound': sliderRound.value,
            'roundLength': roundLength.value
        }
    }));
}

function gameStarted(data) {
    totalTime = data.time;

    textContent.disabled = false;
    btnValidateChoose.disabled = false;
    displayChoose();

    startTimerGUI(totalTime);
}


function sendMessage() {
    let text;
    if (chooseContainer.style.display == "block") {
        text = textContent.value;
    }
    else {
        text = textFind.value;
    }
    
    chatSocket.send(JSON.stringify({
        'type': 'message',
        'data': text
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
    console.log("sendCurrent")
    btnValidateChoose.disabled = true;
    btnValidateFind.disabled = true;
    btnValidateDraw.disabled = true;
    textContent.disabled = true;
    textFind.disabled = true;
    if (!sent) {
        sent = true;
        if(drawing) {

            sendCanvas();
            console.log('send canvas');
        } else {

            sendMessage();
        }

        btnValidateChoose.disabled = true;
        
        //todo marty page en attente d'autre joueurs
        displayWaitingAlert();
    }

    if(sentByServer) {
        //todo marty round finishing soon
    }
}

function clearAll() {
    //ctxb.clearRect(0, 0, cnvb.width, cnvb.height);
    resetBackground();
    ctxf.clearRect(0, 0, cnvb.width, cnvb.height);
    ctx.clearRect(0, 0, cnvb.width, cnvb.height);
}

function nextRound() {
    startTimerGUI(totalTime);
    removeWaitingAlert();

    canDraw = true;

    clearAll();
    textFind.value = "";
    textContent.value = "";
    
    drawing = !drawing;
    sent = false;
    btnValidateChoose.disabled = false;
    btnValidateFind.disabled = false;
    btnValidateDraw.disabled = false;
    textContent.disabled = false;
    textFind.disabled = false;
}

function gameEnd() {
    window.location.replace("/history/" + game_url);
}