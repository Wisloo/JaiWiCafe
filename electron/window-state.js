import { app, screen } from "electron";
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const DEFAULT_SIZE = { width: 1280, height: 800 };

const stateFile = () => path.join(app.getPath("userData"), "window-state.json");

export function loadWindowState() {
  try {
    const data = JSON.parse(readFileSync(stateFile(), "utf8"));
    if (typeof data.width === "number" && typeof data.height === "number") {
      return data;
    }
  } catch {
    /* first run or unreadable — fall through to defaults */
  }
  return { ...DEFAULT_SIZE };
}

export function ensureVisible(state) {
  if (typeof state.x !== "number" || typeof state.y !== "number") return false;
  return screen.getAllDisplays().some(({ workArea: area }) => {
    const withinX = state.x >= area.x - 40 && state.x + 80 <= area.x + area.width;
    const withinY = state.y >= area.y - 20 && state.y + 40 <= area.y + area.height;
    return withinX && withinY;
  });
}

export function trackWindowState(win) {
  let timer;

  const save = () => {
    if (win.isDestroyed() || win.isMinimized() || win.isFullScreen()) return;
    const bounds = win.getNormalBounds();
    const state = { ...bounds, maximized: win.isMaximized() };
    try {
      writeFileSync(stateFile(), JSON.stringify(state));
    } catch {
      /* ignore write failures */
    }
  };

  const schedule = () => {
    clearTimeout(timer);
    timer = setTimeout(save, 400);
  };

  win.on("resize", schedule);
  win.on("move", schedule);
  win.on("maximize", save);
  win.on("unmaximize", save);
  win.on("close", save);
}
