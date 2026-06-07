"use client";

import { motion } from "framer-motion";
import { usePosStore } from "../store/use-pos-store";
import PosTableCard from "./pos-table-card";

export default function PosTables() {
  const tables = usePosStore((s) => s.tables);

  return (
    <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-6">
      {tables.map((table) => (
        <motion.div
          key={table.id}
          layout
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <PosTableCard table={table} />
        </motion.div>
      ))}
    </div>
  );
}
