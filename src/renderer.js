const { read } = require('fs');

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
let boardContext = board.getContext('2d');
// boardContext.fillStyle = '#FF0000';

// board.style.backgroundColor = 'blue';

let mousePosition = { x: 0, y: 0 };

// function setPosition(e) {
//     mousePosition.x = e.clientX / 5;
//     mousePosition.y = e.clientY / 5.7;
// }

function setPosition(e) {
    mousePosition.x = e.clientX;
    mousePosition.y = e.clientY;
}
// board.addEventListener('mousedown', (e) => {
//     mousePosition.x = e.clientX;
//     mousePosition.y = e.clientY;
// });

document.addEventListener('mousemove', draw);
document.addEventListener('mousedown', setPosition);
document.addEventListener('mouseenter', setPosition);

function draw(e) {
    // mouse left button must be pressed
    if (e.buttons !== 1) return;

    boardContext.beginPath(); // begin

    boardContext.lineWidth = 1;
    boardContext.lineCap = 'round';
    boardContext.strokeStyle = '#c0392b';

    boardContext.moveTo(500.x, mousePosition.y); // from
    setPosition(e);
    boardContext.lineTo(mousePosition.x, mousePosition.y); // to

    const a = document.getElementById('positionh2');
    a.innerText = `x = ${mousePosition.x} y =  ${mousePosition.y}`;

    boardContext.stroke(); // draw it!
    console.log(mousePosition);
}
