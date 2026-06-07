"use client";

import { useState, useEffect } from "react";
import ButtonLinkSecondary from "@/components/shared/button-link-secondary";
import HeaderBrand from "./header-brand";
import HeaderNavLink from "./header-nav-link";
import { ClockIcon, HomeIcon, ContactIcon } from "@/composable/Icons";
import { useLocale, useTranslations } from "next-intl";
import { navLinks } from "@/lang";
import { NavLink } from "@/types";
import { IoMenuOutline } from "react-icons/io5";
import { FaTimes } from "react-icons/fa";
import { AnimatePresence, motion } from "framer-motion";

const Header = () => {
  const t = useTranslations("HeaderSection");
  const t2 = useTranslations("WebSiteInfo");
  const [openMenu, setOpenMenu] = useState(false);
  const lang = useLocale();
  const [isScrolled, setIsScrolled] = useState(false);

  const isRTL = lang === "fa" || lang === "ar";
  const side = isRTL ? "right-0" : "left-0";

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = openMenu ? "hidden" : "auto";
  }, [openMenu]);

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const drawerVariants = (isRTL: boolean) => ({
    hidden: {
      x: isRTL ? "100%" : "-100%",
      opacity: 0,
    },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 25,
      },
    },
    exit: {
      x: isRTL ? "100%" : "-100%",
      opacity: 0,
      transition: { duration: 0.2 },
    },
  });

  return (
    <header
      className={`
    fixed top-0 w-full z-50
    transition-all duration-300 backdrop-blur-md
    ${isScrolled ? "bg-white/80 shadow-lg " : "bg-white/100 shadow-none"}
  `}
    >
      {/* ---------- Top Header ---------- */}
      <div className="h-14 flex items-center">
        <div className="wrapper w-full flex justify-between items-center text-sm">
          <HeaderBrand
            brandIcon={`/assets/img/logo.png`}
            brandIconAlt={t2("WebSiteName")}
            brandIconSizeHeight={54}
            title1={t2("WebSiteName")}
            title2={t2("subTitleInHeaderLogo")}
            isH1={true}
          />

          {/* Desktop Contact */}
          <div className="hidden md:flex items-center gap-6 text-gray-700">
            <div className="flex items-center">
              <span className="flex w-10 h-10 text-primary me-3">
                {ContactIcon()}
              </span>
              <div>
                <div className="font-bold">{t2("phone")}</div>
                <div>{t2("supportPhone")}</div>
              </div>
            </div>

            <div className="border-l border-gray-300"></div>

            <div className="flex items-center">
              <span className="flex w-10 h-10 text-primary me-3">
                {ClockIcon()}
              </span>
              <div>
                <div className="font-bold">8:30 - 19:30</div>
                <div>{t2("workingHours")}</div>
              </div>
            </div>
          </div>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden text-gray-800"
            onClick={() => setOpenMenu(true)}
          >
            <IoMenuOutline className="w-10 h-10" />
          </button>
        </div>
      </div>

      {/* ---------- Desktop Navigation ---------- */}
      <div className={`hidden md:block border-t border-gray-200 `}>
        <nav className="wrapper flex justify-between items-center py-1 text-sm text-gray-700">
          <div className="flex items-center gap-6">
            {navLinks.map((link: NavLink) => (
              <HeaderNavLink
                key={link.href}
                href={link.href}
                title={t(link.titleKey)}
                icon={""}
              />
            ))}
          </div>

          <ButtonLinkSecondary link="#">{t2("consulting")}</ButtonLinkSecondary>
        </nav>
      </div>
      <AnimatePresence>
        {openMenu && (
          <>
            {/* Backdrop */}
            {/* <motion.div
              className="fixed inset-0 z-[999] bg-white/95 backdrop-blur-md"
              variants={backdropVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              onClick={() => setOpenMenu(false)}
            /> */}

            {/* Drawer */}
            <motion.aside
              className={`
          fixed top-0 ${side}
          w-72 h-full 
          shadow-2xl border border-gray-200
          p-6  
        `}
              // variants={drawerVariants(isRTL)}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {/* Close */}
              <button
                className={`text-gray-800 text-3xl mb-6 ${
                  isRTL ? "ml-auto" : "mr-auto"
                }`}
                onClick={() => setOpenMenu(false)}
              >
                <FaTimes className="hover:text-red-500 transition" />
              </button>

              {/* Contact */}
              <div className="mb-6 space-y-4 text-gray-700 bg-white">
                <div className="flex items-center">
                  <span className="text-primary w-8 h-8 me-3">
                    {ContactIcon()}
                  </span>
                  <div>
                    <div className="font-bold">{t2("phone")}</div>
                    <div>{t2("supportPhone")}</div>
                  </div>
                </div>

                <div className="flex items-center">
                  <span className="text-primary w-8 h-8 me-3">
                    {ClockIcon()}
                  </span>
                  <div>
                    <div className="font-bold">8:30 - 19:30</div>
                    <div>{t2("workingHours")}</div>
                  </div>
                </div>
              </div>

              <hr className="border-gray-200 my-4" />

              {/* Links */}
              <nav className="flex flex-col gap-5 text-gray-800">
                {navLinks.map((link: NavLink) => (
                  <HeaderNavLink
                    key={link.href}
                    href={link.href}
                    title={t(link.titleKey)}
                    icon={HomeIcon()}
                  />
                ))}

                <ButtonLinkSecondary link="/consultation">
                  {t2("consulting")}
                </ButtonLinkSecondary>
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
      {/* ---------- Mobile Drawer Menu ---------- */}
      {/* {openMenu && (
        <div
          className="
            fixed inset-0 bg-white z-1000
          "
          onClick={() => setOpenMenu(false)}
        >
          <div
            className={`
              absolute top-0 ${side} w-72 h-full 
              bg-white shadow-xl border border-gray-200
              p-6 rounded-s-2xl
              animate-slide
            `}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className={`text-gray-800 text-3xl mb-6 ${
                isRTL ? "ml-auto" : "mr-auto"
              }`}
              onClick={() => setOpenMenu(false)}
            >
              <FaTimes className="hover:text-red-500 transition" />
            </button>

            <div className="mb-6 space-y-4 text-gray-700">
              <div className="flex items-center">
                <span className="text-primary w-8 h-8 me-3">
                  {ContactIcon()}
                </span>
                <div>
                  <div className="font-bold">{t2("phone")}</div>
                  <div>{t2("supportPhone")}</div>
                </div>
              </div>

              <div className="flex items-center">
                <span className="text-primary w-8 h-8 me-3">{ClockIcon()}</span>
                <div>
                  <div className="font-bold">8:30 - 19:30</div>
                  <div>{t2("workingHours")}</div>
                </div>
              </div>
            </div>

            <hr className="border-gray-200 my-4" />

            <div className="flex flex-col gap-5 text-gray-800">
              {navLinks.map((link: NavLink) => (
                <HeaderNavLink
                  key={link.href}
                  href={link.href}
                  title={t(link.titleKey)}
                  icon={HomeIcon()}
                />
              ))}

              <ButtonLinkSecondary link="/consultation">
                {t2("consulting")}
              </ButtonLinkSecondary>
            </div>
          </div>
        </div>
      )} */}
    </header>
  );
};

export default Header;
