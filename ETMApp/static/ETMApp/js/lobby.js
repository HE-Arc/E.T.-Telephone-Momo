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

let btnPseudo = document.getElementById("btnPseudo");
if (btnPseudo) {
    btnPseudo.addEventListener("click", changePseudo);
    document.getElementById('pseudo').addEventListener('keyup', (e) => {
        if (e.keyCode === 13) {
            changePseudo();
        }
    });
}

document.getElementById('linktoclipboard').addEventListener('click', () => {
    let input = document.body.appendChild(document.createElement("input"));
    input.value = window.location;
    input.focus();
    input.select();
    document.execCommand('copy');
    input.parentNode.removeChild(input);
});

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
let btnNextMessage = document.getElementById('btnNextMessage');

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
            nextRound();
            displayDraw(e.data);
            break;
        case "new_round_find":
            nextRound();
            displayFind(e.data);
            break;
        case "end_game":
            gameEnd(e.data);
            break;
        case "next_message":
            if (!me.isAdmin) //admin has already done the goto
                goto(e.data.conversationID, e.data.messageID);
            break;
        default:
            console.error("Unknown event type", e);
            break;
    }
};

chatSocket.onclose = function (e) {
    console.error('Chat socket closed unexpectedly');
};

// Update the player table
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
            let td = document.createElement('td');
            //If it's the actual client, put it in evidence
            if (me.id === player.id) {
                td.classList.add("text-danger");
                initPlayer(me);
            }

            
            td.innerHTML = htmlEntities(player.pseudo);
            tr.appendChild(td);
            table.appendChild(tr);
        }
    }
    if (sliderRound.max - sliderRound.value < 2) {
        sliderRound.max = nbPlayer;
        sliderRound.value = nbPlayer;
        nbRound.innerHTML = sliderRound.value;
    }
    changeRange(nbPlayer);

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
    
   
    if (btnPseudo && me == null) {
        document.getElementById('pseudo').value = htmlEntities(initMe.pseudo);
        document.getElementById('pseudo').disabled = false;
        document.getElementById('btnPseudo').disabled = false;
    }
    me = initMe;
    
    if (initMe.isAdmin === true) {
        document.getElementById('roundContainer').style.display = "";
        document.getElementById('btnStartGame').disabled = false;
        btnNextMessage.removeAttribute('hidden');
        document.getElementById('alertWatch').style.display = "none";
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
    if (chooseContainer.style.display === "block") {
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

function checkEnter(e) {
    if (e.keyCode === 13) {
        sendCurrent();
    }
}
function sendCurrent(sentByServer) {
    btnValidateChoose.disabled = true;
    btnValidateFind.disabled = true;
    btnValidateDraw.disabled = true;
    textContent.disabled = true;
    textFind.disabled = true;
    if (!sent) {
        sent = true;
        if(drawing) {

            sendCanvas();
        } else {

            sendMessage();
        }

        btnValidateChoose.disabled = true;
        
        displayWaitingAlert();
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

function gameEnd(data) {
    setConversations(data.conversations);
    findDiv.style.display = 'none';
    drawDiv.style.display = 'none';
    chooseDiv.style.display = 'none';
    lobbyDiv.style.display = 'none';
    timerDiv.style.display = 'none';
    startTimerGUI(0);

    removeWaitingAlert();
    
    //window.location.replace("/history/" + game_url);
}
