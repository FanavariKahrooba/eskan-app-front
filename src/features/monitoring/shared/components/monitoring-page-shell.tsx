"use client";

import Link from "next/link";
import { ReactNode } from "react";
import { motion } from "framer-motion";

interface MonitoringPageShellProps {
  title: string;
  description?: string;
  children: ReactNode;
  wallboardHref?: string;
  backHref?: string;
  actions?: ReactNode;
}

export function MonitoringPageShell({
  title,
  description,
  children,
  wallboardHref,
  backHref,
  actions,
}: MonitoringPageShellProps) {
  return (
    <main dir="rtl" className="min-h-screen bg-slate-50 px-4 py-6 md:px-8">
      <div className="mx-auto max-w-[1800px] space-y-6">
        <motion.header
          initial={{ opacity: 0, y: -14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
        >
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="mb-2 flex flex-wrap items-center gap-2">
                {backHref ? (
                  <Link
                    href={backHref}
                    className="rounded-full border border-slate-200 px-3 py-1 text-xs font-bold text-slate-600 transition hover:bg-slate-50"
                  >
                    بازگشت
                  </Link>
                ) : null}

                <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-bold text-sky-700">
                  مرکز پایش
                </span>
              </div>

              <h1 className="text-2xl font-black tracking-tight text-slate-950 md:text-3xl">
                {title}
              </h1>

              {description ? (
                <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-500">
                  {description}
                </p>
              ) : null}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {actions}

              {wallboardHref ? (
                <Link
                  href={wallboardHref}
                  target="_blank"
                  className="rounded-2xl bg-slate-950 px-4 py-3 text-sm font-bold text-white transition hover:bg-slate-800"
                >
                  نمایش Wallboard
                </Link>
              ) : null}
            </div>
          </div>
        </motion.header>

        {children}
      </div>
    </main>
  );
}
