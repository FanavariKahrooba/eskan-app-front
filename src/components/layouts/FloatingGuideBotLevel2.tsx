/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowRight,
  Bot,
  ChevronLeft,
  FileCheck2,
  FileSearch,
  HelpCircle,
  Home,
  Info,
  Layers3,
  Map,
  MessageCircleMore,
  MoonStar,
  Phone,
  Search,
  SendHorizonal,
  ShieldCheck,
  Sparkles,
  SunMedium,
  X,
  type LucideIcon,
} from "lucide-react";

type ThemeMode = "system" | "light" | "dark";

type GuideItem = {
  id: string;
  title: string;
  short?: string;
  answer: string;
  icon?: LucideIcon;
  category: "شروع" | "درخواست" | "پیگیری" | "سراها" | "پشتیبانی";
  keywords?: string[];
  links?: {
    title: string;
    href: string;
    icon?: LucideIcon;
    variant?: "primary" | "secondary" | "success";
  }[];
};

const STORAGE_KEYS = {
  open: "guidebot:l2:open",
  theme: "guidebot:l2:theme",
  category: "guidebot:l2:category",
  selected: "guidebot:l2:selected",
  seenHint: "guidebot:l2:seenHint",
};

const guideItems: GuideItem[] = [
  {
    id: "start",
    title: "برای شروع استفاده از سامانه چه کاری انجام دهم؟",
    short: "مسیر پیشنهادی برای شروع",
    category: "شروع",
    icon: Sparkles,
    keywords: ["شروع", "ابتدا", "سامانه", "راهنما"],
    answer:
      "برای شروع، بهتر است ابتدا سراها را بررسی کنید، سپس وارد بخش ثبت درخواست شوید. بعد از ثبت موفق، کد رهگیری دریافت می‌کنید و در ادامه از طریق بخش پیگیری می‌توانید وضعیت درخواست خود را مشاهده کنید.",
    links: [
      { title: "مشاهده سراها", href: "/", icon: Map, variant: "success" },
      {
        title: "ثبت درخواست جدید",
        href: "/request/new",
        icon: FileCheck2,
        variant: "primary",
      },
    ],
  },
  {
    id: "new-request",
    title: "چطور درخواست جدید ثبت کنم؟",
    short: "راهنمای ثبت فرم",
    category: "درخواست",
    icon: FileCheck2,
    keywords: ["ثبت", "فرم", "درخواست جدید"],
    answer:
      "برای ثبت درخواست، وارد بخش ثبت درخواست جدید شوید و اطلاعات فردی، همراهان و شرایط لازم را با دقت کامل وارد کنید. ثبت فرم به معنی شروع بررسی است و به‌تنهایی پذیرش قطعی محسوب نمی‌شود.",
    links: [
      {
        title: "ورود به ثبت درخواست",
        href: "/request/new",
        icon: FileCheck2,
        variant: "primary",
      },
    ],
  },
  {
    id: "track",
    title: "چطور درخواست ثبت‌شده را پیگیری کنم؟",
    short: "پیگیری با کد رهگیری",
    category: "پیگیری",
    icon: FileSearch,
    keywords: ["پیگیری", "رهگیری", "کد رهگیری", "وضعیت"],
    answer:
      "اگر قبلاً درخواست خود را ثبت کرده‌اید، با استفاده از کد رهگیری می‌توانید وضعیت درخواست را مشاهده کنید. اگر نتیجه‌ای پیدا نشد، ابتدا کد رهگیری را دوباره بررسی کنید.",
    links: [
      {
        title: "پیگیری درخواست",
        href: "/track",
        icon: FileSearch,
        variant: "secondary",
      },
    ],
  },
  {
    id: "map",
    title: "آیا می‌توانم قبل از ثبت درخواست سراها را ببینم؟",
    short: "نمایش سراها روی نقشه و فهرست",
    category: "سراها",
    icon: Map,
    keywords: ["سرا", "نقشه", "لیست", "فهرست"],
    answer:
      "بله. شما می‌توانید قبل از ثبت درخواست، سراها را روی نقشه یا در فهرست مشاهده کنید و بر اساس موقعیت، وضعیت و نوع پذیرش، بررسی دقیق‌تری انجام دهید.",
    links: [
      { title: "مشاهده سراها", href: "/", icon: Map, variant: "success" },
    ],
  },
  {
    id: "reserve",
    title: "آیا ثبت درخواست به معنی پذیرش نهایی است؟",
    short: "وضعیت پذیرش",
    category: "درخواست",
    icon: ShieldCheck,
    keywords: ["پذیرش", "نهایی", "ثبت درخواست"],
    answer:
      "خیر. ثبت درخواست صرفاً شروع فرآیند بررسی است و پذیرش نهایی پس از ارزیابی شرایط، ظرفیت و مدارک موردنیاز تعیین می‌شود.",
  },
  {
    id: "docs",
    title: "برای مراجعه چه مدارکی لازم است؟",
    short: "مدارک موردنیاز",
    category: "درخواست",
    icon: Info,
    keywords: ["مدارک", "مراجعه", "هویتی"],
    answer:
      "برای تکمیل فرآیند پذیرش، همراه داشتن مدارک هویتی معتبر متقاضی و همراهان ضروری است. اگر اطلاعات مراجعه برای شما نمایش داده شد، بهتر است پیش از حضور، با مرکز موردنظر هماهنگ کنید.",
  },
  {
    id: "lost-code",
    title: "اگر کد رهگیری را گم کنم چه کار کنم؟",
    short: "بازیابی و پشتیبانی",
    category: "پشتیبانی",
    icon: Phone,
    keywords: ["گم شدن", "کد رهگیری", "پشتیبانی", "بازیابی"],
    answer:
      "اگر کد رهگیری را گم کرده‌اید، از طریق بخش پشتیبانی یا شماره تماس تعریف‌شده، درخواست بررسی یا راهنمایی برای بازیابی وضعیت خود را ثبت کنید.",
    links: [
      {
        title: "تماس با پشتیبانی",
        href: "tel:02100000000",
        icon: Phone,
        variant: "secondary",
      },
    ],
  },
];

