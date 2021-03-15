//Link click event to drawer functions
document.getElementById('penButton').addEventListener('click', () => tool = pen);
document.getElementById('eraserButton').addEventListener('click', () => tool = eraser);
document.getElementById('bucketButton').addEventListener('click', () => tool = bucket);

document.getElementById('penLine').addEventListener('click', () => tool = line);
document.getElementById('penRect').addEventListener('click', () => tool = rect);

document.getElementById('undoButton').addEventListener('click', () => undo());
document.getElementById('redoButton').addEventListener('click', () => redo());