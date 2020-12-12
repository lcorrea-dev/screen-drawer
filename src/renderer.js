const toolBar = document.getElementById('toolBar');
const tools = document.querySelectorAll('.tool-btn');
const penTool = document.getElementById('penTool');
const rectangleTool = document.getElementById('rectangleTool');
const eraserTool = document.getElementById('eraserTool');

const cleanBoardTool = document.getElementById('cleanBoardTool');
const canvas = document.getElementById('canvas');
canvas.width = document.documentElement.clientWidth;
canvas.height = document.documentElement.clientHeight;
const penSizeInput = document.getElementById('penSizeInput');
const penOpacityInput = document.getElementById('penOpacityInput');
var penOpacity = 1;

var penSize = 1;
const penColorInput = document.getElementById('penColorInput');
var penColor = '#ff0000';

const currentTool = document.getElementById('currentTool');

penColorInput.addEventListener('input', () => {
    penColor = penColorInput.value;
    canvasContext.strokeStyle = penColor;
});

penSizeInput.addEventListener('input', () => {
    penSize = penSizeInput.value;
});

penOpacityInput.addEventListener('input', () => {
    penOpacity = penOpacityInput.value;

    canvasContext.globalAlpha = penOpacity / 10 || 0;
});

// states handler
let isUsingTool = { name: '' };
let canvasContext = canvas.getContext('2d');
let mousePosition = { x: 0, y: 0 };
let ongoingTouches = [];

const canBeActiveTools = [penTool, rectangleTool, eraserTool];

canBeActiveTools.forEach((tool) => {
    tool.addEventListener('click', () => {
        if (isUsingTool.name == '') {
            isUsingTool.name = tool.id;
        } else {
            isUsingTool.name = '';
        }
        currentTool.innerText = isUsingTool.name;
    });
});

cleanBoardTool.addEventListener('click', () => {
    canvasContext.clearRect(0, 0, canvas.width, canvas.height);
});

function setPosition(e) {
    mousePosition.x = e.screenX;
    mousePosition.y = e.screenY;
}

let mouseForRectanglePosition = { startx: 0, starty: 0, endx: 0, endy: 0 };

function setInitialPosition(e) {
    mouseForRectanglePosition.startx = e.screenX;
    mouseForRectanglePosition.starty = e.screenY;
}

function setEndPosition(e) {
    mouseForRectanglePosition.endx = e.screenX;
    mouseForRectanglePosition.endy = e.screenY;
}
document.addEventListener('mousedown', setPosition);
document.addEventListener('mousemove', draw);
// document.addEventListener('mousedown', erase);
document.addEventListener('mousemove', erase);

function erase(e) {
    if (isUsingTool.name == 'eraserTool') {
        if (e.buttons !== 1) return;

        setPosition(e);
        canvasContext.clearRect(
            mousePosition.x,
            mousePosition.y,
            penSize,
            penSize
        );
        setPosition(e);
    }
}

document.addEventListener('mousedown', setInitialPosition);
document.addEventListener('mouseup', drawRectangle);

document.addEventListener('mouseenter', setPosition);

document.addEventListener('touchmove', drawTouch);
// document.addEventListener('touchstart', handleStartTouch, false);
document.addEventListener('touchend', handleEnd, false);
// document.addEventListener('touchcancel', handleCancel, false);
// document.addEventListener('touchmove', handleMove, false);
// document.addEventListener('touchstart', setPosition);

// TODO: HANDLE MORE THAN 1 FINGER TOUCH
// https://developer.mozilla.org/en-US/docs/Web/API/Touch_events

function handleEnd(evt) {
    ongoingTouches = [];
}

function copyTouch({ identifier, pageX, pageY }) {
    return { identifier, pageX, pageY };
}

function drawTouch(evt) {
    evt.preventDefault();
    var touches = evt.changedTouches;
    console.log(touches.length, touches);
    let x = touches[0].screenX;
    let y = touches[0].screenY;

    canvasContext.beginPath(); // begin

    canvasContext.lineWidth = penSize;
    canvasContext.lineCap = 'round';
    canvasContext.strokeStyle = penColor;
    if (ongoingTouches.length == 0) {
        for (let i = 0; i < touches.length; i++) {
            ongoingTouches.push(copyTouch(touches[i]));
        }
        return;
    }
    for (let i = 0; i < ongoingTouches.length; i++) {
        canvasContext.moveTo(ongoingTouches[i].pageX, ongoingTouches[i].pageY); // from
        x = touches[i].screenX;
        y = touches[i].screenY;
        canvasContext.lineTo(x, y); // to
    }

    ongoingTouches = [];

    for (let i = 0; i < touches.length; i++) {
        ongoingTouches.push(copyTouch(touches[i]));
    }

    const a = document.getElementById('positionh2');
    a.innerText = `x = ${touches.pageX} y =  ${touches.pageY}`;

    canvasContext.stroke(); // draw it!
}

function draw(e) {
    if (e.buttons !== 1) return;
    if (isUsingTool.name == 'penTool') {
        canvasContext.beginPath();

        canvasContext.lineWidth = penSize;
        canvasContext.lineCap = 'round';
        canvasContext.strokeStyle = penColor;

        canvasContext.moveTo(mousePosition.x, mousePosition.y);
        setPosition(e);
        canvasContext.lineTo(mousePosition.x, mousePosition.y);

        const a = document.getElementById('positionh2');
        a.innerText = `x = ${mousePosition.x} y =  ${mousePosition.y}`;

        canvasContext.stroke();
    }
}

function drawRectangle(e) {
    if (isUsingTool.name == 'rectangleTool') {
        canvasContext.strokeStyle = penColor;

        setEndPosition(e);
        console.log(mouseForRectanglePosition);
        canvasContext.lineWidth = penSize;
        canvasContext.lineCap = 'round';

        let { startx, starty, endx, endy } = mouseForRectanglePosition;
        endx -= startx;
        endy -= starty;
        console.log(startx, starty, endx, endy);
        canvasContext.strokeRect(startx, starty, endx, endy);
        mouseForRectanglePosition = { startx: 0, starty: 0, endx: 0, endy: 0 };
    }
}
