"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";

type Tone = "neutral" | "success" | "warning" | "danger" | "info" | "purple";

interface MonitoringStatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: ReactNode;
  tone?: Tone;
  wallboard?: boolean;
}

const normalToneClasses: Record<Tone, string> = {
  neutral: "border-slate-200 bg-white text-slate-950",
  success: "border-emerald-200 bg-emerald-50 text-emerald-950",
  warning: "border-amber-200 bg-amber-50 text-amber-950",
  danger: "border-rose-200 bg-rose-50 text-rose-950",
  info: "border-sky-200 bg-sky-50 text-sky-950",
  purple: "border-violet-200 bg-violet-50 text-violet-950",
};

const wallboardToneClasses: Record<Tone, string> = {
  neutral: "border-slate-700 bg-slate-900 text-white",
  success: "border-emerald-500/40 bg-emerald-500/10 text-emerald-100",
  warning: "border-amber-500/40 bg-amber-500/10 text-amber-100",
  danger: "border-rose-500/40 bg-rose-500/10 text-rose-100",
  info: "border-sky-500/40 bg-sky-500/10 text-sky-100",
  purple: "border-violet-500/40 bg-violet-500/10 text-violet-100",
};

export function MonitoringStatCard({
  title,
  value,
  subtitle,
  icon,
  tone = "neutral",
  wallboard = false,
}: MonitoringStatCardProps) {
  const classes = wallboard
    ? wallboardToneClasses[tone]
    : normalToneClasses[tone];

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ duration: 0.2 }}
      className={`relative overflow-hidden rounded-3xl border p-5 shadow-sm ${classes}`}
    >
      <div className="absolute -left-8 -top-8 h-24 w-24 rounded-full bg-white/10" />
      <div className="absolute -bottom-10 -right-10 h-28 w-28 rounded-full bg-white/10" />

      <div className="relative flex items-start justify-between gap-4">
        <div>
          <div className="text-sm font-semibold opacity-75">{title}</div>
          <div className="mt-4 text-4xl font-black tracking-tight">{value}</div>
          {subtitle ? (
            <div className="mt-3 text-xs opacity-70">{subtitle}</div>
          ) : null}
        </div>

        {icon ? (
          <div className="rounded-2xl bg-white/20 p-3">{icon}</div>
        ) : null}
      </div>
    </motion.div>
  );
}
