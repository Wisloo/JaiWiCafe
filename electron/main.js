import { app, BrowserWindow, Menu, dialog, ipcMain } from "electron";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  loadWindowState,
  ensureVisible,
  trackWindowState,
} from "./window-state.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DEV_URL = "http://localhost:5173";

let mainWindow = null;

function showAbout(target) {
  const options = {
    type: "info",
    title: "About JaiWiCafe",
    message: `JaiWiCafe ${app.getVersion()}`,
    detail: [
      "Point of Sale",
      "Small-batch roasted \u2014 brewed with aloha.",
      "",
      `Electron ${process.versions.electron}`,
      `Chromium ${process.versions.chrome}`,
      `Node ${process.versions.node}`,
    ].join("\n"),
    buttons: ["OK"],
    noLink: true,
  };

  return target
    ? dialog.showMessageBox(target, options)
    : dialog.showMessageBox(options);
}

function buildMenu() {
  const template = [
    {
      label: "File",
      submenu: [{ role: "quit" }],
    },
    {
      label: "Edit",
      submenu: [
        { role: "undo" },
        { role: "redo" },
        { type: "separator" },
        { role: "cut" },
        { role: "copy" },
        { role: "paste" },
        { role: "selectAll" },
      ],
    },
    {
      label: "View",
      submenu: [
        { role: "reload" },
        { role: "forceReload" },
        { role: "toggleDevTools" },
        { type: "separator" },
        { role: "resetZoom" },
        { role: "zoomIn" },
        { role: "zoomOut" },
        { type: "separator" },
        { role: "togglefullscreen" },
      ],
    },
    {
      role: "help",
      submenu: [
        {
          label: "About JaiWiCafe",
          click: (_item, win) => showAbout(win ?? mainWindow),
        },
      ],
    },
  ];

  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}

function registerIpc() {
  ipcMain.handle("app:get-version", () => app.getVersion());

  ipcMain.handle("window:get-fullscreen", (event) => {
    const win = BrowserWindow.fromWebContents(event.sender);
    return win ? win.isFullScreen() : false;
  });

  ipcMain.handle("window:set-fullscreen", (event, flag) => {
    const win = BrowserWindow.fromWebContents(event.sender);
    if (!win) return false;
    win.setFullScreen(Boolean(flag));
    return win.isFullScreen();
  });
}

function createWindow() {
  const state = loadWindowState();

  const options = {
    width: state.width,
    height: state.height,
    minWidth: 960,
    minHeight: 600,
    backgroundColor: "#fbf7f2",
    show: false,
    title: "JaiWiCafe",
    webPreferences: {
      preload: path.join(__dirname, "preload.cjs"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  };

  if (ensureVisible(state)) {
    options.x = state.x;
    options.y = state.y;
  }

  const win = new BrowserWindow(options);
  mainWindow = win;

  if (state.maximized) win.maximize();
  trackWindowState(win);

  win.once("ready-to-show", () => win.show());

  win.on("enter-full-screen", () =>
    win.webContents.send("window:fullscreen-changed", true)
  );
  win.on("leave-full-screen", () =>
    win.webContents.send("window:fullscreen-changed", false)
  );

  win.on("closed", () => {
    if (mainWindow === win) mainWindow = null;
  });

  win.webContents.on("did-fail-load", (_event, code, description) => {
    console.error("Page failed to load:", code, description);
  });

  const useDevServer = !app.isPackaged && process.env.JAIWI_FORCE_FILE !== "1";

  if (useDevServer) {
    win.loadURL(DEV_URL);
  } else {
    win.loadFile(path.join(__dirname, "..", "dist", "index.html"));
  }
}

const gotLock = app.requestSingleInstanceLock();

if (!gotLock) {
  app.quit();
} else {
  app.on("second-instance", () => {
    const win = mainWindow ?? BrowserWindow.getAllWindows()[0];
    if (win) {
      if (win.isMinimized()) win.restore();
      win.focus();
    }
  });

  app.whenReady().then(() => {
    registerIpc();
    buildMenu();
    createWindow();

    app.on("activate", () => {
      if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
  });

  app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit();
  });
}
