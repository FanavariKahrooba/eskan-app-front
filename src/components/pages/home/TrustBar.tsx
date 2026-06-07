"use client";

import { motion } from "framer-motion";
import {
  Bed,
  Building2,
  ClipboardCheck,
  Database,
  MapPin,
  Utensils,
} from "lucide-react";

const items = [
  "نمایش مکانی سراها",
  "ثبت ظرفیت اسکان",
  "مدیریت مسافران",
  "گردش کار تأیید",
  "کنترل آنلاین ظرفیت",
  "مدیریت وعده‌های غذایی",
];

const icons = [MapPin, Building2, Bed, ClipboardCheck, Database, Utensils];

export default function TrustBar() {
  return (
    <section className="border-b border-white/10 bg-white/[0.02]">
      <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
        <div className="mb-5 text-center text-sm text-zinc-500">
          زیرساخت یکپارچه برای مدیریت ظرفیت، استقرار، درخواست‌ها و خدمات اسکان
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
          {items.map((item, index) => {
            const Icon = icons[index];
            return (
              <motion.div
                key={item}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-sm font-bold text-zinc-200"
              >
                <Icon className="h-4 w-4 text-orange-300" />
                {item}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
