"use client"
import { motion } from "framer-motion";

export interface DataGridLoadingProps {
  label?: string;
}

export function DataGridLoading({
  label = "در حال بارگذاری اطلاعات...",
}: DataGridLoadingProps) {
  return (
    <div className="grid min-h-72 place-items-center p-8">
      <motion.div
        initial={{ opacity: 0, y: 12, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="flex flex-col items-center gap-5"
      >
        <div className="relative h-20 w-20">
          <motion.div
            className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 opacity-20 blur-xl"
            animate={{ scale: [1, 1.25, 1], rotate: [0, 180, 360] }}
            transition={{ repeat: Infinity, duration: 2.2, ease: "linear" }}
          />

          <motion.div
            className="absolute inset-2 rounded-full border-4 border-slate-200 border-t-indigo-600"
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 0.9, ease: "linear" }}
          />

          <motion.div
            className="absolute inset-6 rounded-full bg-gradient-to-br from-indigo-600 to-fuchsia-600 shadow-lg shadow-indigo-500/25"
            animate={{ scale: [0.85, 1.08, 0.85] }}
            transition={{ repeat: Infinity, duration: 1.2 }}
          />
        </div>

        <div className="text-center">
          <div className="text-sm font-semibold text-slate-700">{label}</div>
          <div className="mt-1 text-xs text-slate-400">
            لطفاً چند لحظه صبر کنید
          </div>
        </div>
      </motion.div>
    </div>
  );
}
