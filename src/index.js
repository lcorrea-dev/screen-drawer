// eslint-disable-next-line import/no-extraneous-dependencies
const electron = require('electron');

const {
  app, BrowserWindow, Tray, Menu,
} = electron;
const path = require('path');

let tray = null;

const squirrel = require('electron-squirrel-startup');

if (squirrel) {
  app.quit();
}

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    frame: false,
    resizable: false,
    fullscreen: true,
    transparent: true,
    type: 'toolbar',
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

// app.whenReady()
//   .then(() => {
//     globalShortcut.register('Alt+CommandOrControl+I', () => {
//       console.log('Electron loves global shortcuts!');
//     });
//   })
//   .then(createWindow);

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
