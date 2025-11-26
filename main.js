const { app, BrowserWindow, dialog } = require('electron');
const { autoUpdater } = require('electron-updater');
const path = require('path');

let mainWindow;
let updateWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
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

    mainWindow.loadFile("index.html");
}

app.whenReady().then(() => {
    createWindow();
    autoUpdater.autoDownload = false;   // we will control when it downloads
    autoUpdater.checkForUpdates();
});

// --------------------------------------
// UPDATE EVENTS
// --------------------------------------
autoUpdater.on("update-available", (info) => {
    console.log("Update available:", info.version);

    // Force update popup
    const result = dialog.showMessageBoxSync({
        type: "info",
        buttons: ["Update Now"],
        defaultId: 0,
            title: "Update Required",
            message: "A new update is available and required to continue.",
            detail: `Version ${info.version} is ready.\nThe app will update now.`,
            noLink: true
    });

    if (result === 0) {
        autoUpdater.downloadUpdate();
        showUpdateWindow();
    }
});

autoUpdater.on("download-progress", (progress) => {
    if (updateWindow) {
        updateWindow.webContents.send("update-progress", progress.percent.toFixed(0));
    }
});

autoUpdater.on("update-downloaded", () => {
    autoUpdater.quitAndInstall(true, true);
});

// OPTIONAL: show "checking" in logs
autoUpdater.on("checking-for-update", () => {
    console.log("Checking for updates...");
});

// --------------------------------------
// OPTIONAL UPDATE UI WINDOW
// --------------------------------------
function showUpdateWindow() {
    updateWindow = new BrowserWindow({
        width: 400,
        height: 200,
        resizable: false,
        frame: true,
        movable: false,
        minimizable: false,
        maximizable: false,
        closable: false,
        title: "Updating...",
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    updateWindow.loadFile("update.html");

    // Disable closing (forces update)
    updateWindow.on("close", (e) => e.preventDefault());
}
