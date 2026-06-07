"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
// import { ALL_WIDGETS } from "@/lib/menu-widgets"
import { X, Search } from "lucide-react";

export default function WidgetSelectorModal({
  open,
  onClose,
  selected = [],
  setSelected,
}: any) {
  const [search, setSearch] = useState("");

  const toggle = (id: string) => {
    if (selected.includes(id)) {
      setSelected(selected.filter((x: string) => x !== id));
    } else {
      setSelected([...selected, id]);
    }
  };

  // const filtered = ALL_WIDGETS.filter((w) => w.title.toLowerCase().includes(search.toLowerCase()))
  const filtered: any = [];
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white w-[720px] max-h-[80vh] rounded-2xl shadow-xl p-6"
          >
            {/* header */}

            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">افزودن ویجت</h2>

              <button onClick={onClose}>
                <X size={20} />
              </button>
            </div>

            {/* search */}

            <div className="flex items-center gap-2 border rounded-lg px-3 py-2 mb-4">
              <Search size={16} />

              <input
                placeholder="جستجوی ویجت..."
                className="outline-none w-full text-sm"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* widgets */}

            <div className="grid grid-cols-3 gap-3 overflow-y-auto max-h-[50vh]">
              {filtered.map((w: any) => {
                const Icon = w.icon;
                const active = selected.includes(w.id);

                return (
                  <motion.button
                    key={w.id}
                    whileHover={{ y: -3 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => toggle(w.id)}
                    className={`
                    border rounded-xl p-4 text-sm flex flex-col items-center gap-2
                    transition
                    ${active ? "bg-blue-50 border-blue-400" : "hover:bg-gray-50"}
                    `}
                  >
                    <Icon size={20} />

                    {w.title}
                  </motion.button>
                );
              })}
            </div>

            {/* footer */}

            <div className="flex justify-end mt-6">
              <button
                onClick={onClose}
                className="bg-black text-white px-4 py-2 rounded-lg text-sm"
              >
                تایید
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
