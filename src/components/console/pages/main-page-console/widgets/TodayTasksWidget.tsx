"use client";
import { CheckCircle2 } from "lucide-react";
import { useState } from "react";

export function TodayTasksWidget() {
  const [tasks, setTasks] = useState([
    { title: "بررسی سفارش‌های جدید", done: false },
    { title: "تماس با پشتیبانی", done: false },
    { title: "ارسال گزارش مالی", done: true },
  ]);

  const toggle = (index: number) => {
    setTasks(tasks.map((t, i) => i === index ? { ...t, done: !t.done } : t));
  };

  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
      <h2 className="font-bold text-slate-700 mb-4">کارهای امروز</h2>
      <ul className="space-y-3">
        {tasks.map((task, i) => (
          <li
            key={i}
            onClick={() => toggle(i)}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <CheckCircle2 
              size={20} 
              className={`transition-colors ${task.done ? "text-emerald-500" : "text-slate-300 group-hover:text-emerald-400"}`} 
            />
            <span className={`text-sm ${task.done ? "line-through text-slate-400" : "text-slate-700"}`}>
              {task.title}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
