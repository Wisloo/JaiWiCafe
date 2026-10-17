import { useEffect, useRef, useState } from "react";
import { storage } from "./storage.js";

export function usePersistentState(key, initialValue, options = {}) {
  const { revive, serialize } = options;
  const serializeRef = useRef(serialize);
  serializeRef.current = serialize;
  const reviveRef = useRef(revive);
  reviveRef.current = revive;

  const [value, setValue] = useState(() => {
    const stored = storage.get(key);
    if (stored === undefined) {
      return typeof initialValue === "function" ? initialValue() : initialValue;
    }
    return reviveRef.current ? reviveRef.current(stored) : stored;
  });

  useEffect(() => {
    storage.set(key, serializeRef.current ? serializeRef.current(value) : value);
  }, [key, value]);

  return [value, setValue];
}
