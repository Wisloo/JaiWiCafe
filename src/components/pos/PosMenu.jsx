import { useState } from "react";
import { menu, categories } from "../../data/menu.js";
import { PlusIcon } from "../icons.jsx";

const accents = [
  "border-l-caramel",
  "border-l-cinnamon",
  "border-l-croissant",
  "border-l-caramel-deep",
];

const tabs = ["All", ...categories];

export default function PosMenu({ onAdd, quantities }) {
  const [active, setActive] = useState("All");
  const items =
    active === "All" ? menu : menu.filter((item) => item.category === active);

  return (
    <section aria-label="Menu" className="flex min-h-0 flex-col">
      <div
        role="tablist"
        aria-label="Menu categories"
        className="no-print sticky top-[77px] z-20 flex flex-wrap gap-2.5 bg-cream/85 py-3 backdrop-blur-sm"
      >
        {tabs.map((tab) => {
          const isActive = active === tab;
          return (
            <button
              key={tab}
              role="tab"
              aria-selected={isActive}
              onClick={() => setActive(tab)}
              className={`chip-warm ${
                isActive
                  ? "bg-caramel text-cream shadow-[0_8px_18px_rgba(199,122,35,0.32)]"
                  : "border border-latte bg-white text-roast/80 hover:border-caramel/50 hover:text-caramel"
              }`}
            >
              {tab}
            </button>
          );
        })}
      </div>

      <ul className="grid gap-3.5 pb-6 sm:grid-cols-2 xl:grid-cols-3">
        {items.map((item, index) => {
          const qty = quantities[item.id] ?? 0;
          return (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => onAdd(item)}
                className={`card-warm group flex h-full w-full flex-col overflow-hidden border-l-4 text-left ${accents[index % accents.length]}`}
              >
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-linear-to-br from-croissant/70 to-latte">
                  <img
                    src={item.image}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    onError={(event) => {
                      event.currentTarget.style.display = "none";
                    }}
                    className="h-full w-full object-cover transition-transform duration-[600ms] ease-out group-hover:scale-105"
                  />
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 bg-linear-to-t from-roast/45 via-transparent to-transparent"
                  />

                  {item.tag && (
                    <span className="absolute bottom-2 left-2 rounded-full bg-white/90 px-2.5 py-0.5 font-mono text-[11px] font-bold uppercase tracking-wide text-caramel-deep backdrop-blur-sm">
                      {item.tag}
                    </span>
                  )}
                  {qty > 0 && (
                    <span className="absolute right-2 top-2 grid h-7 min-w-7 place-items-center rounded-full bg-caramel px-1.5 font-mono text-xs font-bold text-cream shadow-[0_6px_16px_rgba(58,47,43,0.35)]">
                      {qty}
                    </span>
                  )}
                </div>

                <div className="flex flex-1 flex-col justify-between gap-3 p-4">
                  <h3 className="font-display text-lg leading-tight text-roast">
                    {item.name}
                  </h3>

                  <div className="flex items-center justify-between">
                    <span className="font-display text-xl text-caramel">
                      ${item.price.toFixed(2)}
                    </span>
                    <span className="flex items-center gap-1 rounded-sm bg-caramel/10 px-2.5 py-1.5 font-mono text-xs font-bold uppercase tracking-wide text-caramel transition-colors group-hover:bg-caramel group-hover:text-cream">
                      <PlusIcon className="h-3.5 w-3.5" />
                      Add
                    </span>
                  </div>
                </div>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
