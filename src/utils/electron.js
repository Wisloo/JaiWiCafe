export const electron =
  typeof window !== "undefined" ? window.jaiwi ?? null : null;

export const isElectron = Boolean(electron);
