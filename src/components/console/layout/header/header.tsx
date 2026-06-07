"use client"

import { useState, useEffect } from "react"
import ButtonLinkSecondary from "@/components/shared/button-link-secondary"
import HeaderBrand from "./header-brand"
import HeaderNavLink from "./header-nav-link"
import { ClockIcon, HomeIcon, ContactIcon } from "@/composable/Icons"
import { useLocale, useTranslations } from "next-intl"
import { navLinks } from "@/lang"
import { NavLink } from "@/types"
import { IoMenuOutline } from "react-icons/io5"
import { FaTimes } from "react-icons/fa"
import { AnimatePresence, motion } from "framer-motion"

const Header = () => {
  const t = useTranslations("HeaderSection")
  const t2 = useTranslations("WebSiteInfo")

  const [openMenu, setOpenMenu] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  const lang = useLocale()
  const isRTL = lang === "fa" || lang === "ar"
  const side = isRTL ? "right-0" : "left-0"

  /* ---------- Scroll Header ---------- */
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  /* ---------- Lock body scroll ---------- */
  useEffect(() => {
    document.body.style.overflow = openMenu ? "hidden" : "auto"
  }, [openMenu])

  return (
    <>
      <header
        className={`
        sticky top-0 w-full z-50
        backdrop-blur-md transition-all duration-300
          
        ${isScrolled ? "bg-white/80 shadow-lg" : "bg-white"}
      `}
      >
        {/* ================= Top Header ================= */}
        <div className="h-14 flex items-center">
          <div className="wrapper w-full flex justify-between items-center text-sm">
            <HeaderBrand
              brandIcon="/assets/img/logo.png"
              brandIconAlt={t2("WebSiteName")}
              brandIconSizeHeight={54}
              title1={t2("WebSiteName")}
              title2={t2("subTitleInHeaderLogo")}
              isH1
            />

            {/* Desktop Info */}
            <div className="hidden md:flex items-center gap-6 text-gray-700">
              <div className="flex items-center">
                <span className="w-10 h-10 text-primary me-3">{ContactIcon()}</span>
                <div>
                  <div className="font-bold">{t2("phone")}</div>
                  <div>{t2("supportPhone")}</div>
                </div>
              </div>

              <div className="border-l h-10 border-gray-300" />

              <div className="flex items-center">
                <span className="w-10 h-10 text-primary me-3">{ClockIcon()}</span>
                <div>
                  <div className="font-bold">8:30 - 19:30</div>
                  <div>{t2("workingHours")}</div>
                </div>
              </div>
            </div>

            {/* Mobile Button */}
            <button onClick={() => setOpenMenu(true)} className="md:hidden text-gray-800">
              <IoMenuOutline className="w-10 h-10" />
            </button>
          </div>
        </div>

        {/* ================= Desktop Nav ================= */}
        <div className="hidden md:block border-t border-gray-200">
          <nav className="wrapper flex justify-between items-center py-1 text-sm">
            <div className="flex gap-6">
              {navLinks.map((link: NavLink) => (
                <HeaderNavLink key={link.href} href={link.href} title={t(link.titleKey)} icon="" />
              ))}
            </div>

            <ButtonLinkSecondary link="/consultation">{t2("consulting")}</ButtonLinkSecondary>
          </nav>
        </div>
      </header>
      {/* ================= Mobile Drawer ================= */}
      <AnimatePresence>
        {openMenu && (
          <>
            <motion.div
              className="fixed inset-0 z-[999] bg-black/40 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpenMenu(false)}
            />

            <motion.aside
              className={`
    fixed top-0 ${side}
    z-[1000]
    w-80 h-full
    bg-white/90 backdrop-blur-xl
    shadow-[0_20px_60px_rgba(0,0,0,0.25)]
    p-6
  `}
              initial={{ x: isRTL ? "100%" : "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: isRTL ? "100%" : "-100%" }}
              transition={{ type: "spring", stiffness: 260, damping: 28 }}
            >
              {/* ===== Header ===== */}
              <div className="flex items-center justify-between mb-8">
                <HeaderBrand
                  brandIcon="/assets/img/logo.png"
                  brandIconAlt={t2("WebSiteName")}
                  brandIconSizeHeight={53}
                  title1={t2("WebSiteName")}
                  title2={t2("subTitleInHeaderLogo")}
                />

                <button onClick={() => setOpenMenu(false)}>
                  <FaTimes className="text-2xl text-gray-600 hover:text-red-500 transition" />
                </button>
              </div>

              {/* ===== Contact Cards ===== */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 p-4 rounded-xl bg-gray-50">
                  <span className="text-primary w-8 h-8">{ContactIcon()}</span>
                  <div>
                    <div className="text-sm font-bold">{t2("phone")}</div>
                    <div className="text-sm text-gray-600">{t2("supportPhone")}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 rounded-xl bg-gray-50">
                  <span className="text-primary w-8 h-8">{ClockIcon()}</span>
                  <div>
                    <div className="text-sm font-bold">8:30 - 19:30</div>
                    <div className="text-sm text-gray-600">{t2("workingHours")}</div>
                  </div>
                </div>
              </div>

              {/* ===== Nav ===== */}
              <nav className="flex flex-col gap-2 mb-6">
                {navLinks.map((link: NavLink, i) => (
                  <motion.div key={link.href} initial={{ opacity: 0, x: isRTL ? 20 : -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
                    <HeaderNavLink
                      href={link.href}
                      title={t(link.titleKey)}
                      icon={HomeIcon()}
                      className="
            rounded-xl px-4 py-3
            bg-gray-50
            hover:bg-primary/10
            transition
          "
                    />
                  </motion.div>
                ))}
              </nav>

              {/* ===== CTA ===== */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <ButtonLinkSecondary link="/consultation">{t2("consulting")}</ButtonLinkSecondary>
              </motion.div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

export default Header
