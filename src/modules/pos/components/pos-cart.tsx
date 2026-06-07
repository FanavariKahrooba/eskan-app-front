"use client";

import { usePosStore } from "../store/use-pos-store";
import PosCartItem from "./pos-cart-item";

export default function PosCart() {
  const tabs = usePosStore((s) => s.tabs);
  const activeTab = usePosStore((s) => s.activeTab);

  const tab = tabs.find((t) => t.id === activeTab);

  const total = tab?.items.reduce((a, b) => a + b.price * b.qty, 0) || 0;

  return (
    <div className="flex h-full flex-col">
      <div className="mb-4 text-lg font-semibold text-white">سفارش</div>

      <div className="flex-1 space-y-2 overflow-auto">
        {tab?.items.map((item) => (
          <PosCartItem key={item.id} item={item} />
        ))}
      </div>

      <div className="mt-4 border-t border-white/10 pt-4">
        <div className="flex justify-between text-sm text-neutral-300">
          <span>جمع کل</span>
          <span>{total.toLocaleString()} تومان</span>
        </div>

        <button
          className="
          mt-4
          w-full
          rounded-xl
          bg-emerald-500
          py-3
          text-sm
          text-white
          hover:bg-emerald-600
          "
        >
          ثبت سفارش
        </button>
      </div>
    </div>
  );
}
