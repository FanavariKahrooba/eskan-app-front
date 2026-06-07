"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronDown,
  CircleHelp,
  LogOut,
  Settings,
  Shield,
  User,
  Users,
  Sparkles,
} from "lucide-react";

type ProfileMenuItem =
  | { type: "label"; text: string }
  | { type: "divider" }
  | {
      type: "item";
      id: string;
      title: string;
      subtitle?: string;
      icon: any;
      href?: string;
      onClick?: () => void;
      tone?: "default" | "danger";
      disabled?: boolean;
    };

type ProfileDropdownProps = {
  user: {
    name: string;
    role?: string;
    email?: string;
    avatarText?: string; // مثلا RH
  };
  // اگر نقش/مجوز دارید، می‌تونید مدیریت رو شرطی کنید
  canManage?: boolean;
  className?: string;
};

export default function ProfileDropdown({
  user,
  canManage = true,
  className,
}: ProfileDropdownProps) {
  const router = useRouter();
  const pathname = usePathname();
  const menuId = useId();

  const [open, setOpen] = useState(false);
  const [mounted, setMounted]: any = useState(false);

  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const [pos, setPos] = useState({ top: 0, left: 0, width: 0 });

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);

  // محاسبه موقعیت منو نسبت به آواتار (RTL-friendly)
  const updatePosition = () => {
    const el = triggerRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const width = 320;
    const gap = 10;
    const left = Math.min(
      window.innerWidth - width - 12,
      Math.max(12, r.right - width),
    );
    const top = Math.min(window.innerHeight - 12, r.bottom + gap);
    setPos({ top, left, width });
  };

  useEffect(() => {
    if (!open) return;
    updatePosition();
    const onResize = () => updatePosition();
    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", onResize, true);
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onResize, true);
    };
  }, [open]);

  // بستن با کلیک بیرون + Esc
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    const onPointerDown = (e: MouseEvent | PointerEvent) => {
      const t = e.target as Node;
      if (menuRef.current?.contains(t)) return;
      if (triggerRef.current?.contains(t)) return;
      setOpen(false);
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open]);

  // UX: وقتی مسیر عوض شد، منو بسته شود
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (open) setOpen(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const items: ProfileMenuItem[] = useMemo(() => {
    const go = (href: string) => () => router.push(href);

    return [
      { type: "label", text: "حساب کاربری" },
      {
        type: "item",
        id: "profile",
        title: "پروفایل",
        subtitle: "مشاهده و ویرایش اطلاعات",
        icon: User,
        onClick: go("/profile"),
      },
      {
        type: "item",
        id: "settings",
        title: "تنظیمات حساب",
        subtitle: "امنیت، اعلان‌ها، ترجیحات",
        icon: Settings,
        onClick: go("/settings"),
      },

      { type: "divider" },

      { type: "label", text: "مدیریت" },
      ...(canManage
        ? ([
            {
              type: "item",
              id: "management",
              title: "مدیریت سیستم",
              subtitle: "نقش‌ها، دسترسی‌ها، پیکربندی",
              icon: Shield,
              onClick: go("/management"),
            },
            {
              type: "item",
              id: "team",
              title: "تیم و کاربران",
              subtitle: "اعضا، دعوت، دسترسی‌ها",
              icon: Users,
              onClick: go("/management/users"),
            },
          ] as ProfileMenuItem[])
        : ([
            {
              type: "item",
              id: "team-readonly",
              title: "تیم و کاربران",
              subtitle: "دسترسی مدیریتی ندارید",
              icon: Users,
              disabled: true,
            },
          ] as ProfileMenuItem[])),

      { type: "divider" },

      { type: "label", text: "پشتیبانی" },
      {
        type: "item",
        id: "help",
        title: "مرکز راهنما",
        subtitle: "مستندات و سوالات متداول",
        icon: CircleHelp,
        onClick: go("/help"),
      },
      {
        type: "item",
        id: "whatsnew",
        title: "چه خبر جدید؟",
        subtitle: "آخرین تغییرات و امکانات",
        icon: Sparkles,
        onClick: go("/changelog"),
      },

      { type: "divider" },

      {
        type: "item",
        id: "logout",
        title: "خروج از حساب",
        subtitle: "خروج امن از پنل",
        icon: LogOut,
        tone: "danger",
        onClick: () => {
          // TODO: اینجا لاگ‌اوت واقعی خودتون رو صدا بزنید
          // await signOut()
          router.push("/logout");
        },
      },
    ];
  }, [canManage, router]);

  const avatarText =
    user.avatarText ??
    user.name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase())
      .join("");

  return (
    <div className={className}>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        className="group flex items-center gap-3 rounded-2xl pl-3 pr-2 py-1.5 border border-transparent hover:border-gray-200 hover:bg-gray-50 transition-colors"
      >
        {/* متن کاربر */}
        <div className="text-right hidden sm:block leading-tight">
          <div className="text-xs font-bold text-gray-800">{user.name}</div>
          <div className="text-[10px] text-gray-400">{user.role ?? ""}</div>
        </div>

        {/* آواتار حرفه‌ای */}
        <div className="relative">
          <div className="absolute -inset-[2px] rounded-2xl bg-gradient-to-tr from-blue-500 via-indigo-500 to-fuchsia-500 blur-[6px] opacity-25 group-hover:opacity-35 transition-opacity" />
          <div className="relative w-9 h-9 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-700 shadow-lg ring-1 ring-white/60 border border-white/30 flex items-center justify-center text-white font-bold text-xs">
            {avatarText}
          </div>
          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-white" />
        </div>

        <ChevronDown
          size={16}
          className={`text-gray-400 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {mounted &&
        createPortal(
          <AnimatePresence>
            {open && (
              <div className="fixed inset-0 z-[9999]">
                {/* بک‌دراپ نامحسوس */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-black/10 backdrop-blur-[1px]"
                />
                {/* منو */}
                <motion.div
                  ref={menuRef}
                  id={menuId}
                  role="menu"
                  initial={{ opacity: 0, y: -8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 520, damping: 35 }}
                  style={{ top: pos.top, left: pos.left, width: pos.width }}
                  className="absolute rounded-2xl border border-gray-200 bg-white shadow-2xl overflow-hidden"
                >
                  {/* هدر کوچک داخل منو */}
                  <div className="px-4 py-3 border-b border-gray-100">
                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <div className="text-sm font-bold text-gray-800 truncate">
                          {user.name}
                        </div>
                        <div className="text-xs text-gray-400 truncate">
                          {user.email ?? user.role ?? ""}
                        </div>
                      </div>
                      {/* <span className="text-[10px] px-2 py-1 rounded-full bg-gray-100 text-gray-500 border border-gray-200">Pro</span> */}
                    </div>
                  </div>

                  <div className="p-2">
                    {items.map((it, idx) => {
                      if (it.type === "divider") {
                        return (
                          <div
                            key={`d-${idx}`}
                            className="my-2 border-t border-gray-100"
                          />
                        );
                      }
                      if (it.type === "label") {
                        return (
                          <div
                            key={`l-${idx}`}
                            className="px-3 py-2 text-[11px] font-bold text-gray-400 uppercase tracking-widest"
                          >
                            {it.text}
                          </div>
                        );
                      }

                      const Icon = it.icon;
                      const danger = it.tone === "danger";

                      return (
                        <button
                          key={it.id}
                          type="button"
                          role="menuitem"
                          disabled={it.disabled}
                          onClick={() => {
                            if (it.disabled) return;
                            it.onClick?.();
                            setOpen(false);
                          }}
                          className={[
                            "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-right transition-colors",
                            it.disabled
                              ? "opacity-50 cursor-not-allowed"
                              : danger
                                ? "hover:bg-rose-50"
                                : "hover:bg-gray-50",
                          ].join(" ")}
                        >
                          <span
                            className={[
                              "w-9 h-9 rounded-xl flex items-center justify-center border",
                              danger
                                ? "bg-rose-50 border-rose-100 text-rose-600"
                                : "bg-gray-50 border-gray-100 text-gray-600",
                            ].join(" ")}
                          >
                            <Icon size={18} />
                          </span>

                          <span className="flex-1 min-w-0">
                            <span
                              className={[
                                "block text-sm font-semibold truncate",
                                danger ? "text-rose-600" : "text-gray-800",
                              ].join(" ")}
                            >
                              {it.title}
                            </span>
                            {it.subtitle && (
                              <span className="block text-[11px] text-gray-400 truncate">
                                {it.subtitle}
                              </span>
                            )}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </div>
  );
}
