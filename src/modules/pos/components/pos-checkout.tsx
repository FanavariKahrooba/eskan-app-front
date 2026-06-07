"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { usePosStore } from "../store/use-pos-store";

export default function PosCheckout() {
  const [open, setOpen] = useState(false);

  const cart = usePosStore((s) => s.cart);

  const total = cart.reduce((sum, item) => {
    return sum + item.price * item.qty;
  }, 0);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="w-full bg-green-600 text-white py-3 rounded-lg"
      >
        پرداخت
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 bg-black/40 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="bg-white dark:bg-neutral-900 p-6 rounded-xl w-96"
            >
              <div className="text-lg font-semibold mb-4">پرداخت سفارش</div>

              <div className="flex justify-between mb-6">
                <span>جمع کل</span>
                <span>{total.toLocaleString()} تومان</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button className="bg-blue-600 text-white py-3 rounded">
                  کارت
                </button>

                <button className="bg-neutral-200 dark:bg-neutral-700 py-3 rounded">
                  نقدی
                </button>
              </div>

              <button
                onClick={() => setOpen(false)}
                className="mt-4 text-sm text-neutral-500"
              >
                بستن
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
