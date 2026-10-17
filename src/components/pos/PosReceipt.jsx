import { CloseIcon, CheckIcon, PrinterIcon, HistoryIcon } from "../icons.jsx";
import { TAX_RATE } from "../../data/pos.js";
import { DEFAULT_SETTINGS } from "../../data/settings.js";

export default function PosReceipt({ receipt, onClose, fromHistory = false }) {
  if (!receipt) return null;

  const meta = receipt.meta ?? {};
  const storeName = meta.storeName ?? DEFAULT_SETTINGS.storeName;
  const tagline = meta.tagline ?? DEFAULT_SETTINGS.tagline;
  const footer = meta.footer ?? DEFAULT_SETTINGS.footer;
  const taxRate = meta.taxRate ?? TAX_RATE;

  return (
    <div
      className="no-print fixed inset-0 z-50 grid place-items-center bg-espresso/70 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={fromHistory ? `Receipt ${receipt.number}` : "Receipt"}
    >
      <div className="reveal w-full max-w-sm">
        <div className="card-warm overflow-hidden hover:transform-none">
          {fromHistory ? (
            <div className="flex items-center gap-2 bg-roast px-5 py-3 text-cream">
              <HistoryIcon className="h-5 w-5 text-caramel" />
              <span className="font-display text-xl text-croissant">
                Receipt #{receipt.number}
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2 bg-caramel px-5 py-3 text-cream">
              <CheckIcon className="h-5 w-5" />
              <span className="font-display text-xl">Sale complete</span>
            </div>
          )}

          <div
            id="receipt"
            className="max-h-[60vh] overflow-y-auto bg-white px-6 py-5 font-mono text-[13px] text-roast"
          >
            <div className="text-center">
              <div className="font-display text-2xl text-caramel">
                {storeName}
              </div>
              <div className="mt-0.5 text-[11px] uppercase tracking-[0.2em] text-roast/60">
                {tagline}
              </div>
            </div>

            <div className="my-3 border-t border-dashed border-roast/30" />

            <div className="flex justify-between">
              <span>Order</span>
              <span className="font-bold">#{receipt.number}</span>
            </div>
            <div className="flex justify-between">
              <span>Date</span>
              <span>
                {receipt.createdAt.toLocaleDateString([], {
                  year: "numeric",
                  month: "short",
                  day: "2-digit",
                })}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Time</span>
              <span>
                {receipt.createdAt.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>

            <div className="my-3 border-t border-dashed border-roast/30" />

            <ul className="space-y-1.5">
              {receipt.lines.map((line) => (
                <li key={line.id}>
                  <div className="flex justify-between gap-3">
                    <span className="truncate">{line.name}</span>
                    <span className="tabular-nums">
                      ${(line.price * line.qty).toFixed(2)}
                    </span>
                  </div>
                  <div className="text-[11px] text-roast/55">
                    {line.qty} × {line.price.toFixed(2)}
                  </div>
                </li>
              ))}
            </ul>

            <div className="my-3 border-t border-dashed border-roast/30" />

            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="tabular-nums">
                ${receipt.totals.subtotal.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Tax ({(taxRate * 100).toFixed(3)}%)</span>
              <span className="tabular-nums">
                ${receipt.totals.tax.toFixed(2)}
              </span>
            </div>
            <div className="mt-1 flex justify-between text-base font-bold">
              <span>Total</span>
              <span className="tabular-nums">
                ${receipt.totals.total.toFixed(2)}
              </span>
            </div>

            <div className="my-3 border-t border-dashed border-roast/30" />

            <div className="flex justify-between">
              <span>Cash</span>
              <span className="tabular-nums">
                ${receipt.tender.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between font-bold">
              <span>Change</span>
              <span className="tabular-nums">
                ${receipt.change.toFixed(2)}
              </span>
            </div>

            <div className="mt-4 text-center text-[11px] text-roast/60">
              {footer} — {receipt.totals.count} item
              {receipt.totals.count === 1 ? "" : "s"}
            </div>
          </div>
        </div>

        <div className="mt-4 flex gap-3">
          <button
            type="button"
            onClick={() => window.print()}
            className="btn-ghost flex-1 bg-white"
          >
            <PrinterIcon className="h-4 w-4" />
            Print
          </button>
          <button type="button" onClick={onClose} className="btn-primary flex-1">
            <CloseIcon className="h-4 w-4" />
            {fromHistory ? "Close" : "New order"}
          </button>
        </div>
      </div>
    </div>
  );
}
