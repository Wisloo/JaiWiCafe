import { PlusIcon, MinusIcon, TrashIcon, ReceiptIcon } from "../icons.jsx";
import { TAX_RATE } from "../../data/pos.js";

export default function PosOrder({
  lines,
  totals,
  taxRate = TAX_RATE,
  onIncrement,
  onDecrement,
  onRemove,
  onClear,
  onCharge,
}) {
  const isEmpty = lines.length === 0;

  return (
    <aside className="card-warm no-print flex h-full min-h-0 flex-col overflow-hidden hover:transform-none">
      <div className="flex items-center justify-between border-b border-latte px-5 py-4">
        <h2 className="font-display text-2xl text-roast">Current order</h2>
        {!isEmpty && (
          <button
            type="button"
            onClick={onClear}
            className="font-mono text-xs font-bold uppercase tracking-wide text-cinnamon hover:underline"
          >
            Clear
          </button>
        )}
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-3 py-2">
        {isEmpty ? (
          <div className="grid h-full place-items-center px-6 py-16 text-center">
            <div>
              <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-croissant/30 text-caramel">
                <ReceiptIcon className="h-7 w-7" />
              </div>
              <p className="mt-3 font-display text-xl text-roast/75">
                No items yet
              </p>
              <p className="mt-1 text-sm text-roast/55">
                Tap a menu item to start the order.
              </p>
            </div>
          </div>
        ) : (
          <ul className="divide-y divide-latte">
            {lines.map((line) => (
              <li key={line.id} className="flex items-start gap-3 py-3">
                <div className="min-w-0 flex-1">
                  <p className="truncate font-display text-lg leading-tight text-roast">
                    {line.name}
                  </p>
                  <p className="font-mono text-xs text-roast/55">
                    ${line.price.toFixed(2)} each
                  </p>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    aria-label={`Remove one ${line.name}`}
                    onClick={() => onDecrement(line.id)}
                    className="grid h-8 w-8 place-items-center rounded-sm border border-roast/20 text-roast transition-colors hover:border-roast hover:bg-roast hover:text-cream"
                  >
                    <MinusIcon className="h-3.5 w-3.5" />
                  </button>
                  <span className="w-7 text-center font-mono text-base font-bold tabular-nums text-roast">
                    {line.qty}
                  </span>
                  <button
                    type="button"
                    aria-label={`Add one ${line.name}`}
                    onClick={() => onIncrement(line.id)}
                    className="grid h-8 w-8 place-items-center rounded-sm border border-roast/20 text-roast transition-colors hover:border-roast hover:bg-roast hover:text-cream"
                  >
                    <PlusIcon className="h-3.5 w-3.5" />
                  </button>
                </div>

                <span className="w-16 text-right font-mono text-base font-bold tabular-nums text-caramel">
                  ${(line.price * line.qty).toFixed(2)}
                </span>

                <button
                  type="button"
                  aria-label={`Remove ${line.name}`}
                  onClick={() => onRemove(line.id)}
                  className="grid h-8 w-8 place-items-center rounded-sm text-roast/40 transition-colors hover:bg-cinnamon/10 hover:text-cinnamon"
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="border-t border-latte bg-parchment px-5 py-4">
        <dl className="space-y-1.5 font-mono text-sm">
          <div className="flex justify-between text-roast/75">
            <dt>Subtotal</dt>
            <dd className="tabular-nums">${totals.subtotal.toFixed(2)}</dd>
          </div>
          <div className="flex justify-between text-roast/75">
            <dt>Tax ({(taxRate * 100).toFixed(3)}%)</dt>
            <dd className="tabular-nums">${totals.tax.toFixed(2)}</dd>
          </div>
          <div className="mt-2 flex items-center justify-between border-t border-dashed border-caramel/40 pt-2.5">
            <dt className="font-display text-xl text-roast">Total</dt>
            <dd className="font-display text-3xl tabular-nums text-caramel">
              ${totals.total.toFixed(2)}
            </dd>
          </div>
        </dl>

        <button
          type="button"
          disabled={isEmpty}
          onClick={onCharge}
          className="btn-primary mt-4 w-full text-lg disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0 disabled:hover:bg-caramel disabled:hover:shadow-none"
        >
          Charge ${totals.total.toFixed(2)}
        </button>
      </div>
    </aside>
  );
}
