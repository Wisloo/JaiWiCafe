import { useEffect, useMemo, useState } from "react";
import PosHeader from "./components/pos/PosHeader.jsx";
import PosMenu from "./components/pos/PosMenu.jsx";
import PosOrder from "./components/pos/PosOrder.jsx";
import PosCheckout from "./components/pos/PosCheckout.jsx";
import PosReceipt from "./components/pos/PosReceipt.jsx";
import PosHistory from "./components/pos/PosHistory.jsx";
import PosSettings from "./components/pos/PosSettings.jsx";
import {
  computeTotals,
  round2,
  serializeHistory,
  reviveHistory,
} from "./data/pos.js";
import { DEFAULT_SETTINGS, HISTORY_LIMIT } from "./data/settings.js";
import { usePersistentState } from "./utils/usePersistentState.js";

const FIRST_ORDER_NUMBER = 101;

export default function App() {
  const [lines, setLines] = usePersistentState("order", []);
  const [orderNumber, setOrderNumber] = usePersistentState(
    "orderNumber",
    FIRST_ORDER_NUMBER
  );
  const [history, setHistory] = usePersistentState("history", [], {
    revive: reviveHistory,
    serialize: serializeHistory,
  });
  const [settings, setSettings] = usePersistentState("settings", DEFAULT_SETTINGS);

  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [activeReceipt, setActiveReceipt] = useState(null);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  useEffect(() => {
    const floor = history.reduce((max, r) => Math.max(max, r.number), 0) + 1;
    setOrderNumber((n) => Math.max(n, FIRST_ORDER_NUMBER, floor));
  }, [history, setOrderNumber]);

  const totals = useMemo(
    () => computeTotals(lines, settings.taxRate),
    [lines, settings.taxRate]
  );

  const quantities = useMemo(
    () => Object.fromEntries(lines.map((line) => [line.id, line.qty])),
    [lines]
  );

  const addItem = (item) => {
    setLines((current) => {
      const existing = current.find((line) => line.id === item.id);
      if (existing) {
        return current.map((line) =>
          line.id === item.id ? { ...line, qty: line.qty + 1 } : line
        );
      }
      return [...current, { id: item.id, name: item.name, price: item.price, qty: 1 }];
    });
  };

  const increment = (id) =>
    setLines((current) =>
      current.map((line) =>
        line.id === id ? { ...line, qty: line.qty + 1 } : line
      )
    );

  const decrement = (id) =>
    setLines((current) =>
      current.flatMap((line) => {
        if (line.id !== id) return [line];
        if (line.qty <= 1) return [];
        return [{ ...line, qty: line.qty - 1 }];
      })
    );

  const removeItem = (id) =>
    setLines((current) => current.filter((line) => line.id !== id));

  const clearOrder = () => setLines([]);

  const completeSale = (tender) => {
    const receipt = {
      number: orderNumber,
      createdAt: new Date(),
      lines,
      totals,
      tender: round2(tender),
      change: round2(tender - totals.total),
      meta: {
        storeName: settings.storeName,
        tagline: settings.tagline,
        footer: settings.footer,
        taxRate: settings.taxRate,
      },
    };

    setHistory((current) => [receipt, ...current].slice(0, HISTORY_LIMIT));
    setOrderNumber((n) => n + 1);
    setLines([]);
    setCheckoutOpen(false);
    setActiveReceipt({ receipt, fromHistory: false });
  };

  const saveSettings = (next) => {
    setSettings({ ...DEFAULT_SETTINGS, ...next });
    setSettingsOpen(false);
  };

  return (
    <>
      <div className="warm-bg" aria-hidden="true" />
      <PosHeader
        orderNumber={orderNumber}
        itemCount={totals.count}
        storeName={settings.storeName}
        onOpenHistory={() => setHistoryOpen(true)}
        onOpenSettings={() => setSettingsOpen(true)}
      />

      <main className="mx-auto grid max-w-[1400px] gap-5 px-5 py-5 lg:grid-cols-[1fr_380px]">
        <PosMenu onAdd={addItem} quantities={quantities} />

        <div className="lg:sticky lg:top-[92px] lg:h-[calc(100dvh-112px)]">
          <PosOrder
            lines={lines}
            totals={totals}
            taxRate={settings.taxRate}
            onIncrement={increment}
            onDecrement={decrement}
            onRemove={removeItem}
            onClear={clearOrder}
            onCharge={() => setCheckoutOpen(true)}
          />
        </div>
      </main>

      <PosCheckout
        open={checkoutOpen}
        totals={totals}
        onClose={() => setCheckoutOpen(false)}
        onComplete={completeSale}
      />

      <PosReceipt
        receipt={activeReceipt?.receipt ?? null}
        fromHistory={activeReceipt?.fromHistory ?? false}
        onClose={() => setActiveReceipt(null)}
      />

      <PosHistory
        open={historyOpen}
        history={history}
        onClose={() => setHistoryOpen(false)}
        onSelect={(receipt) => {
          setHistoryOpen(false);
          setActiveReceipt({ receipt, fromHistory: true });
        }}
      />

      <PosSettings
        open={settingsOpen}
        settings={settings}
        onClose={() => setSettingsOpen(false)}
        onSave={saveSettings}
      />
    </>
  );
}
