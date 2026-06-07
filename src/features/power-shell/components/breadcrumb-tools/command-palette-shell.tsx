"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Search, CornerDownLeft, X } from "lucide-react";
import { useKeyboardShortcut } from "../../hooks/use-keyboard-shortcut";
import { useRouter } from "next/navigation";

export interface CommandPaletteAction {
  id: string;
  title: string;
  subtitle?: string;
  group?: string;
  keywords?: string[];
  href?: string;
  onSelect?: () => void;
}

interface Props {
  actions?: CommandPaletteAction[];
}

export default function CommandPaletteShell({ actions = [] }: Props) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);

  const router = useRouter();

  useKeyboardShortcut({ key: "k", enabled: true }, (event: any) => {
    if (event.ctrlKey || event.metaKey) {
      event.preventDefault();
      setOpen((prev) => !prev);
    }
  });

  useKeyboardShortcut({ key: "Escape", enabled: open }, () => {
    closePalette();
  });

  const filtered = useMemo(() => {
    if (!query.trim()) return actions;

    const q = query.toLowerCase();

    return actions.filter((item) => {
      const text = [
        item.title,
        item.subtitle,
        item.group,
        ...(item.keywords || []),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return text.includes(q);
    });
  }, [actions, query]);

  function closePalette() {
    setOpen(false);
    setQuery("");
    setActiveIndex(0);
  }

  function selectAction(item: CommandPaletteAction | undefined) {
    if (!item) return;

    if (item.href) {
      router.push(item.href);
    }

    if (item.onSelect) {
      item.onSelect();
    }

    closePalette();
  }

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (!filtered.length) return;

      if (event.key === "ArrowDown") {
        event.preventDefault();
        setActiveIndex((prev) => (prev + 1) % filtered.length);
      }

      if (event.key === "ArrowUp") {
        event.preventDefault();
        setActiveIndex(
          (prev) => (prev - 1 + filtered.length) % filtered.length,
        );
      }

      if (event.key === "Enter") {
        event.preventDefault();
        selectAction(filtered[activeIndex]);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, filtered, activeIndex]);

  useEffect(() => {
    if (!open) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[120] flex items-start justify-center bg-black/30 px-4 pt-20 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={closePalette}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Command Palette"
            initial={{ opacity: 0, y: -14, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            onMouseDown={(e) => e.stopPropagation()}
            className="w-full max-w-2xl overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl"
          >
            <div className="flex h-14 items-center gap-3 border-b border-gray-100 px-4">
              <Search size={18} className="text-gray-400" />

              <input
                autoFocus
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setActiveIndex(0);
                }}
                placeholder="جستجو در صفحات، ابزارها و عملیات‌ها..."
                className="h-full w-full bg-transparent text-sm outline-none placeholder:text-gray-400"
              />

              <button
                type="button"
                onClick={closePalette}
                className="inline-flex h-8 w-8 items-center justify-center rounded-md text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
                aria-label="بستن"
              >
                <X size={16} />
              </button>
            </div>

            <div className="max-h-[420px] overflow-y-auto p-2">
              {filtered.length ? (
                filtered.map((item, index) => {
                  const active = index === activeIndex;

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onMouseEnter={() => setActiveIndex(index)}
                      onClick={() => selectAction(item)}
                      className={[
                        "w-full rounded-xl border px-3 py-3 text-right transition",
                        active
                          ? "border-gray-200 bg-gray-50"
                          : "border-transparent hover:bg-gray-50",
                      ].join(" ")}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <div className="truncate text-sm font-medium text-gray-900">
                            {item.title}
                          </div>

                          {item.subtitle && (
                            <div className="mt-1 truncate text-xs text-gray-500">
                              {item.subtitle}
                            </div>
                          )}
                        </div>

                        <div className="shrink-0 text-gray-400">
                          <CornerDownLeft size={14} />
                        </div>
                      </div>

                      {item.group && (
                        <div className="mt-2 text-[11px] text-gray-400">
                          {item.group}
                        </div>
                      )}
                    </button>
                  );
                })
              ) : (
                <div className="px-3 py-8 text-center text-sm text-gray-500">
                  نتیجه‌ای یافت نشد.
                </div>
              )}
            </div>

            <div className="flex items-center justify-between border-t border-gray-100 px-4 py-2 text-[11px] text-gray-400">
              <span>Enter برای انتخاب</span>
              <span>Ctrl/Cmd + K</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
