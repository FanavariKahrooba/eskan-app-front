"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";
import { Inbox } from "lucide-react";

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
}

export default function EmptyState({
  title = "موردی یافت نشد",
  description = "در حال حاضر داده‌ای برای نمایش وجود ندارد.",
  icon,
  action,
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
      className="flex min-h-[260px] flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-white p-8 text-center"
    >
      <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-50 text-gray-500">
        {icon || <Inbox size={22} />}
      </div>

      <h3 className="text-sm font-semibold text-gray-950">{title}</h3>

      {description && (
        <p className="mt-2 max-w-md text-sm leading-6 text-gray-500">
          {description}
        </p>
      )}

      {action && <div className="mt-5">{action}</div>}
    </motion.div>
  );
}
