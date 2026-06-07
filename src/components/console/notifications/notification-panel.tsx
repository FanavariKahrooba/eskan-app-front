"use client"

import { X, Bell, CheckCheck, User, ShoppingCart, Receipt } from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"
import { useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"

type NotificationItem = {
  id: number
  title: string
  desc: string
  time: string
  icon: React.ReactNode
  date: "today" | "yesterday"
}

type NotificationPanelProps = {
  open: boolean
  setOpen: (value: boolean) => void
}

export default function NotificationPanel({ open, setOpen }: NotificationPanelProps) {
  const panelRef = useRef<HTMLDivElement | null>(null)
  const overlayRef = useRef<HTMLDivElement | null>(null)
  const [mounted, setMounted] = useState(false)
  const [tab, setTab] = useState<"all" | "unread">("all")
  const [unread, setUnread] = useState<number[]>([1, 2, 3])

  const notifications: NotificationItem[] = [
    {
      id: 1,
      title: "سفارش جدید ثبت شد",
      desc: "سفارش شماره A-924 توسط جان دو ثبت شد",
      time: "۲ دقیقه پیش",
      icon: <ShoppingCart size={18} className="text-sky-600" />,
      date: "today",
    },
    {
      id: 2,
      title: "فاکتور پرداخت شد",
      desc: "فاکتور شماره INV-331 به‌صورت کامل پرداخت شد",
      time: "۱۰ دقیقه پیش",
      icon: <Receipt size={18} className="text-emerald-600" />,
      date: "today",
    },
    {
      id: 3,
      title: "کاربر جدید ثبت‌نام کرد",
      desc: "اِما واتسون به فضای کاری شما اضافه شد",
      time: "۱ ساعت پیش",
      icon: <User size={18} className="text-violet-600" />,
      date: "yesterday",
    },
  ]

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (overlayRef.current && e.target === overlayRef.current) {
        setOpen(false)
      }
    }

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false)
    }

    if (open) {
      document.addEventListener("mousedown", handleClickOutside)
      document.addEventListener("keydown", handleEsc)
      document.body.style.overflow = "hidden"
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("keydown", handleEsc)
      document.body.style.overflow = ""
    }
  }, [open, setOpen])

  const filtered = tab === "all" ? notifications : notifications.filter((n) => unread.includes(n.id))

  const filteredGroups = {
    today: filtered.filter((n) => n.date === "today"),
    yesterday: filtered.filter((n) => n.date === "yesterday"),
  }

  const markAllRead = () => setUnread([])
  const markOne = (id: number) => setUnread((prev) => prev.filter((x) => x !== id))

  if (!mounted) return null

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          ref={overlayRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[999] bg-slate-900/30 backdrop-blur-sm"
          dir="rtl"
        >
          <motion.div
            ref={panelRef}
            initial={{ x: -80, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -80, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 26 }}
            className="absolute left-0 top-0 flex h-full w-full max-w-[420px] flex-col overflow-hidden border-r border-slate-200 bg-white shadow-[0_20px_80px_rgba(15,23,42,0.18)]"
          >
            {/* Header */}
            <div className="border-b border-slate-100 bg-white/90 px-5 py-4 backdrop-blur-xl">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setOpen(false)}
                  className="rounded-xl p-2 cursor-pointer text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
                  aria-label="بستن"
                >
                  <X size={18} />
                </button>

                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-50 text-sky-600">
                    <Bell size={18} />
                  </div>
                  <div className="text-right">
                    <h3 className="text-sm font-bold text-slate-800">اعلان‌ها</h3>
                    <p className="text-xs text-slate-500">مدیریت پیام‌ها و رویدادهای اخیر</p>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div className="inline-flex rounded-2xl bg-slate-100 p-1">
                  {[
                    { key: "all", label: "همه" },
                    { key: "unread", label: "خوانده‌نشده" },
                  ].map((item) => (
                    <button
                      key={item.key}
                      onClick={() => setTab(item.key as "all" | "unread")}
                      className={`rounded-xl px-4 py-2 text-sm font-medium transition-all cursor-pointer ${
                        tab === item.key ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>

                <button
                  onClick={markAllRead}
                  className="flex items-center cursor-pointer gap-1 rounded-xl px-3 py-2 text-xs font-medium text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
                >
                  <CheckCheck size={14} />
                  خواندن همه
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 space-y-6 overflow-y-auto bg-slate-50/70 p-4">
              {filtered.length === 0 ? (
                <div className="flex h-full min-h-[300px] flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-white text-center">
                  <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                    <Bell size={22} />
                  </div>
                  <h4 className="text-sm font-semibold text-slate-700">اعلانی وجود ندارد</h4>
                  <p className="mt-1 text-xs text-slate-500">در حال حاضر مورد جدیدی برای نمایش ندارید.</p>
                </div>
              ) : (
                <>
                  {[
                    { key: "today", label: "امروز", items: filteredGroups.today },
                    { key: "yesterday", label: "دیروز", items: filteredGroups.yesterday },
                  ].map((group) =>
                    group.items.length ? (
                      <div key={group.key}>
                        <div className="mb-3 flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-400">{group.label}</span>
                          <span className="h-px flex-1 bg-slate-200 mr-3"></span>
                        </div>

                        <div className="space-y-3">
                          {group.items.map((n) => {
                            const isUnread = unread.includes(n.id)

                            return (
                              <div
                                key={n.id}
                                className={`group rounded-2xl border p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md ${
                                  isUnread ? "border-sky-100 bg-white" : "border-slate-200 bg-white/80"
                                }`}
                              >
                                <div className="flex items-start gap-3">
                                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-slate-100">{n.icon}</div>

                                  <div className="min-w-0 flex-1">
                                    <div className="flex items-start justify-between gap-3">
                                      <div className="text-right">
                                        <h4 className="text-sm font-bold text-slate-800">{n.title}</h4>
                                        <p className="mt-1 text-xs leading-6 text-slate-500">{n.desc}</p>
                                      </div>

                                      {isUnread && <span className="mt-1 block h-2.5 w-2.5 shrink-0 rounded-full bg-sky-500 shadow-[0_0_0_4px_rgba(14,165,233,0.15)]" />}
                                    </div>

                                    <div className="mt-3 flex items-center justify-between">
                                      <span className="text-[11px] text-slate-400">{n.time}</span>

                                      {isUnread ? (
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation()
                                            markOne(n.id)
                                          }}
                                          className="rounded-lg cursor-pointer px-2 py-1 text-[11px] font-medium text-sky-600 transition hover:bg-sky-50"
                                        >
                                          علامت‌گذاری به‌عنوان خوانده‌شده
                                        </button>
                                      ) : (
                                        <span className="text-[11px] text-emerald-600">خوانده شده</span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    ) : null,
                  )}
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
