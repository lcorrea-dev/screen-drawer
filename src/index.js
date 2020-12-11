const electron = require('electron');
const { app, BrowserWindow, Tray, Menu } = electron;
const path = require('path');

let tray = null;

if (require('electron-squirrel-startup')) {
    app.quit();
}

const createWindow = () => {
    // const { width, height } = electron.screen.getPrimaryDisplay().workAreaSize;

    const mainWindow = new BrowserWindow({
        // width: width,
        // height: height,
        frame: false,
        resizable: false,
        fullscreen: true,
        transparent: true,
        webPreferences: {
            enableRemoteModule: true,
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true,
        },
    });

    mainWindow.loadFile(path.join(__dirname, 'index.html'));
    mainWindow.setIgnoreMouseEvents(true, { forward: true });

    mainWindow.setAlwaysOnTop(true, 'screen-saver');
    mainWindow.setVisibleOnAllWorkspaces(true);
    mainWindow.setSkipTaskbar(true);
};

const createTray = () => {
    tray = new Tray(path.join(__dirname, './img/1.jpg'));
    const contextMenu = Menu.buildFromTemplate([
        { label: 'Item1', type: 'radio' },
        { label: 'Item2', type: 'radio' },
        { label: 'Item3', type: 'radio', checked: true },
        { label: 'Item4', type: 'radio' },
    ]);
    tray.setToolTip('This is my application.');
    tray.setContextMenu(contextMenu);
};

app.on('ready', createWindow);
app.on('ready', createTray);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});
