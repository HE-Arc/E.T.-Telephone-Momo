let cnv = document.getElementById('cnv');
let ctx = cnv.getContext('2d');

let cnvf = document.getElementById('cnvf');
let ctxf = cnvf.getContext('2d');

let cnvb = document.getElementById('cnvb');
let ctxb = cnvb.getContext('2d');

//TODO add shortcut

let lineWidth = 10;

ctx.lineCap = 'round';
ctx.lineJoin = 'round';
ctxf.lineCap = 'round';
ctxf.lineJoin = 'round';

ctxb.fillStyle = "white";
ctxb.fillRect(0, 0, cnv.width, cnv.height);


let isDragging = false;

let pen = {
    mousedown(e) {
        ctx.strokeStyle = "black";
        ctx.fillStyle = "black";
        ctx.lineWidth = lineWidth;
        ctx.arc(e.x, e.y, ctx.lineWidth / 2, 0, 2 * Math.PI);
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(e.x, e.y);
    },
    mousemove(e) {
        ctx.lineTo(e.x, e.y);
        ctx.stroke();
        ctx.closePath();
        ctx.beginPath();
        ctx.moveTo(e.x, e.y);
    },
    mouseup(e) {
        ctx.closePath();
    },
    drawMouse(e) {
        ctxf.fillStyle = 'transparent';
        ctxf.clearRect(0, 0, cnvf.width, cnvf.height);
        ctxf.beginPath();
        ctxf.setLineDash([2, 3]);
        ctxf.beginPath();
        ctxf.arc(e.x, e.y, lineWidth / 2, 0, Math.PI * 2);
        ctxf.closePath();
        ctxf.stroke();
    }
};

let eraser = {
    mousedown(e) {
        ctx.strokeStyle = "black";
        ctx.fillStyle = "black";
        ctx.lineWidth = lineWidth;
        ctx.globalCompositeOperation = "destination-out";
        ctx.arc(e.x, e.y, ctx.lineWidth / 2, 0, Math.PI * 2, false);
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(e.x, e.y);
    },
    mousemove(e) {
        ctx.lineTo(e.x, e.y);
        ctx.stroke();
        ctx.closePath();
        ctx.beginPath();
        ctx.moveTo(e.x, e.y);
    },
    mouseup(e) {
        ctx.closePath();
        ctx.globalCompositeOperation = "source-over";
    },
    drawMouse(e) {
        ctxf.fillStyle = 'transparent';
        ctxf.clearRect(0, 0, cnvf.width, cnvf.height);
        ctxf.beginPath();
        ctxf.setLineDash([2, 2]);
        ctxf.beginPath();
        ctxf.arc(e.x, e.y, lineWidth / 2, 0, Math.PI * 2);
        ctxf.closePath();
        ctxf.stroke();
    }
};

let bucket = {
    mousedown(e) {
        e.x = Math.round(e.x);
        e.y = Math.round(e.y);
        let stack = [];
        let color = {
            r: 255,
            g: 0,
            b: 255
        }
        ctx.shadowBlur = 0;
        let id = ctx.getImageData(0, 0, cnv.width, cnv.height);
        let pixels = id.data;

        let off = (e.y * id.width + e.x) * 4;
        let startColor = {
            r: pixels[off],
            g: pixels[off + 1],
            b: pixels[off + 2],
            a: pixels[off + 3],
        };

        let i = 0;

        if (!(color.r === startColor.r && color.g === startColor.g && color.b === startColor.b)) {
            stack.push(e);
        }


        while (stack.length > 0 && i < cnv.width * cnv.height) {
            let cPos = stack.shift();


            addToStack(cPos.x + 1, cPos.y);
            addToStack(cPos.x - 1, cPos.y);
            addToStack(cPos.x, cPos.y + 1);
            addToStack(cPos.x, cPos.y - 1);
            i++;
        }

        ctx.putImageData(id, 0, 0);

        function addToStack(x, y) {
            if (!(x >= 0 && x < cnv.width && y >= 0 && y < cnv.height)) {
                return;
            }
            let off = (y * id.width + x) * 4;
            let ccolor = {
                r: pixels[off],
                g: pixels[off + 1],
                b: pixels[off + 2],
                a: pixels[off + 3],
            };


            if (ccolor.r === startColor.r && ccolor.g === startColor.g && ccolor.b === startColor.b && ccolor.a === startColor.a) {
                stack.push({x, y});
            }
            pixels[off] = color.r;
            pixels[off + 1] = color.g;
            pixels[off + 2] = color.b;
            pixels[off + 3] = 255;
        }
    },
    mousemove(e) {

    },
    mouseup(e) {

    }
};

let line = {
    startPos: {x: 0, y: 0},
    mousedown(e) {
        ctxf.strokeStyle = "black";
        ctxf.fillStyle = "black";
        ctxf.lineWidth = lineWidth;
        this.startPos.x = e.x;
        this.startPos.y = e.y;
    },
    mousemove(e) {
        ctxf.clearRect(0, 0, cnvf.width, cnvf.height);
        ctxf.beginPath();
        ctxf.moveTo(this.startPos.x, this.startPos.y);
        ctxf.lineTo(e.x, e.y);
        ctxf.stroke();
        ctxf.closePath();
    },
    mouseup(e) {
        ctx.strokeStyle = "black";
        ctx.fillStyle = "black";
        ctx.lineWidth = lineWidth;
        ctx.beginPath();
        ctx.moveTo(this.startPos.x, this.startPos.y);
        ctx.lineTo(e.x, e.y);
        ctx.stroke();
        ctx.closePath();
        ctxf.clearRect(0, 0, cnvf.width, cnvf.height);
    }
};

