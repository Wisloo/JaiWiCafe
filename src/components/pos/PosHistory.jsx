import { useEffect } from "react";
import { CloseIcon, HistoryIcon, ReceiptIcon } from "../icons.jsx";

const money = (value) => `$${value.toFixed(2)}`;

function Stat({ label, value }) {
  return (
    <div className="px-3 py-3">
      <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-roast/55">
        {label}
      </div>
      <div className="font-display text-xl tabular-nums text-roast">{value}</div>
    </div>
  );
}

export default function PosHistory({ open, history, onClose, onSelect }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (event) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const gross = history.reduce((sum, r) => sum + r.totals.total, 0);
  const items = history.reduce((sum, r) => sum + r.totals.count, 0);

  return (
    <div
      className="no-print fixed inset-0 z-50 grid place-items-center bg-espresso/70 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Order history"
    >
      <div className="card-warm reveal flex max-h-[85vh] w-full max-w-lg flex-col overflow-hidden hover:transform-none">
        <div className="flex items-center justify-between bg-roast px-5 py-4 text-cream">
          <div className="flex items-center gap-2">
            <HistoryIcon className="h-5 w-5 text-caramel" />
            <h2 className="font-display text-2xl text-croissant">
              Order history
            </h2>
          </div>
          <button
            type="button"
            aria-label="Close history"
            onClick={onClose}
            className="grid h-9 w-9 place-items-center rounded-sm border border-latte/25 transition-colors hover:bg-latte/10"
          >
            <CloseIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="grid grid-cols-3 divide-x divide-latte border-b border-latte bg-parchment text-center">
          <Stat label="Orders" value={history.length} />
          <Stat label="Items" value={items} />
          <Stat label="Gross" value={money(gross)} />
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto">
          {history.length === 0 ? (
            <div className="grid place-items-center px-6 py-16 text-center">
              <div>
                <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-croissant/30 text-caramel">
                  <ReceiptIcon className="h-7 w-7" />
                </div>
                <p className="mt-3 font-display text-xl text-roast/75">
                  No sales yet
                </p>
                <p className="mt-1 text-sm text-roast/55">
                  Completed orders will show up here.
                </p>
              </div>
            </div>
          ) : (
            <ul className="divide-y divide-latte">
              {history.map((receipt) => (
                <li key={`${receipt.number}-${receipt.createdAt.getTime()}`}>
                  <button
                    type="button"
                    onClick={() => onSelect(receipt)}
                    className="flex w-full items-center gap-3 px-5 py-3 text-left transition-colors hover:bg-caramel/5"
                  >
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-sm bg-caramel/10 font-mono text-xs font-bold text-caramel">
                      #{receipt.number}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-mono text-sm text-roast">
                        {receipt.createdAt.toLocaleDateString([], {
                          month: "short",
                          day: "2-digit",
                        })}{" "}
                        ·{" "}
                        {receipt.createdAt.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                      <span className="block text-xs text-roast/55">
                        {receipt.totals.count} item
                        {receipt.totals.count === 1 ? "" : "s"}
                      </span>
                    </span>
                    <span className="font-display text-xl tabular-nums text-caramel">
                      {money(receipt.totals.total)}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
