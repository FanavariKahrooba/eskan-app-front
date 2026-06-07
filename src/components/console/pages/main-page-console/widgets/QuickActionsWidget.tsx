"use client";

// import { MENU_ITEMS } from "@/config/menu"
import { motion } from "framer-motion";
import Link from "next/link";

export function QuickAccess() {
  // استخراج تمام لینک‌های نهایی (برگ‌ها) برای دسترسی سریع
  const allLinks: any[] = [];

  // MENU_ITEMS.forEach((item) => {
  //   if (item.path) allLinks.push(item)
  //   if (item.children) {
  //     item.children.forEach((child) => {
  //       if (child.path) allLinks.push(child)
  //       // اگر فرزند هم فرزند داشت (مثل سفارشات)
  //       if (child.children) {
  //         child.children.forEach((subChild) => {
  //           if (subChild.path) allLinks.push(subChild)
  //         })
  //       }
  //     })
  //   }
  // })

  // فقط ۶ مورد اول را برای شلوغ نشدن نمایش می‌دهیم
  const shortcuts = allLinks.slice(0, 6);

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {shortcuts.map((item, index) => {
        const Icon = item.icon;
        return (
          <Link href={item.path} key={item.id}>
            <motion.div
              whileHover={{
                y: -5,
                boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.05)",
              }}
              className="bg-white p-4 rounded-2xl border border-slate-100 flex flex-col items-center justify-center gap-3 transition-colors hover:border-blue-200 group"
            >
              <div className="p-3 rounded-xl bg-slate-50 group-hover:bg-blue-50 transition-colors text-slate-600 group-hover:text-blue-600">
                <Icon size={24} />
              </div>
              <span className="text-xs font-medium text-slate-700">
                {item.title}
              </span>
            </motion.div>
          </Link>
        );
      })}
    </div>
  );
}
