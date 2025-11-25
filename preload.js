const { contextBridge } = require("electron");

contextBridge.exposeInMainWorld("api", {
    navigate: (url) => {
        document.getElementById("browser").src = url;
    }
});
