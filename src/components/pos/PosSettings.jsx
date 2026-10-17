import { useEffect, useState } from "react";
import { CloseIcon, SettingsIcon, CheckIcon } from "../icons.jsx";
import { DEFAULT_SETTINGS } from "../../data/settings.js";

export default function PosSettings({ open, settings, onClose, onSave }) {
  const [draft, setDraft] = useState(settings);
  const [taxPct, setTaxPct] = useState("");

  useEffect(() => {
    if (!open) return;
    setDraft(settings);
    setTaxPct((settings.taxRate * 100).toFixed(3));
  }, [open, settings]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const update = (key) => (event) =>
    setDraft((current) => ({ ...current, [key]: event.target.value }));

  const submit = (event) => {
    event.preventDefault();
    const parsed = Number.parseFloat(taxPct);
    const taxRate = Number.isFinite(parsed) ? Math.max(0, parsed) / 100 : 0;
    onSave({
      storeName: draft.storeName.trim() || DEFAULT_SETTINGS.storeName,
      tagline: draft.tagline.trim(),
      footer: draft.footer.trim(),
      taxRate,
    });
  };

  const reset = () => {
    setDraft(DEFAULT_SETTINGS);
    setTaxPct((DEFAULT_SETTINGS.taxRate * 100).toFixed(3));
  };

  return (
    <div
      className="no-print fixed inset-0 z-50 grid place-items-center bg-espresso/70 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Settings"
    >
      <form
        onSubmit={submit}
        className="card-warm reveal w-full max-w-md overflow-hidden hover:transform-none"
      >
        <div className="flex items-center justify-between bg-roast px-5 py-4 text-cream">
          <div className="flex items-center gap-2">
            <SettingsIcon className="h-5 w-5 text-caramel" />
            <h2 className="font-display text-2xl text-croissant">Settings</h2>
          </div>
          <button
            type="button"
            aria-label="Close settings"
            onClick={onClose}
            className="grid h-9 w-9 place-items-center rounded-sm border border-latte/25 transition-colors hover:bg-latte/10"
          >
            <CloseIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="max-h-[70vh] space-y-4 overflow-y-auto p-5">
          <label className="block">
            <span className="mb-1 block font-mono text-xs uppercase tracking-[0.18em] text-roast/60">
              Store name
            </span>
            <input
              type="text"
              value={draft.storeName}
              onChange={update("storeName")}
              maxLength={40}
              className="field-warm"
            />
          </label>

          <label className="block">
            <span className="mb-1 block font-mono text-xs uppercase tracking-[0.18em] text-roast/60">
              Tagline
            </span>
            <input
              type="text"
              value={draft.tagline}
              onChange={update("tagline")}
              maxLength={80}
              className="field-warm"
            />
          </label>

          <label className="block">
            <span className="mb-1 block font-mono text-xs uppercase tracking-[0.18em] text-roast/60">
              Tax rate (%)
            </span>
            <input
              type="number"
              min="0"
              max="100"
              step="0.001"
              value={taxPct}
              onChange={(event) => setTaxPct(event.target.value)}
              className="field-warm"
            />
          </label>

          <label className="block">
            <span className="mb-1 block font-mono text-xs uppercase tracking-[0.18em] text-roast/60">
              Receipt footer
            </span>
            <input
              type="text"
              value={draft.footer}
              onChange={update("footer")}
              maxLength={80}
              className="field-warm"
            />
          </label>
        </div>

        <div className="flex items-center gap-3 border-t border-latte bg-parchment px-5 py-4">
          <button
            type="button"
            onClick={reset}
            className="font-mono text-xs font-bold uppercase tracking-wide text-cinnamon hover:underline"
          >
            Reset
          </button>
          <div className="ml-auto flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="btn-ghost"
            >
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              <CheckIcon className="h-4 w-4" />
              Save
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