let rect = {
    startPos: {x: 0, y: 0},
    mousedown(e) {
        ctxf.fillStyle = "black";
        this.startPos.x = e.x;
        this.startPos.y = e.y;
    },
    mousemove(e) {
        ctxf.clearRect(0, 0, cnvf.width, cnvf.height);
        ctxf.fillRect(this.startPos.x, this.startPos.y, e.x - this.startPos.x, e.y - this.startPos.y);
    },
    mouseup(e) {
        ctx.fillStyle = "black";
        ctx.fillRect(this.startPos.x, this.startPos.y, e.x - this.startPos.x, e.y - this.startPos.y);
    }
};

let tool = pen;


let maxUndo = 5;
let undoStack = [];
let redoStack = [];

function saveUndo() {
    redoStack = [];
    undoStack.push(cnv.toDataURL());
    if (undoStack.length > maxUndo) {
        undoStack.shift();
    }
}

function undo() {
    if (undoStack.length > 0) {
        let previousState = undoStack.pop();
        redoStack.push(cnv.toDataURL());
        applyState(previousState);
    }
}

function redo() {
    if (redoStack.length > 0) {
        let followingState = redoStack.pop();
        applyState(followingState);
        undoStack.push(cnv.toDataURL());
    }
}

function applyState(state) {
    let img = new Image();
    img.onload = function () {
        ctx.clearRect(0, 0, cnv.width, cnv.height);
        ctx.drawImage(img, 0, 0);
    };
    img.src = state;
}

document.getElementById('imageUpload').addEventListener('change', uploadImage);

window.addEventListener('dragover', (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'copy';
}, false);
window.addEventListener('drop', (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log(e.dataTransfer.items[0]);
    if (e.dataTransfer.items[0].kind === "file") {
        readImage(e.dataTransfer.files[0]);
    } else {
        e.dataTransfer.items[0].getAsString(function (url) {
            console.log("yo");
            displayImage(url);
        });
    }
}, false);


function uploadImage(e) {
    readImage(e.target.files[0]);
}

function readImage(blob) {
    let reader = new FileReader();
    reader.onload = function (event) {
        displayImage(event.target.result);
    };
    reader.readAsDataURL(blob);
}

function displayImage(url) {

    let img = new Image();
    img.onload = function () {
        let scale = 1;
        let decX = 0;
        let decY = 0;
        // Fonctionne uniquement pour les canvas carré!
        // Fonctionne pas enfaite
        if (img.width > img.height) {
            console.log("1");
            if (img.width < cnv.width) {
                console.log("a");
                scale = cnv.width / img.width;
            } else {
                console.log("b");
                scale = cnv.height / img.height;
                decX = -(img.width * scale - cnv.width) / 2;
            }
        } else {
            console.log("2");
            if (img.height < cnv.height) {
                console.log("c");
                scale = cnv.height / img.height;
            } else {
                console.log("d");
                scale = cnv.width / img.width;
                decY = -(img.height * scale - cnv.height) / 2;
            }

        }
        ctxb.drawImage(img, decX, decY, img.width * scale, img.height * scale);
    };
    img.src = url;

}


function getMousePos(evt) {
    let rect = cnv.getBoundingClientRect();
    let ratioWith = cnv.width / rect.width;
    let ratioHeight = cnv.height / rect.height;
    return {
        x: Math.round((evt.clientX - rect.left) * ratioWith),
        y: Math.round((evt.clientY - rect.top) * ratioHeight)
    };
}


cnvf.addEventListener('mousedown', (e) => {
    saveUndo();
    tool.mousedown(getMousePos(e));
    isDragging = true;
});
cnvf.addEventListener('mousemove', (e) => {
    if (isDragging)
        tool.mousemove(getMousePos(e));
    if (tool.drawMouse !== undefined)
        tool.drawMouse(getMousePos(e));
});
window.addEventListener('mouseup', (e) => {
    if (isDragging) {
        tool.mouseup(getMousePos(e));
        isDragging = false;
    }
    ctxf.clearRect(0, 0, cnvf.width, cnvf.height);
});

let lastTouch;

cnvf.addEventListener('touchstart', (e) => {
    lastTouch = e.touches[0];
    saveUndo();
    tool.mousedown(getMousePos(e.touches[0]));
    isDragging = true;
});
cnvf.addEventListener('touchmove', (e) => {
    if (isDragging)
        tool.mousemove(getMousePos(e.touches[0]));
    if (tool.drawMouse !== undefined)
        tool.drawMouse(getMousePos(e.touches[0]));
    e.preventDefault();
    lastTouch = e.touches[0];
});
window.addEventListener('touchend', (e) => {
    if (isDragging) {
        tool.mouseup(getMousePos(lastTouch));
        isDragging = false;
    }
    ctxf.clearRect(0, 0, cnvf.width, cnvf.height);
});
