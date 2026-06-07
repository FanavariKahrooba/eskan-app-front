"use client";

import { useState } from "react";
import { CheckCircle2, Circle } from "lucide-react";

export function TodoWidget() {
  const [tasks, setTasks] = useState([
    { id: 1, text: "بررسی تیکت‌های پشتیبانی", done: false },
    { id: 2, text: "بروزرسانی موجودی انبار", done: true },
    { id: 3, text: "تایید واریزی‌های امروز", done: false },
  ]);

  return (
    <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
      <h3 className="mb-4 text-sm font-bold text-slate-700">کارهای امروز</h3>

      <div className="space-y-3">
        {tasks.map((task) => (
          <div
            key={task.id}
            onClick={() =>
              setTasks((prev) =>
                prev.map((t) =>
                  t.id === task.id ? { ...t, done: !t.done } : t,
                ),
              )
            }
            className="group flex cursor-pointer items-center gap-3"
          >
            {task.done ? (
              <CheckCircle2 size={18} className="text-emerald-500" />
            ) : (
              <Circle
                size={18}
                className="text-slate-300 group-hover:text-blue-400"
              />
            )}

            <span
              className={`text-xs ${
                task.done ? "text-slate-400 line-through" : "text-slate-600"
              }`}
            >
              {task.text}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
