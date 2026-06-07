"use client";

import { Search } from "lucide-react";

export default function PosTopbar() {
  return (
    <div className="h-16 border-b dark:border-neutral-800 flex items-center justify-between px-6">
      <div className="text-lg font-semibold">میز ۱۲</div>

      <div className="flex items-center gap-3 bg-neutral-100 dark:bg-neutral-800 px-3 py-2 rounded-lg">
        <Search size={18} />
        <input
          placeholder="جستجوی محصول..."
          className="bg-transparent outline-none"
        />
      </div>

      <div className="text-sm text-neutral-500">سالن</div>
    </div>
  );
}
