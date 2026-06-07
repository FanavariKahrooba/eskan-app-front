"use client";

import { usePosStore } from "../store/use-pos-store";

const categories = ["همه", "برگر", "پیتزا", "سالاد", "نوشیدنی"];

export default function PosCategories() {
  const { category, setCategory } = usePosStore();

  return (
    <div className="p-3 space-y-2">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => setCategory(cat === "همه" ? null : cat)}
          className={`w-full text-right p-3 rounded-lg transition
          ${
            category === cat
              ? "bg-blue-600 text-white"
              : "bg-neutral-100 dark:bg-neutral-800"
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
