// components/hero/HeroSlider.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
} from "lucide-react";
import { heroSlides } from "./slides";
import SliderControls from "./SliderControls";
import { useSlider } from "@/hooks/useSlider";

const AUTOPLAY = 6000;

export default function HeroSlider() {
  const { index, next, prev, go, setPaused, paused } = useSlider(
    heroSlides.length,
    AUTOPLAY,
  );
  const touchX = useRef<number | null>(null);
  const slide = heroSlides[index];

  const onTouchStart = (e: React.TouchEvent) => {
    touchX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    // RTL: کشیدن به چپ یعنی اسلاید بعدی
    if (Math.abs(dx) > 50) (dx < 0 ? next : prev)();
    touchX.current = null;
  };

  return (
    <section
      dir="rtl"
      aria-roledescription="carousel"
      className="relative h-[100svh] min-h-[560px] w-full overflow-hidden bg-zinc-950"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "ArrowLeft") next();
        if (e.key === "ArrowRight") prev();
      }}
    >
      {/* تصاویر با کراس‌فید و افکت Ken Burns */}
      <AnimatePresence mode="sync">
        <motion.div
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.9, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <motion.div
            initial={{ scale: 1.12 }}
            animate={{ scale: 1 }}
            transition={{ duration: AUTOPLAY / 1000 + 1, ease: "linear" }}
            className="absolute inset-0"
          >
            <Image
              src={slide.src}
              alt={slide.alt}
              fill
              priority={index === 0}
              sizes="100vw"
              className="object-cover"
            />
          </motion.div>
        </motion.div>
      </AnimatePresence>

      {/* لایه تیره برای خوانایی متن */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/30" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(251,146,60,0.22),transparent_45%)]" />

      {/* محتوای متنی */}
      <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-end px-6 pb-24 sm:pb-28 lg:px-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="max-w-2xl"
          >
            <span className="inline-flex rounded-full border border-orange-400/30 bg-orange-500/15 px-4 py-1.5 text-sm font-bold text-orange-200 backdrop-blur">
              سامانه ثبت درخواست اسکان
            </span>

            <h1 className="mt-5 text-4xl font-black leading-tight text-white drop-shadow-lg sm:text-5xl md:text-6xl">
              {slide.title}
            </h1>

            {slide.subtitle && (
              <p className="mt-4 max-w-xl text-base leading-8 text-zinc-200 sm:text-lg">
                {slide.subtitle}
              </p>
            )}

            {slide.cta && (
              <Link
                href={slide.cta.href}
                className="mt-7 inline-flex items-center gap-2 rounded-2xl border border-orange-500 bg-orange-500 px-7 py-3.5 text-sm font-extrabold text-white shadow-lg shadow-orange-500/30 transition hover:bg-orange-400"
              >
                {slide.cta.label}
                <ArrowLeft className="h-4 w-4" />
              </Link>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* کنترل‌ها */}
      <SliderControls
        index={index}
        count={heroSlides.length}
        paused={paused}
        onPrev={prev}
        onNext={next}
        onGo={go}
        onTogglePlay={() => setPaused((p) => !p)}
      />
    </section>
  );
}
