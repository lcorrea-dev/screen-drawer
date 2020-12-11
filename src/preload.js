const { remote } = require('electron');

window.addEventListener('DOMContentLoaded', () => {
    const mainWindow = remote.getCurrentWindow();
    const toolBar = document.getElementById('toolBar');
    let isUsingTool = false;

    toolBar.addEventListener('mouseleave', () => {
        if (!isUsingTool) {
            mainWindow.setIgnoreMouseEvents(true, { forward: true });
        } else {
            mainWindow.setIgnoreMouseEvents(false);
        }
    });

    toolBar.addEventListener('mouseenter', () => {
        mainWindow.setIgnoreMouseEvents(false);
    });

    const tools = document.querySelectorAll('.tool-btn');
    tools.forEach((tool) => {
        tool.addEventListener('click', () => {
            if (!isUsingTool) {
                // mainWindow.setIgnoreMouseEvents(false);
                isUsingTool = true;
            } else {
                isUsingTool = false;
            }
        });
    });
});