const categories = [
  "همه",
  "شروع",
  "درخواست",
  "پیگیری",
  "سراها",
  "پشتیبانی",
] as const;
type CategoryFilter = (typeof categories)[number];

function readLocal(key: string, fallback: string) {
  if (typeof window === "undefined") return fallback;
  return localStorage.getItem(key) ?? fallback;
}

function writeLocal(key: string, value: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, value);
}

function normalizeText(text: string) {
  return text
    .toLowerCase()
    .replace(/ي/g, "ی")
    .replace(/ك/g, "ک")
    .replace(/\s+/g, " ")
    .trim();
}

function useTypedText(text: string, speed = 18, enabled = true) {
  const [displayed, setDisplayed] = useState(enabled ? "" : text);

  useEffect(() => {
    if (!enabled) {
      setDisplayed(text);
      return;
    }

    setDisplayed("");
    let i = 0;
    const timer = setInterval(() => {
      i += 1;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) clearInterval(timer);
    }, speed);

    return () => clearInterval(timer);
  }, [text, speed, enabled]);

  return displayed;
}

export default function FloatingGuideBotLevel2() {
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [themeMode, setThemeMode] = useState<ThemeMode>("system");
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>("همه");
  const [query, setQuery] = useState("");
  const [showHint, setShowHint] = useState(false);

  const autoOpenedRef = useRef(false);

  useEffect(() => {
    setMounted(true);

    const savedOpen = readLocal(STORAGE_KEYS.open, "false") === "true";
    const savedTheme = readLocal(STORAGE_KEYS.theme, "system") as ThemeMode;
    const savedCategory = readLocal(
      STORAGE_KEYS.category,
      "همه",
    ) as CategoryFilter;
    const savedSelected = readLocal(STORAGE_KEYS.selected, "");
    const seenHint = readLocal(STORAGE_KEYS.seenHint, "false") === "true";

    setIsOpen(savedOpen);
    setThemeMode(savedTheme);
    setActiveCategory(savedCategory);
    setSelectedId(savedSelected || null);

    if (!seenHint && !savedOpen) {
      const t1 = setTimeout(() => setShowHint(true), 1800);
      const t2 = setTimeout(() => {
        if (!autoOpenedRef.current) {
          setIsOpen(true);
          autoOpenedRef.current = true;
        }
      }, 4200);

      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;
    writeLocal(STORAGE_KEYS.open, String(isOpen));
  }, [isOpen, mounted]);

  useEffect(() => {
    if (!mounted) return;
    writeLocal(STORAGE_KEYS.theme, themeMode);
  }, [themeMode, mounted]);

  useEffect(() => {
    if (!mounted) return;
    writeLocal(STORAGE_KEYS.category, activeCategory);
  }, [activeCategory, mounted]);

  useEffect(() => {
    if (!mounted) return;
    writeLocal(STORAGE_KEYS.selected, selectedId ?? "");
  }, [selectedId, mounted]);

  useEffect(() => {
    if (showHint) writeLocal(STORAGE_KEYS.seenHint, "true");
  }, [showHint]);

  const selectedItem = useMemo(
    () => guideItems.find((item) => item.id === selectedId) ?? null,
    [selectedId],
  );

  const siteDark =
    mounted &&
    typeof document !== "undefined" &&
    document.documentElement.classList.contains("dark");

  const isDark = themeMode === "dark" || (themeMode === "system" && siteDark);

  const filteredItems = useMemo(() => {
    const byCategory =
      activeCategory === "همه"
        ? guideItems
        : guideItems.filter((item) => item.category === activeCategory);

    const normalizedQuery = normalizeText(query);
    if (!normalizedQuery) return byCategory;

    return byCategory.filter((item) => {
      const haystack = normalizeText(
        [
          item.title,
          item.short,
          item.answer,
          item.category,
          ...(item.keywords || []),
        ]
          .filter(Boolean)
          .join(" "),
      );
      return haystack.includes(normalizedQuery);
    });
  }, [activeCategory, query]);

  const suggestedItems = useMemo(() => guideItems.slice(0, 3), []);

  if (!mounted) return null;

  return (
    <div
      dir="rtl"
      className="fixed bottom-4 left-4 z-[9999] flex flex-col items-end"
    >
      <AnimatePresence>
        {showHint && !isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            className="mb-3 w-[220px] rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 shadow-xl dark:border-white/10 dark:bg-zinc-900 dark:text-zinc-200"
          >
            <div className="flex items-start gap-2">
              <Bot className="mt-0.5 h-4 w-4 text-orange-500" />
              <div>
                کمکت کنم؟
                <div className="mt-1 text-xs font-medium text-slate-500 dark:text-zinc-400">
                  روی راهنما بزن و سوالت رو انتخاب کن.
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className={`mb-4 flex h-[min(78vh,680px)] w-[min(92vw,420px)] origin-bottom-left flex-col overflow-hidden rounded-[28px] border border-slate-200/80 bg-white/95 shadow-[0_24px_80px_rgba(15,23,42,0.18)] backdrop-blur-xl ${
              isDark
                ? "dark border-white/10 bg-zinc-950/90 shadow-[0_30px_100px_rgba(0,0,0,0.45)]"
                : ""
            }`}
          >
            <div className="shrink-0 border-b border-slate-200/80 bg-gradient-to-br from-sky-100 via-white to-orange-50 px-4 pt-4 dark:border-white/10 dark:from-sky-950/40 dark:via-zinc-950 dark:to-orange-950/20">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex items-center gap-3">
                  <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-3xl bg-gradient-to-br from-sky-500 via-cyan-500 to-blue-600 text-white shadow-xl shadow-sky-500/30">
                    <Bot className="h-6 w-6" />
                    <span className="absolute -left-0.5 -top-0.5 h-3 w-3 rounded-full border-2 border-white bg-emerald-500 dark:border-zinc-950" />
                  </div>

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="truncate text-sm font-black text-slate-950 dark:text-white">
                        دستیار راهنما
                      </h3>
                      <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-extrabold text-emerald-700 dark:border-emerald-400/20 dark:bg-emerald-500/10 dark:text-emerald-300">
                        آنلاین
                      </span>
                    </div>
                    <p className="mt-1 line-clamp-2 text-[11px] leading-5 text-slate-600 dark:text-zinc-400">
                      جستجو کن یا از سوالات آماده استفاده کن.
                    </p>
                  </div>
                </div>

                <div className="shrink-0 flex items-center gap-2">
                  <ThemeSwitcher
                    mode={themeMode}
                    setMode={setThemeMode}
                    compact
                  />
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="rounded-2xl border border-slate-200 bg-white/90 p-2.5 text-slate-600 transition hover:text-slate-950 dark:border-white/10 dark:bg-white/5 dark:text-zinc-300 dark:hover:text-white"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="pb-4 pt-4">
                <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white/90 px-3 py-3 shadow-sm dark:border-white/10 dark:bg-white/5">
                  <Search className="h-4 w-4 shrink-0 text-slate-400" />
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="جستجو در سوالات..."
                    className="w-full min-w-0 bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400 dark:text-white dark:placeholder:text-zinc-500"
                  />
                  {query && (
                    <button
                      type="button"
                      onClick={() => setQuery("")}
                      className="shrink-0 rounded-xl p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="min-h-0 flex-1 overflow-hidden bg-gradient-to-b from-slate-50 to-white dark:from-zinc-950 dark:to-zinc-950">
              <div className="h-full overflow-y-auto px-4 py-4">
                {!selectedItem ? (
                  <GuideMenuLevel2
                    items={filteredItems}
                    suggestedItems={suggestedItems}
                    activeCategory={activeCategory}
                    setActiveCategory={setActiveCategory}
                    onSelect={(item) => {
                      setSelectedId(item.id);
                      setShowHint(false);
                    }}
                    query={query}
                  />
                ) : (
                  <GuideAnswerLevel2
                    item={selectedItem}
                    query={query}
                    onBack={() => setSelectedId(null)}
                  />
                )}
              </div>
            </div>

            <div className="shrink-0 border-t border-slate-200/80 bg-white/90 p-3 dark:border-white/10 dark:bg-zinc-950/90">
              <div className="grid grid-cols-3 gap-2">
                <QuickAction href="/" icon={Home} label="خانه" />
                <QuickAction
                  href="/request/new"
                  icon={FileCheck2}
                  label="ثبت"
                />
                <QuickAction href="/track" icon={FileSearch} label="پیگیری" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        type="button"
        onClick={() => {
          setIsOpen((prev) => !prev);
          setShowHint(false);
        }}
        whileTap={{ scale: 0.95 }}
        whileHover={{ scale: 1.04 }}
        className="group relative flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 via-amber-500 to-orange-600 text-white shadow-[0_20px_60px_rgba(249,115,22,0.45)]"
      >
        <span className="absolute inset-0 rounded-full bg-orange-400/40 blur-xl transition duration-300 group-hover:bg-orange-400/60" />
        <span className="absolute inset-0 animate-ping rounded-full border border-orange-300/40" />

        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.span
              key="close"
              initial={{ opacity: 0, rotate: -25, scale: 0.7 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: 25, scale: 0.7 }}
              transition={{ duration: 0.15 }}
              className="relative"
            >
              <X className="h-6 w-6" />
            </motion.span>
          ) : (
            <motion.span
              key="chat"
              initial={{ opacity: 0, rotate: 25, scale: 0.7 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: -25, scale: 0.7 }}
              transition={{ duration: 0.15 }}
              className="relative"
            >
              <MessageCircleMore className="h-6 w-6" />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}

function ThemeSwitcher({
  mode,
  setMode,
  compact = false,
}: {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  compact?: boolean;
}) {
  const items: { value: ThemeMode; label: string; icon: LucideIcon }[] = [
    { value: "system", label: "سیستم", icon: Sparkles },
    { value: "light", label: "روشن", icon: SunMedium },
    { value: "dark", label: "تیره", icon: MoonStar },
  ];

  return (
    <div className="flex items-center gap-1 rounded-2xl border border-slate-200 bg-white/90 p-1 dark:border-white/10 dark:bg-white/5">
      {items.map((item) => {
        const Icon = item.icon;
        const active = item.value === mode;
        return (
          <button
            key={item.value}
            type="button"
            onClick={() => setMode(item.value)}
            className={`rounded-xl transition ${
              compact ? "px-2 py-2" : "px-2.5 py-2"
            } ${
              active
                ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                : "text-slate-600 hover:bg-slate-100 dark:text-zinc-300 dark:hover:bg-white/10"
            }`}
            title={item.label}
          >
            <span className="flex items-center gap-1.5">
              <Icon className="h-3.5 w-3.5" />
              {!compact && (
                <span className="text-[11px] font-black">{item.label}</span>
              )}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function GuideMenuLevel2({
  items,
  suggestedItems,
  onSelect,
  activeCategory,
  setActiveCategory,
  query,
}: {
  items: GuideItem[];
  suggestedItems: GuideItem[];
  onSelect: (item: GuideItem) => void;
  activeCategory: CategoryFilter;
  setActiveCategory: (value: CategoryFilter) => void;
  query: string;
}) {
  const hasQuery = query.trim().length > 0;

  return (
    <div className="space-y-4">
      <BotBubble>
        سلام 👋 من دستیار راهنمای سامانه هستم. می‌تونی سوالت رو جستجو کنی یا از
        گزینه‌های آماده استفاده کنی.
      </BotBubble>

      {!hasQuery && (
        <div className="rounded-[24px] border border-sky-200 bg-sky-50/80 p-3 dark:border-sky-400/20 dark:bg-sky-500/10">
          <div className="mb-3 flex items-center gap-2 text-sm font-black text-sky-800 dark:text-sky-200">
            <Sparkles className="h-4 w-4" />
            سوالات پیشنهادی
          </div>

          <div className="grid gap-2">
            {suggestedItems.map((item) => (
              <QuestionCard
                key={item.id}
                item={item}
                query={query}
                onSelect={onSelect}
              />
            ))}
          </div>
        </div>
      )}

      <div>
        <div className="mb-3 flex items-center gap-2 text-sm font-black text-slate-900 dark:text-white">
          <Layers3 className="h-4 w-4 text-orange-500" />
          دسته‌بندی سوالات
        </div>

        <div className="mb-4 flex gap-2 overflow-x-auto pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`whitespace-nowrap rounded-full border px-3 py-2 text-xs font-black transition ${
                activeCategory === cat
                  ? "border-orange-500 bg-orange-500 text-white"
                  : "border-slate-200 bg-white text-slate-700 hover:bg-slate-100 dark:border-white/10 dark:bg-white/5 dark:text-zinc-300 dark:hover:bg-white/10"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="mb-2 text-xs font-bold text-slate-500 dark:text-zinc-400">
          {hasQuery
            ? `${items.length} نتیجه برای "${query}"`
            : `${items.length} سوال در این بخش`}
        </div>

        {items.length > 0 ? (
          <div className="space-y-2">
            {items.map((item) => (
              <QuestionCard
                key={item.id}
                item={item}
                query={query}
                onSelect={onSelect}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-[22px] border border-dashed border-slate-300 bg-white p-5 text-center text-sm text-slate-500 dark:border-white/10 dark:bg-white/[0.04] dark:text-zinc-400">
            نتیجه‌ای برای جستجوی شما پیدا نشد.
          </div>
        )}
      </div>
    </div>
  );
}

function GuideAnswerLevel2({
  item,
  onBack,
  query,
}: {
  item: GuideItem;
  onBack: () => void;
  query: string;
}) {
  const Icon = item.icon || HelpCircle;
  const typedText = useTypedText(item.answer, 14, true);

  return (
    <div className="space-y-4">
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-xs font-black text-slate-700 transition hover:bg-slate-100 dark:border-white/10 dark:bg-white/5 dark:text-zinc-300 dark:hover:bg-white/10"
      >
        <ArrowRight className="h-4 w-4" />
        بازگشت به منو
      </button>

      <UserBubble>{highlightText(item.title, query)}</UserBubble>

      <div className="flex items-start gap-2">
        <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 via-cyan-500 to-blue-600 text-white shadow-lg shadow-sky-500/20">
          <Bot className="h-5 w-5" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="min-w-0 flex-1 rounded-[24px] rounded-tr-md border border-slate-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-white/[0.04]"
        >
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-3 py-1.5 text-xs font-black text-orange-700 dark:border-orange-400/20 dark:bg-orange-500/10 dark:text-orange-300">
            <Icon className="h-3.5 w-3.5" />
            پاسخ دستیار
          </div>

          <p className="text-sm leading-7 text-slate-700 dark:text-zinc-300">
            {typedText}
            {typedText.length < item.answer.length && (
              <span className="mr-1 inline-block h-4 w-2 animate-pulse rounded bg-orange-400/80 align-middle" />
            )}
          </p>

          {item.links && item.links.length > 0 && (
            <div className="mt-4 grid gap-2">
              {item.links.map((link) => {
                const LinkIcon = link.icon || ChevronLeft;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={getActionClass(link.variant)}
                  >
                    <LinkIcon className="h-4 w-4" />
                    {link.title}
                    <ChevronLeft className="mr-auto h-4 w-4" />
                  </Link>
                );
              })}
            </div>
          )}
        </motion.div>
      </div>

      <div className="rounded-[22px] border border-slate-200 bg-white p-3 dark:border-white/10 dark:bg-white/[0.04]">
        <button
          type="button"
          onClick={onBack}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-100 px-4 py-3 text-sm font-black text-slate-800 transition hover:bg-slate-200 dark:bg-white/10 dark:text-white dark:hover:bg-white/15"
        >
          <SendHorizonal className="h-4 w-4" />
          دیدن سوالات دیگر
        </button>
      </div>
    </div>
  );
}

function QuestionCard({
  item,
  onSelect,
  query,
}: {
  item: GuideItem;
  onSelect: (item: GuideItem) => void;
  query: string;
}) {
  const Icon = item.icon || HelpCircle;

  return (
    <button
      type="button"
      onClick={() => onSelect(item)}
      className="group flex w-full items-center gap-3 rounded-[22px] border border-slate-200 bg-white p-3 text-right transition hover:border-orange-300 hover:bg-orange-50 dark:border-white/10 dark:bg-white/[0.04] dark:hover:border-orange-400/30 dark:hover:bg-orange-500/10"
    >
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-slate-700 transition group-hover:bg-orange-100 group-hover:text-orange-700 dark:bg-white/10 dark:text-zinc-300 dark:group-hover:bg-orange-500/20 dark:group-hover:text-orange-300">
        <Icon className="h-5 w-5" />
      </div>

      <div className="min-w-0 flex-1">
        <div className="line-clamp-1 text-sm font-black text-slate-900 dark:text-white">
          {highlightText(item.title, query)}
        </div>
        {item.short && (
          <div className="mt-1 text-xs text-slate-500 dark:text-zinc-400">
            {highlightText(item.short, query)}
          </div>
        )}
      </div>

      <ChevronLeft className="h-4 w-4 shrink-0 text-slate-400 transition group-hover:-translate-x-0.5 group-hover:text-orange-500" />
    </button>
  );
}

function QuickAction({
  href,
  icon: Icon,
  label,
}: {
  href: string;
  icon: LucideIcon;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center justify-center gap-1.5 rounded-2xl border border-slate-200 bg-slate-50 px-2 py-2.5 text-xs font-black text-slate-700 transition hover:bg-slate-100 dark:border-white/10 dark:bg-white/[0.04] dark:text-zinc-300 dark:hover:bg-white/10"
    >
      <Icon className="h-3.5 w-3.5" />
      {label}
    </Link>
  );
}

function BotBubble({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2">
      <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 via-cyan-500 to-blue-600 text-white shadow-lg shadow-sky-500/20">
        <Bot className="h-5 w-5" />
      </div>

      <div className="rounded-[24px] rounded-tr-md border border-slate-200 bg-white px-4 py-3 text-sm leading-7 text-slate-700 shadow-sm dark:border-white/10 dark:bg-white/[0.04] dark:text-zinc-300">
        {children}
      </div>
    </div>
  );
}

function UserBubble({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex justify-end">
      <div className="max-w-[85%] rounded-[24px] rounded-tl-md bg-gradient-to-br from-orange-500 to-orange-600 px-4 py-3 text-sm font-bold leading-7 text-white shadow-lg shadow-orange-500/25">
        {children}
      </div>
    </div>
  );
}

function highlightText(text: string, query: string) {
  const q = query.trim();
  if (!q) return text;

  const normalizedText = text.replace(/ي/g, "ی").replace(/ك/g, "ک");
  const normalizedQuery = q.replace(/ي/g, "ی").replace(/ك/g, "ک");

  const index = normalizedText
    .toLowerCase()
    .indexOf(normalizedQuery.toLowerCase());
  if (index === -1) return text;

  const before = text.slice(0, index);
  const match = text.slice(index, index + q.length);
  const after = text.slice(index + q.length);

  return (
    <>
      {before}
      <mark className="rounded bg-yellow-200 px-1 text-slate-900">{match}</mark>
      {after}
    </>
  );
}

function getActionClass(variant?: "primary" | "secondary" | "success") {
  const base =
    "flex items-center gap-2 rounded-2xl border px-4 py-3 text-sm font-black transition";

  if (variant === "primary") {
    return `${base} border-orange-600 bg-orange-500 text-white hover:bg-orange-600`;
  }

  if (variant === "success") {
    return `${base} border-emerald-300 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:border-emerald-400/20 dark:bg-emerald-500/10 dark:text-emerald-300 dark:hover:bg-emerald-500/15`;
  }

  return `${base} border-sky-300 bg-sky-50 text-sky-700 hover:bg-sky-100 dark:border-sky-400/20 dark:bg-sky-500/10 dark:text-sky-300 dark:hover:bg-sky-500/15`;
}
