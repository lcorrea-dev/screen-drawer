/* eslint-disable import/no-extraneous-dependencies */
const { remote } = require('electron');

window.addEventListener('DOMContentLoaded', () => {
  const mainWindow = remote.getCurrentWindow();
  const toolBar = document.getElementById('toolBar');
  const currentTool = document.getElementById('currentTool');

  let isUsingTool = false;

  toolBar.addEventListener('mouseleave', () => {
    if (!isUsingTool) {
      mainWindow.setIgnoreMouseEvents(true, { forward: true });
    } else if (currentTool.innerText !== '') {
      mainWindow.setIgnoreMouseEvents(false);
    } else {
      mainWindow.setIgnoreMouseEvents(true, { forward: true });
      isUsingTool = false;
    }
  });

  toolBar.addEventListener('mouseenter', () => {
    mainWindow.setIgnoreMouseEvents(false);
  });

  const tools = document.querySelectorAll('.tool-btn');
  tools.forEach((tool) => {
    tool.addEventListener('click', () => {
      // if (!isUsingTool) {
      // mainWindow.setIgnoreMouseEvents(false);
      isUsingTool = true;
      // } else {
      // isUsingTool = false;
      // }
    });
  });
});
