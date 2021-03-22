//Link click event to drawer functions

document.getElementById('penButton').addEventListener('change', () => tool = pen);
document.getElementById('eraserButton').addEventListener('change', () => tool = eraser);
document.getElementById('bucketButton').addEventListener('change', () => tool = bucket);

document.getElementById('lineButton').addEventListener('change', () => tool = line);
document.getElementById('rectButton').addEventListener('change', () => tool = rect);

document.getElementById('undoButton').addEventListener('click', undo);
document.getElementById('redoButton').addEventListener('click', redo);

//Get the draw and find div
let drawDiv = document.getElementById('drawContainer');
let findDiv = document.getElementById('findContainer');

//TO REMOVE
displayDraw();

//Pass to draw gameplay to find gameplay
function displayDraw()
{
    findDiv.style.display = 'none'
    drawDiv.style.display = 'block';
}

function displayFind()
{
    findDiv.style.display = 'block';
    drawDiv.style.display = 'none';
}