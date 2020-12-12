// states handler
const isUsingTool = { name: '' };

const canvas = document.getElementById('canvas');

const canvasContext = canvas.getContext('2d');

const mousePosition = { x: 0, y: 0 };
let ongoingTouches = [];

const penTool = document.getElementById('penTool');
const rectangleTool = document.getElementById('rectangleTool');
const eraserTool = document.getElementById('eraserTool');

const cleanBoardTool = document.getElementById('cleanBoardTool');

canvas.width = document.documentElement.clientWidth;
canvas.height = document.documentElement.clientHeight;
const penSizeInput = document.getElementById('penSizeInput');
const penOpacityInput = document.getElementById('penOpacityInput');
let penOpacity = 1;

let penSize = 1;
const penColorInput = document.getElementById('penColorInput');
let penColor = '#ff0000';
const canBeActiveTools = [penTool, rectangleTool, eraserTool];

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

canBeActiveTools.forEach((tool) => {
  tool.addEventListener('click', () => {
    if (isUsingTool.name === '') {
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

let mouseForRectanglePosition = {
  startx: 0, starty: 0, endx: 0, endy: 0,
};

function setInitialPosition(e) {
  mouseForRectanglePosition.startx = e.screenX;
  mouseForRectanglePosition.starty = e.screenY;
}

function setEndPosition(e) {
  mouseForRectanglePosition.endx = e.screenX;
  mouseForRectanglePosition.endy = e.screenY;
}

function erase(e) {
  // setPosition(e);

  if (isUsingTool.name === 'eraserTool') {
    if (e.buttons !== 1) return;

    canvasContext.clearRect(
      mousePosition.x - penSize / 2,
      mousePosition.y - penSize / 2,
      penSize,
      penSize,
    );
    setPosition(e);
    requestAnimationFrame(erase());
  }
}

function handleEnd() {
  ongoingTouches = [];
}

function copyTouch({ identifier, pageX, pageY }) {
  return { identifier, pageX, pageY };
}

function drawTouch(evt) {
  evt.preventDefault();
  const touches = evt.changedTouches;
  let x = touches[0].screenX;
  let y = touches[0].screenY;

  canvasContext.beginPath(); // begin

  canvasContext.lineWidth = penSize;
  canvasContext.lineCap = 'round';
  canvasContext.strokeStyle = penColor;
  if (ongoingTouches.length === 0) {
    for (let i = 0; i < touches.length; i += 1) {
      ongoingTouches.push(copyTouch(touches[i]));
    }
    return;
  }
  for (let i = 0; i < ongoingTouches.length; i += 1) {
    canvasContext.moveTo(ongoingTouches[i].pageX, ongoingTouches[i].pageY); // from
    x = touches[i].screenX;
    y = touches[i].screenY;
    canvasContext.lineTo(x, y); // to
  }

  ongoingTouches = [];

  for (let i = 0; i < touches.length; i += 1) {
    ongoingTouches.push(copyTouch(touches[i]));
  }

  const a = document.getElementById('positionh2');
  a.innerText = `x = ${touches.pageX} y =  ${touches.pageY}`;

  canvasContext.stroke(); // draw it!
}

function draw(e) {
  if (e.buttons !== 1) return;
  if (isUsingTool.name === 'penTool') {
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
    requestAnimationFrame(draw);
  }
}

function drawRectangle(e) {
  if (isUsingTool.name === 'rectangleTool') {
    canvasContext.strokeStyle = penColor;

    setEndPosition(e);
    canvasContext.lineWidth = penSize;
    canvasContext.lineCap = 'round';

    let {
      // eslint-disable-next-line prefer-const
      startx, starty, endx, endy,
    } = mouseForRectanglePosition;
    endx -= startx;
    endy -= starty;
    canvasContext.strokeRect(startx, starty, endx, endy);
    mouseForRectanglePosition = {
      startx: 0, starty: 0, endx: 0, endy: 0,
    };
  }
}

//

const pointerPosition = { x: 0, y: 0 };

function setPositionPointer(e) {
  pointerPosition.x = e.screenX;
  pointerPosition.y = e.screenY;
}
const pointerCanvas = document.getElementById('pointerCanvas');
pointerCanvas.width = document.documentElement.clientWidth;
pointerCanvas.height = document.documentElement.clientHeight;

const pointerCanvasContext = pointerCanvas.getContext('2d');
document.addEventListener('mouseenter', setPositionPointer);

document.addEventListener('mousedown', setPositionPointer);

document.addEventListener('mousemove', setPositionPointer);

function updatePointerCanvas() {
  pointerCanvasContext.clearRect(
    0,
    0,
    pointerCanvas.width,
    pointerCanvas.height,
  );

  pointerCanvasContext.beginPath();
  if (isUsingTool.name === 'eraserTool') {
    pointerCanvasContext.rect(
      pointerPosition.x - penSize / 2,
      pointerPosition.y - penSize / 2,
      penSize,
      penSize,
    );
    pointerCanvasContext.fillStyle = 'white';

    pointerCanvasContext.strokeStyle = 'black';
    if (isUsingTool.name !== '') {
      pointerCanvasContext.fill();

      pointerCanvasContext.stroke();
    }
    requestAnimationFrame(updatePointerCanvas);
  } else {
    pointerCanvasContext.arc(
      pointerPosition.x,
      pointerPosition.y,
      penSize / 2,
      0,
      2 * Math.PI,
      true,
    );
    pointerCanvasContext.fillStyle = penColor;
    pointerCanvasContext.strokeStyle = 'black';
    if (isUsingTool.name !== '') {
      pointerCanvasContext.fill();

      pointerCanvasContext.stroke();
    }
    requestAnimationFrame(updatePointerCanvas);
    // pointerCanvasContext.fillStyle = '#FF6A6A';
    // pointerCanvasContext.fill();
  }
}
updatePointerCanvas();

//
document.addEventListener('mousedown', setPosition);
// document.addEventListener('mousemove', setPosition);

document.addEventListener('mousemove', draw);
// document.addEventListener('mousedown', erase);
document.addEventListener('mousemove', erase);

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
