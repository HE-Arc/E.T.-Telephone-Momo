//Link click event to drawer functions

document.getElementById('penButton').addEventListener('change', () => tool = pen);
document.getElementById('eraserButton').addEventListener('change', () => tool = eraser);
document.getElementById('bucketButton').addEventListener('change', () => tool = bucket);

document.getElementById('lineButton').addEventListener('change', () => tool = line);
document.getElementById('rectButton').addEventListener('change', () => tool = rect);

document.getElementById('undoButton').addEventListener('click', undo);
document.getElementById('clearCanvasButton').addEventListener('click', resetBackground);
document.getElementById('clearDrawButton').addEventListener('click', resetCanvas);
document.getElementById('redoButton').addEventListener('click', redo);

document.getElementById('colorPicker').addEventListener('change', e => color = e.target.value);
document.getElementById('thicknessSelector').addEventListener('change', e => lineWidth = e.target.value);
//Get the draw and find div
let drawDiv = document.getElementById('drawContainer');
let findDiv = document.getElementById('findContainer');
let chooseDiv = document.getElementById('chooseContainer');
let lobbyDiv = document.getElementById('lobbyContainer');
let conversationDiv = document.getElementById('conversationContainer');

let waitingAlert = document.getElementById('waitingAlert');

let timerDiv = document.getElementById('timerDiv');

//TO REMOVE
//displayDraw();
//conversationDiv.style.display = 'none';
drawDiv.style.display = 'none';
findDiv.style.display = 'none';
chooseDiv.style.display = 'none';
lobbyDiv.style.display = 'block';



function changeColor(col) {
    color = col;
    document.getElementById('colorPicker').value = col;
}
//Pass to draw gameplay to find gameplay
function displayDraw(description = "") {
    findDiv.style.display = 'none';
    drawDiv.style.display = 'block';
    chooseDiv.style.display = 'none';
    lobbyDiv.style.display = 'none';
    tool = pen;
    document.getElementById('penButton').checked = true;

    //document.getElementById('drawDescription').value = htmlEntities(description);
    document.getElementById('drawDescription').innerHTML = htmlEntities(description);
    pageTitle.innerHTML = 'Draw';
}


function displayWaitingAlert() {
    waitingAlert.removeAttribute('hidden');
}

function removeWaitingAlert() {
    waitingAlert.setAttribute('hidden','');
}

function displayFind(imageURL) {
    findDiv.style.display = 'block';
    drawDiv.style.display = 'none';
    chooseDiv.style.display = 'none';
    lobbyDiv.style.display = 'none';
    pageTitle.innerHTML = 'Find';
    document.getElementById('imageToFind').innerHTML = "";
    if (imageURL) {
        let img = document.createElement('img');
        img.src = "/media/" + htmlEntities(imageURL);
        document.getElementById('imageToFind').appendChild(img);
    }
}

function displayChoose() {
    findDiv.style.display = 'none';
    drawDiv.style.display = 'none';
    chooseDiv.style.display = 'block';
    lobbyDiv.style.display = 'none';
    pageTitle.innerHTML = 'Choose';
    timerDiv.style.display = 'flex';
}

function displayConversation() {
    findDiv.style.display = 'none';
    drawDiv.style.display = 'none';
    conversationDiv.style.display = 'block';
}

let timer;
function startTimerGUI(totalTime) {
    let elem = document.getElementById("timeLeftBar");
    let bar = document.getElementById("timeBarText");
    let currentTime = 0;
    elem.style.width = "0%";
    clearInterval(timer);
    timer = setInterval(() => {
        if (currentTime >= totalTime) {
            clearInterval(timer);
        } else {
            currentTime++;
            elem.style.width = currentTime/totalTime * 100 + "%";
            bar.innerHTML = totalTime - currentTime + " s left";
        }
    }, 1000);
}
