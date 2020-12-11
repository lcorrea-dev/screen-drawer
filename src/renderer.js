const toolBar = document.getElementById('toolBar');
const tools = document.querySelectorAll('.tool-btn');
const penTool = document.getElementById('penTool');
const cleanBoardTool = document.getElementById('cleanBoardTool');
const canvas = document.getElementById('canvas');
canvas.width = document.documentElement.clientWidth;
canvas.height = document.documentElement.clientHeight;
const penSizeInput = document.getElementById('penSizeInput');
var penSize = 1;
const penColorInput = document.getElementById('penColorInput');
var penColor = '#ff0000';

penColorInput.addEventListener('input', () => {
    penColor = penColorInput.value;
});

penSizeInput.addEventListener('input', () => {
    penSize = penSizeInput.value;
});

// states handler
let isUsingTool = false;
let isUsingPenTool = false;
//
let canvasContext = canvas.getContext('2d');
let mousePosition = { x: 0, y: 0 };
let ongoingTouches = [];

tools.forEach((tool) => {
    tool.addEventListener('click', () => {
        if (!isUsingTool) {
            isUsingTool = true;
        } else {
            isUsingTool = false;
        }
    });
});

penTool.addEventListener('click', () => (isUsingTool ? false : true));

cleanBoardTool.addEventListener('click', () => {
    canvasContext.clearRect(0, 0, canvas.width, canvas.height);
});

function setPosition(e) {
    mousePosition.x = e.screenX;
    mousePosition.y = e.screenY;
}

document.addEventListener('mousemove', draw);
document.addEventListener('mousedown', setPosition);
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

    // touches = evt.changedTouches;

    // x = touches[0].screenX;
    // y = touches[0].screenY;
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
