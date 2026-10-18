import { useEffect, useState } from "react";
import {
  CoffeeIcon,
  ClockIcon,
  HistoryIcon,
  SettingsIcon,
  FullscreenIcon,
  ExitFullscreenIcon,
} from "../icons.jsx";
import { useFullScreen } from "../../utils/useFullScreen.js";

function useClock() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return now;
}

export default function PosHeader({
  orderNumber,
  itemCount,
  storeName = "JaiWiCafe",
  onOpenHistory,
  onOpenSettings,
}) {
  const now = useClock();
  const { fullScreen, toggle, supported: canToggleFullScreen } = useFullScreen();

  return (
    <header className="no-print sticky top-0 z-30 bg-roast/95 text-cream backdrop-blur-md">
      <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-4 px-5 py-3">
        <div className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-md bg-linear-to-br from-caramel via-cinnamon to-caramel-deep text-cream shadow-[0_6px_16px_rgba(0,0,0,0.25)]">
            <CoffeeIcon className="h-6 w-6" />
          </span>
          <div className="leading-tight">
            <div className="font-display text-2xl tracking-tight text-croissant">
              {storeName}
            </div>
            <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-caramel">
              Point of Sale
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="rounded-sm border border-latte/20 px-3 py-1.5 text-right">
            <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-latte/60">
              Order
            </div>
            <div className="font-mono text-lg font-bold text-croissant">
              #{orderNumber}
            </div>
          </div>
          <div className="hidden rounded-sm border border-latte/20 px-3 py-1.5 text-right sm:block">
            <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-latte/60">
              Items
            </div>
            <div className="font-mono text-lg font-bold text-caramel">
              {itemCount}
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-sm border border-latte/20 px-3 py-2">
            <ClockIcon className="h-4 w-4 text-caramel" />
            <span className="font-mono text-sm tabular-nums text-latte">
              {now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={onOpenHistory}
              aria-label="Order history"
              title="Order history"
              className="grid h-9 w-9 place-items-center rounded-sm border border-latte/20 text-latte transition-colors hover:border-caramel hover:bg-caramel hover:text-cream"
            >
              <HistoryIcon className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={onOpenSettings}
              aria-label="Settings"
              title="Settings"
              className="grid h-9 w-9 place-items-center rounded-sm border border-latte/20 text-latte transition-colors hover:border-caramel hover:bg-caramel hover:text-cream"
            >
              <SettingsIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
      <div aria-hidden="true" className="warm-rule h-1 rounded-none" />
    </header>
  );
}
