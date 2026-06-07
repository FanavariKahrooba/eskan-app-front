"use client";

import { motion } from "framer-motion";
import { Table, usePosStore } from "../store/use-pos-store";

export default function PosTableCard({ table }: { table: Table }) {
  const setActive = usePosStore((s) => s.setActiveTable);

  const getColor = () => {
    switch (table.status) {
      case "free":
        return "bg-green-500";
      case "seated":
        return "bg-blue-500";
      case "ordered":
        return "bg-yellow-500";
      case "bill":
        return "bg-red-500";
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => setActive(table.id)}
      className={`cursor-pointer rounded-xl p-6 text-white ${getColor()}`}
    >
      <div className="text-lg font-semibold">{table.name}</div>

      <div className="text-sm opacity-80 mt-1">
        {table.status === "free" && "خالی"}
        {table.status === "seated" && "نشسته"}
        {table.status === "ordered" && "در حال سرو"}
        {table.status === "bill" && "درخواست صورتحساب"}
      </div>
    </motion.div>
  );
}
