import { useCallback, useEffect, useState } from "react";
import { electron, isElectron } from "./electron.js";

export function useFullScreen() {
  const [fullScreen, setFullScreen] = useState(false);

  useEffect(() => {
    if (!isElectron) return undefined;
    let active = true;

    electron.getFullScreen().then((value) => {
      if (active) setFullScreen(Boolean(value));
    });

    const unsubscribe = electron.onFullScreenChange((value) =>
      setFullScreen(Boolean(value))
    );

    return () => {
      active = false;
      if (typeof unsubscribe === "function") unsubscribe();
    };
  }, []);

  const toggle = useCallback(() => {
    if (!isElectron) return;
    electron.setFullScreen(!fullScreen);
  }, [fullScreen]);

  return { fullScreen, toggle, supported: isElectron };
}
