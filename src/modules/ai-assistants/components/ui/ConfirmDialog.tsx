"use client";

import { motion, AnimatePresence } from "framer-motion";

interface Props {
  open: boolean;
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  danger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  open,
  title,
  description,
  confirmText = "تایید",
  cancelText = "انصراف",
  danger,
  onConfirm,
  onCancel,
}: Props) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-[90] bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCancel}
          />

          <motion.div
            className="fixed inset-0 z-[91] flex items-center justify-center p-4"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
          >
            <div className="w-full max-w-md rounded-3xl border border-white/10 bg-slate-950 p-6 shadow-2xl">
              <h3 className="text-lg font-bold text-white">{title}</h3>
              {description && (
                <p className="mt-2 text-sm leading-7 text-slate-400">
                  {description}
                </p>
              )}

              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={onCancel}
                  className="rounded-2xl border border-white/10 px-4 py-2 text-sm text-slate-300"
                >
                  {cancelText}
                </button>
                <button
                  onClick={onConfirm}
                  className={`rounded-2xl px-4 py-2 text-sm text-white ${
                    danger
                      ? "bg-red-600 hover:bg-red-500"
                      : "bg-cyan-600 hover:bg-cyan-500"
                  }`}
                >
                  {confirmText}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
