let isUsingTool = false;

const toolBar = document.getElementById('toolBar');

const tools = document.querySelectorAll('.tool-btn');
tools.forEach((tool) => {
    tool.addEventListener('click', () => {
        if (!isUsingTool) {
            isUsingTool = true;
        } else {
            isUsingTool = false;
        }
    });
});

let isUsingPenTool = false;
let canDraw = false;
const penTool = document.getElementById('penTool');
penTool.addEventListener('click', () => {
    if (!isUsingPenTool) {
        canDraw = true;

        isUsingPenTool = true;
    } else {
        canDraw = false;
        isUsingPenTool = false;
    }
});

const board = document.getElementById('board');

board.width = document.documentElement.clientWidth;
board.height = document.documentElement.clientHeight;

let boardContext = board.getContext('2d');
// boardContext.fillStyle = '#FF0000';

let mousePosition = { x: 0, y: 0 };

const cleanBoardTool = document.getElementById('cleanBoardTool');
cleanBoardTool.addEventListener('click', () => {
    boardContext.clearRect(0, 0, board.width, board.height);
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

let ongoingTouches = [];
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

    boardContext.beginPath(); // begin

    boardContext.lineWidth = 1;
    boardContext.lineCap = 'round';
    boardContext.strokeStyle = '#c0392b';
    if (ongoingTouches.length == 0) {
        for (let i = 0; i < touches.length; i++) {
            ongoingTouches.push(copyTouch(touches[i]));
        }
        return;
    }
    for (let i = 0; i < ongoingTouches.length; i++) {
        boardContext.moveTo(ongoingTouches[i].pageX, ongoingTouches[i].pageY); // from
        x = touches[i].screenX;
        y = touches[i].screenY;
        boardContext.lineTo(x, y); // to
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

    boardContext.stroke(); // draw it!
}

function draw(e) {
    // mouse left button must be pressed
    if (e.buttons !== 1) return;

    boardContext.beginPath(); // begin

    boardContext.lineWidth = 1;
    boardContext.lineCap = 'round';
    boardContext.strokeStyle = '#c0392b';

    boardContext.moveTo(mousePosition.x, mousePosition.y); // from
    setPosition(e);
    boardContext.lineTo(mousePosition.x, mousePosition.y); // to

    const a = document.getElementById('positionh2');
    a.innerText = `x = ${mousePosition.x} y =  ${mousePosition.y}`;

    boardContext.stroke(); // draw it!
    // console.log(mousePosition);
}
