"use client"
import { motion } from "framer-motion";
import { DataGridButton, DataGridIcon } from "../shared";

export interface DataGridErrorProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export function DataGridError({
  title = "خطا در دریافت اطلاعات",
  message = "در هنگام دریافت داده‌ها مشکلی رخ داده است.",
  onRetry,
}: DataGridErrorProps) {
  return (
    <div className="grid min-h-72 place-items-center p-8">
      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="max-w-md rounded-[2rem] border border-rose-100 bg-rose-50/60 p-8 text-center shadow-xl shadow-rose-900/5 backdrop-blur"
      >
        <motion.div
          animate={{ rotate: [0, -4, 4, -2, 2, 0] }}
          transition={{ repeat: Infinity, duration: 2.5 }}
          className="mx-auto mb-5 grid h-20 w-20 place-items-center rounded-3xl bg-white text-rose-600 shadow-lg shadow-rose-500/10"
        >
          <DataGridIcon name="error" size={38} />
        </motion.div>

        <h3 className="text-base font-bold text-rose-700">{title}</h3>
        <p className="mt-2 text-sm leading-6 text-rose-600/80">{message}</p>

        {onRetry ? (
          <DataGridButton
            className="mt-5"
            variant="danger"
            leftIcon={<DataGridIcon name="refresh" />}
            onClick={onRetry}
          >
            تلاش مجدد
          </DataGridButton>
        ) : null}
      </motion.div>
    </div>
  );
}
