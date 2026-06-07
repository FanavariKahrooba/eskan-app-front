"use client"

import { ALL_WIDGETS } from "@/utils/widget-registry"
import { AnimatePresence, motion } from "framer-motion"


export default function WidgetSelectorModal({ open, onClose, onAdd, activeIds }: any) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 bg-black/40 backdrop-blur flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.92, opacity: 0 }}
            className="
            bg-white
            w-[720px]
            rounded-2xl
            shadow-2xl
            p-6
            "
          >
            <h2 className="text-lg font-semibold mb-5">افزودن ویجت</h2>

            <div className="grid grid-cols-3 gap-4">
              {ALL_WIDGETS.map((w) => {
                const Icon = w.icon
                const active = activeIds.includes(w.id)

                return (
                  <button
                    key={w.id}
                    disabled={active}
                    onClick={() => onAdd(w)}
                    className={`
                    border border-gray-200
                    rounded-xl
                    p-4
                    flex flex-col items-center gap-2
                    transition
                    hover:bg-gray-50
                    ${active && "opacity-40 cursor-not-allowed"}
                    `}
                  >
                    <Icon size={20} />

                    <span className="text-sm">{w.title}</span>
                  </button>
                )
              })}
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={onClose}
                className="
                px-4 py-2
                rounded-lg
                bg-black
                text-white
                "
              >
                بستن
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
