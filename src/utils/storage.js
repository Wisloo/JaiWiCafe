const NAMESPACE = "jaiwicafe";

const testAvailability = () => {
  try {
    const key = `${NAMESPACE}:__test__`;
    window.localStorage.setItem(key, "1");
    window.localStorage.removeItem(key);
    return true;
  } catch {
    return false;
  }
};

const canPersist = typeof window !== "undefined" && testAvailability();
const memory = new Map();

const fullKey = (key) => `${NAMESPACE}:${key}`;

export const storage = {
  get(key) {
    const k = fullKey(key);
    if (!canPersist) return memory.get(k);
    try {
      const raw = window.localStorage.getItem(k);
      if (raw == null) return undefined;
      return JSON.parse(raw);
    } catch {
      return undefined;
    }
  },

  set(key, value) {
    const k = fullKey(key);
    if (!canPersist) {
      memory.set(k, value);
      return;
    }
    try {
      window.localStorage.setItem(k, JSON.stringify(value));
    } catch {
      memory.set(k, value);
    }
  },

  remove(key) {
    const k = fullKey(key);
    memory.delete(k);
    if (!canPersist) return;
    try {
      window.localStorage.removeItem(k);
    } catch {
      /* ignore */
    }
  },
};
