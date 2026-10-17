import { useEffect, useState } from "react";
import { CloseIcon, CheckIcon } from "../icons.jsx";

const keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "0", "back"];

export default function PosCheckout({ open, totals, onClose, onComplete }) {
  const [tender, setTender] = useState("");

  useEffect(() => {
    if (open) setTender("");
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const tenderValue = Number.parseFloat(tender) || 0;
  const change = Math.round((tenderValue - totals.total) * 100) / 100;
  const canComplete = tenderValue >= totals.total;

  const press = (key) => {
    setTender((current) => {
      if (key === "back") return current.slice(0, -1);
      if (key === "." && current.includes(".")) return current;
      const next = current + key;
      if (next.replace(".", "").length > 8) return current;
      return next;
    });
  };

  const quick = (amount) => setTender(amount.toFixed(2));

  return (
    <div
      className="no-print fixed inset-0 z-50 grid place-items-center bg-espresso/70 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Checkout"
    >
      <div className="card-warm reveal w-full max-w-md overflow-hidden hover:transform-none">
        <div className="flex items-center justify-between bg-roast px-5 py-4 text-cream">
          <h2 className="font-display text-2xl text-croissant">Take payment</h2>
          <button
            type="button"
            aria-label="Close checkout"
            onClick={onClose}
            className="grid h-9 w-9 place-items-center rounded-sm border border-latte/25 transition-colors hover:bg-latte/10"
          >
            <CloseIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="p-5">
          <div className="flex items-end justify-between">
            <span className="font-mono text-xs uppercase tracking-[0.18em] text-roast/60">
              Amount due
            </span>
            <span className="font-display text-3xl text-caramel">
              ${totals.total.toFixed(2)}
            </span>
          </div>

          <div className="mt-4 rounded-sm border border-latte bg-parchment p-3">
            <div className="font-mono text-xs uppercase tracking-[0.18em] text-roast/60">
              Cash tendered
            </div>
            <div className="font-display text-4xl tabular-nums text-roast">
              ${tender || "0.00"}
            </div>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => quick(totals.total)}
              className="chip-warm border border-latte bg-white text-roast/80 hover:border-caramel/50 hover:text-caramel"
            >
              Exact
            </button>
            {[10, 20, 50, 100].map((amount) => (
              <button
                key={amount}
                type="button"
                onClick={() => quick(amount)}
                className="chip-warm border border-latte bg-white text-roast/80 hover:border-caramel/50 hover:text-caramel"
              >
                ${amount}
              </button>
            ))}
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2">
            {keys.map((key) => (
              <button
                key={key}
                type="button"
                aria-label={key === "back" ? "Backspace" : key}
                onClick={() => press(key)}
                className="rounded-sm border border-latte bg-white py-3 font-display text-2xl text-roast transition-colors hover:bg-caramel hover:text-cream"
              >
                {key === "back" ? "\u232B" : key}
              </button>
            ))}
          </div>

          <div className="mt-4 flex items-center justify-between rounded-sm bg-croissant/35 px-4 py-3">
            <span className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-roast/70">
              Change due
            </span>
            <span className="font-display text-3xl tabular-nums text-roast">
              ${canComplete ? change.toFixed(2) : "0.00"}
            </span>
          </div>

          <button
            type="button"
            disabled={!canComplete}
            onClick={() => onComplete(tenderValue)}
            className="btn-primary mt-4 w-full text-lg disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0 disabled:hover:bg-caramel disabled:hover:shadow-none"
          >
            <CheckIcon className="h-5 w-5" />
            Complete sale
          </button>
        </div>
      </div>
    </div>
  );
}
