/**
 * Embed player URL
 * @type {string}
 */
const RECORD_URL = 'https://radiorecord.ru/player/';

/**
 * Require tools
 */
const { app, BrowserWindow, Tray, Menu } = require('electron');
const path = require('path');

/**
 * Define global vars
 */
let tray;
let window;

/**
 *
 */
const createTray = () => {
  /**
   * Add app to tray
   */
  tray = new Tray(path.join(__dirname, 'assets', 'tray-icon-Template.png'));

  /**
   * Listen click event
   */
  tray.on('click', function (event) {
    toggleWindow();
  });
};

/**
 * Toggle window helper
 */
const toggleWindow = () => {
  /**
   * Toggle window
   */
  if (window.isVisible()) {
    /**
     * Hide window
     */
    window.hide()
  } else {
    /**
     * Recalculate window position
     */
    const position = getWindowPosition();

    /**
     * Move window
     */
    window.setPosition(position.x, position.y, false);

    /**
     * Show window
     */
    window.show();
  }
}

/**
 * Calculate window position
 */
const getWindowPosition = () => {
  /**
   * Get window and tray bounds
   */
  const windowBounds = window.getBounds(),
        trayBounds = tray.getBounds();

  /**
   * Center window horizontally below the tray icon
   */
  const x = Math.round(trayBounds.x + (trayBounds.width / 2) - (windowBounds.width / 2));

  /**
   * Position window 4 pixels vertically below the tray icon
   */
  const y = Math.round(trayBounds.y + trayBounds.height + 4);

  return {x, y}
};

/**
 * Create a new window
 */
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
      /**
       * Disable Node.js integration of Electron
       * https://electronjs.org/docs/faq#i-can-not-use-jqueryrequirejsmeteorangularjs-in-electron
       */
      nodeIntegration: false
    }
  });

  /**
   * Load target webpage
   */
  window.loadURL(RECORD_URL);

  /**
   * Hide the window when it loses focus
   */
  window.on('blur', () => {
    if (!window.webContents.isDevToolsOpened()) {
      window.hide();
    }
  });
};

/**
 * Don't show app in the dock
 */
app.dock.hide();

/**
 * On ready initial function
 */
app.on('ready', () => {
  try {
    /**
     * Prepare tray icon
     */
    createTray();

    /**
     * Prepare window
     */
    createWindow();
  } catch (error) {
    console.log(error);
    app.quit();
  }
});
