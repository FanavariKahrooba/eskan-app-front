"use client";

import { usePosStore } from "../store/use-pos-store";

export default function PosTabs() {
  const tabs = usePosStore((s) => s.tabs);
  const active = usePosStore((s) => s.activeTab);
  const setActive = usePosStore((s) => s.setActiveTab);
  const createTab = usePosStore((s) => s.createTab);

  return (
    <div className="flex gap-2 overflow-x-auto pb-3">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActive(tab.id)}
          className={`
          px-4 py-2 rounded-xl text-sm
          ${
            active === tab.id
              ? "bg-emerald-500 text-white"
              : "bg-white/5 text-neutral-400"
          }
          `}
        >
          {tab.title}
        </button>
      ))}

      <button
        onClick={() => createTab("سفارش جدید", "takeaway")}
        className="
        px-4 py-2
        rounded-xl
        bg-white/10
        text-white
        "
      >
        +
      </button>
    </div>
  );
}
