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

    autoUpdater.autoDownload = false; // manually handle
    autoUpdater.checkForUpdates();
});

// --------------------------------------
// UPDATE EVENTS
// --------------------------------------
autoUpdater.on("update-available", (info) => {
    console.log("Update available:", info.version);

    // Force-update dialog
    dialog.showMessageBoxSync({
        type: "info",
        buttons: ["Update Now"],
        defaultId: 0,
            title: "Update Required",
            message: `Version ${info.version} is available and required.`,
            detail: "The app must update before continuing.",
            noLink: true
    });

    // Try to close the main window
    try {
        if (mainWindow && !mainWindow.isDestroyed()) {
            mainWindow.close();
        }
    } catch (e) {
        // Fallback if close fails (very rare)
        if (mainWindow && !mainWindow.isDestroyed()) {
            mainWindow.loadURL("data:text/html,<h1>Updating…</h1>");
        }
    }

    autoUpdater.downloadUpdate();
    showUpdateWindow();
});

autoUpdater.on("download-progress", (progress) => {
    if (updateWindow) {
        updateWindow.webContents.send("update-progress", progress.percent.toFixed(0));
    }
});

autoUpdater.on("update-downloaded", () => {
    // Close the update window when done
    if (updateWindow && !updateWindow.isDestroyed()) {
        updateWindow.close();
        updateWindow = null;
    }

    // Install the update
    autoUpdater.quitAndInstall(true, true);
});

autoUpdater.on("checking-for-update", () => {
    console.log("Checking for updates...");
});

// --------------------------------------
// UPDATE WINDOW
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
        closable: false, // block closing
        title: "Updating...",
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    updateWindow.loadFile("update.html");

    // Prevent user from closing it
    updateWindow.on("close", (e) => {
        if (!autoUpdater.isDownloaded) {
            e.preventDefault();
        }
    });
}
