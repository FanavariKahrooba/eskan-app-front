"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const items = [
  {
    title: "مانیتورینگ سراهای محله",
    description: "پایش سلامت عملیاتی، امکانات، کیفیت داده و اتصال به اسکان",
    href: "/monitoring/halls",
    tone: "from-sky-500 to-blue-700",
  },
  {
    title: "مانیتورینگ اسکان",
    description: "پایش ظرفیت، درخواست‌ها، رزروها، اشغال و لاگ‌های اسکان",
    href: "/monitoring/shelter",
    tone: "from-violet-500 to-purple-700",
  },
];

export function MonitoringNavigationCards() {
  return (
    <div dir="rtl" className="grid grid-cols-1 gap-5 md:grid-cols-2">
      {items.map((item, index) => (
        <motion.div
          key={item.href}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.08 }}
          whileHover={{ y: -4, scale: 1.01 }}
        >
          <Link
            href={item.href}
            className={`block rounded-3xl bg-gradient-to-br ${item.tone} p-6 text-white shadow-sm`}
          >
            <h3 className="text-xl font-black">{item.title}</h3>
            <p className="mt-3 text-sm leading-7 text-white/80">
              {item.description}
            </p>
            <div className="mt-6 inline-flex rounded-2xl bg-white/15 px-4 py-2 text-sm font-bold">
              ورود به داشبورد
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}
