const { app, BrowserWindow } = require('electron');

app.whenReady().then(() => {
    let win = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            nodeIntegration: false
        }
    });

    win.loadURL('https://www.google.com');
});
   
