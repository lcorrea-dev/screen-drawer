const { remote } = require('electron');

window.addEventListener('DOMContentLoaded', () => {
    const replaceText = (selector, text) => {
        const element = document.getElementById(selector);
        if (element) element.innerText = text;
    };

    for (const type of ['chrome', 'node', 'electron']) {
        replaceText(`${type}-version`, process.versions[type]);
    }

    let isUsingTool = false;

    const mainWindow = remote.getCurrentWindow();

    const toolBar = document.getElementById('toolBar');

    toolBar.addEventListener('mouseleave', () => {
        if (!isUsingTool) {
            mainWindow.setIgnoreMouseEvents(true, { forward: true });
        }
    });
    toolBar.addEventListener('mouseenter', () => {
        mainWindow.setIgnoreMouseEvents(false);
    });

    const tools = document.querySelectorAll('.tool-btn');
    tools.forEach((tool) => {
        tool.addEventListener('click', () => {
            if (!isUsingTool) {
                mainWindow.setIgnoreMouseEvents(false);
                isUsingTool = true;
            } else {
                isUsingTool = false;
            }
        });
    });
});
