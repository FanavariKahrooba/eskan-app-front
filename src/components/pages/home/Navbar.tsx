"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Building2, Database, Menu, X } from "lucide-react";
import { useState } from "react";

const navItems = [
  { label: "خانه", href: "#home" },
  { label: "امکانات", href: "#features" },
  { label: "داشبورد", href: "#dashboard" },
  { label: "نقشه سراها", href: "#map" },
  { label: "فرآیند اسکان", href: "#workflow" },
  { label: "سوالات متداول", href: "#faq" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-zinc-950/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
        <Link href="#home" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-orange-400/20 bg-orange-500/10 text-orange-300">
            <Building2 className="h-5 w-5" />
          </div>
          <div>
            <div className="text-sm text-zinc-400">سامانه مدیریت اسکان</div>
            <div className="text-base font-extrabold text-white">
              سراهای محله
            </div>
          </div>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-zinc-300 transition hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex">
          <Link
            href="#cta"
            className="inline-flex items-center gap-2 rounded-2xl border border-orange-400/20 bg-orange-500/10 px-5 py-3 text-sm font-bold text-orange-300 transition hover:bg-orange-500/20"
          >
            <Database className="h-4 w-4" />
            درخواست دمو
          </Link>
        </div>

        <button
          onClick={() => setOpen((prev) => !prev)}
          className="inline-flex items-center justify-center rounded-xl border border-white/10 p-2 text-zinc-200 md:hidden"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <motion.div
          initial={{ opacity: 0, y: -14 }}
          animate={{ opacity: 1, y: 0 }}
          className="border-t border-white/10 bg-zinc-950/95 md:hidden"
        >
          <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-5">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="text-sm font-medium text-zinc-300 transition hover:text-white"
              >
                {item.label}
              </Link>
            ))}

            <Link
              href="#cta"
              onClick={() => setOpen(false)}
              className="mt-2 inline-flex items-center justify-center rounded-2xl border border-orange-400/20 bg-orange-500/10 px-5 py-3 text-sm font-bold text-orange-300"
            >
              درخواست دمو
            </Link>
          </div>
        </motion.div>
      )}
    </header>
  );
}
