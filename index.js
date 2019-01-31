const RECORD_URL = 'https://radiorecord.ru/player/';

const { app, BrowserWindow, Tray, Menu } = require('electron');
const path = require('path');

let tray = undefined;
let window = undefined;

const createTray = () => {
  tray = new Tray(path.join(__dirname, 'assets', 'tray-icon-Template.png'));
  tray.on('click', function (event) {
    toggleWindow();
  });
};

const toggleWindow = () => {
  window.isVisible() ? window.hide() : showWindow();
};

const showWindow = () => {
  const position = getWindowPosition();
  window.setPosition(position.x, position.y, false);
  window.show();
};

const getWindowPosition = () => {
  const windowBounds = window.getBounds();
  const trayBounds = tray.getBounds();

  // Center window horizontally below the tray icon
  const x = Math.round(trayBounds.x + (trayBounds.width / 2) - (windowBounds.width / 2));

  // Position window 4 pixels vertically below the tray icon
  const y = Math.round(trayBounds.y + trayBounds.height + 4);

  return {x: x, y: y}
};

const createWindow = () => {
  window = new BrowserWindow({
    width: 680,
    height: 600,
    show: false,
    frame: false,
    fullscreenable: false,
    resizable: false,
    transparent: true,
    webPreferences: {
      nodeIntegration: false
    }
  });

  window.loadURL(RECORD_URL);

  // Hide the window when it loses focus
  window.on('blur', () => {
    if (!window.webContents.isDevToolsOpened()) {
      window.hide();
    }
  });
};

// Don't show the app in the doc
app.dock.hide();

app.on('ready', () => {
  try {
    createTray();
    createWindow();
  } catch (error) {
    console.log(error);
    app.quit();
  }
});
