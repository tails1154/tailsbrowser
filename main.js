const { app, BrowserWindow } = require('electron');
const { autoUpdater } = require('electron-updater');

function createWindow() {
    let win = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            nodeIntegration: false
        }
    });

    win.loadURL('https://www.google.com');
}

app.whenReady().then(() => {
    createWindow();

    // Auto-updater
    autoUpdater.checkForUpdatesAndNotify();
});

// Optional: logging auto-update events
autoUpdater.on('update-downloaded', () => {
    autoUpdater.quitAndInstall();
});
