const { contextBridge } = require("electron");


contextBridge.exposeInMainWorld("startupSound", {
  play: () => {
    const audio = new Audio("startup.wav");
    audio.play();
  }
});


contextBridge.exposeInMainWorld("api", {
    navigate: (url) => {
        document.getElementById("browser").src = url;
    }
});
