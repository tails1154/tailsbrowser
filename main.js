const { app, BrowserWindow } = require('electron');
const { autoUpdater } = require('electron-updater');
const path = require('path');

function createWindow() {
    let win = new BrowserWindow({
        width: 1200,
        height: 800,
        title: "tails1154 Browser",
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
            nodeIntegration: false,
            contextIsolation: true,
            webviewTag: true
        }
    });

    win.loadFile("index.html");
}

app.whenReady().then(() => {
    createWindow();
    autoUpdater.checkForUpdatesAndNotify();
});

autoUpdater.on("update-downloaded", () => {
    autoUpdater.quitAndInstall();
});
