"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Product, ModifierOption } from "../store/use-pos-store";
import { usePosStore } from "../store/use-pos-store";

export default function PosModifierModal({
  product,
  open,
  onClose,
}: {
  product: Product;
  open: boolean;
  onClose: () => void;
}) {
  const addToCart = usePosStore((s) => s.addToCart);

  const [selected, setSelected] = useState<ModifierOption[]>([]);

  const toggle = (option: ModifierOption) => {
    if (selected.find((o) => o.id === option.id)) {
      setSelected(selected.filter((o) => o.id !== option.id));
    } else {
      setSelected([...selected, option]);
    }
  };

  const submit = () => {
    addToCart(product, selected);
    onClose();
    setSelected([]);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur"
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.9 }}
            className="w-[420px] rounded-3xl border border-white/10 bg-neutral-900 p-6 shadow-2xl"
          >
            <div className="text-lg font-semibold mb-4">{product.name}</div>

            {product.modifiers?.map((group) => (
              <div key={group.id} className="mb-4">
                <div className="text-sm mb-2 text-neutral-400">
                  {group.name}
                </div>

                <div className="flex flex-wrap gap-2">
                  {group.options.map((opt) => {
                    const active = selected.find((o) => o.id === opt.id);

                    return (
                      <button
                        key={opt.id}
                        onClick={() => toggle(opt)}
                        className={`
                        px-3 py-1 rounded-full text-xs
                        border
                        ${
                          active
                            ? "bg-emerald-500 text-white border-emerald-500"
                            : "border-white/10 text-neutral-400"
                        }
                        `}
                      >
                        {opt.name}
                        {opt.price && ` +${opt.price}`}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}

            <button
              onClick={submit}
              className="w-full mt-4 rounded-xl bg-emerald-500 py-2 text-white"
            >
              افزودن به سفارش
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
