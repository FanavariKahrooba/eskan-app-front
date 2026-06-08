"use client";

import { Bell } from "lucide-react";
import { useMemo, useState } from "react";
import NotificationPanel from "../notifications/notification-panel";
import { useCommandStore } from "@/store/command-store";
import QuickAccess from "./quick-access";
import ProfileDropdown from "./profile-dropdown";
export default function Header() {
  const { setOpen } = useCommandStore();
  const [openBell, setOpenBell] = useState(false);
  const unreadCount = useMemo(() => 3, []);
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white">
      <div className="flex min-h-16 w-full items-center gap-3 px-3 sm:px-4">
        <div className="min-w-0 flex-1">
          <QuickAccess />
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setOpenBell(true)}
            className="relative rounded-2xl border cursor-pointer border-slate-200 bg-white p-2.5 text-slate-600 shadow-sm transition-all hover:-translate-y-0.5 hover:bg-slate-50 hover:shadow-md"
            aria-label="اعلان‌ها"
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white shadow">
                {unreadCount}
              </span>
            )}
          </button>
          <NotificationPanel open={openBell} setOpen={setOpenBell} />
          <div className="flex items-center gap-3  pr-4 border-r border-gray-100">
            <ProfileDropdown
              user={{
                name: "مدیریت",
                role: "مدیر سیستم",
                email: "rahimhosseini@hooshsevom.ir",
                avatarText: "RH",
              }}
              canManage={true}
            />
          </div>
        </div>
      </div>
    </header>
  );
}
