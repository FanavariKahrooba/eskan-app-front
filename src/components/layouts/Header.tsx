import { Home, LogIn } from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "../theme-toggle";
import Image from "next/image";
export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-300 bg-slate-50/90 backdrop-blur-xl dark:border-white/10 dark:bg-zinc-950/80">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-transparent">
            {/* <Home className="h-6 w-6" /> */}

            <Image
              src={"/assets/img/logo.png"}
              className="h-14 w-14"
              width={56}
              height={56}
              alt="سامانه ثبت درخواست اسکان سراهای محله"
            />
          </div>
          <div>
            <div className="text-sm font-black text-slate-950 dark:text-white">
              سامانه ثبت درخواست اسکان سرای های محله
            </div>
            <div className="text-xs text-slate-500 dark:text-zinc-400">
              مدیریت ظرفیت، درخواست و پذیرش
            </div>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 text-sm text-slate-700 dark:text-zinc-300 md:flex">
          {/* <Link
            href="/shelters"
            className="transition hover:text-orange-700 dark:hover:text-orange-300"
          >
            سراهای فعال
          </Link> */}
          <Link
            href="/guide"
            className="transition hover:text-orange-700 dark:hover:text-orange-300"
          >
            راهنما
          </Link>
          <Link
            href="/request/track"
            className="transition hover:text-orange-700 dark:hover:text-orange-300"
          >
            پیگیری درخواست
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />

          <Link
            href="/login-otp"
            className="hidden items-center gap-2 rounded-xl border border-slate-300 bg-slate-100 px-4 py-2 text-sm font-bold text-slate-800 shadow-sm shadow-slate-300/30 transition hover:border-orange-300 hover:bg-orange-50 hover:text-orange-800 dark:border-white/10 dark:bg-white/5 dark:text-white dark:shadow-black/20 dark:hover:bg-white/10 dark:hover:text-orange-300 sm:inline-flex"
          >
            <LogIn className="h-4 w-4" />
            ورود
          </Link>

          <Link
            href="/request/new"
            className="inline-flex items-center gap-2 rounded-xl border border-orange-600 bg-orange-600 px-4 py-2 text-sm font-extrabold text-white shadow-sm shadow-orange-500/30 transition hover:border-orange-500 hover:bg-orange-500 dark:border-orange-500 dark:bg-orange-500 dark:hover:bg-orange-400"
          >
            ثبت درخواست
          </Link>
        </div>
      </div>
    </header>
  );
}
