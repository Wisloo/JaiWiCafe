const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("jaiwi", {
  isElectron: true,
  getVersion: () => ipcRenderer.invoke("app:get-version"),
  getFullScreen: () => ipcRenderer.invoke("window:get-fullscreen"),
  setFullScreen: (flag) => ipcRenderer.invoke("window:set-fullscreen", flag),
  onFullScreenChange: (callback) => {
    const listener = (_event, value) => callback(value);
    ipcRenderer.on("window:fullscreen-changed", listener);
    return () => ipcRenderer.removeListener("window:fullscreen-changed", listener);
  },
});
