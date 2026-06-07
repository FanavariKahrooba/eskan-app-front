"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { Search, PanelLeftClose, PanelLeftOpen, X } from "lucide-react";
import Image from "next/image";

import HeaderBrand from "../layout/header/header-brand";
import { SidebarItem } from "./sidebar-item";
import {
  filterMenuSections,
  MENU_SECTIONS,
  MenuAccessContext,
  MenuNode,
  MenuSection,
} from "@/config/menu/index";

function normalizeText(value: string) {
  return value.toLowerCase().trim();
}

function filterNodesBySearch(nodes: MenuNode[], query: string): MenuNode[] {
  const normalizedQuery = normalizeText(query);

  if (!normalizedQuery) return nodes;

  return nodes.reduce<MenuNode[]>((acc, node) => {
    const titleMatch = normalizeText(node.title || "").includes(
      normalizedQuery,
    );

    if (node.type === "item") {
      if (titleMatch) {
        acc.push(node);
      }
      return acc;
    }

    const filteredChildren = filterNodesBySearch(
      node.children,
      normalizedQuery,
    );

    if (titleMatch) {
      acc.push({
        ...node,
        children: node.children,
      });
    } else if (filteredChildren.length > 0) {
      acc.push({
        ...node,
        children: filteredChildren,
      });
    }

    return acc;
  }, []);
}

function filterSectionsBySearch(
  sections: MenuSection[],
  query: string,
): MenuSection[] {
  const normalizedQuery = normalizeText(query);

  if (!normalizedQuery) return sections;

  return sections.reduce<MenuSection[]>((acc, section) => {
    const filteredChildren = filterNodesBySearch(
      section.children,
      normalizedQuery,
    );

    if (filteredChildren.length > 0) {
      acc.push({
        ...section,
        children: filteredChildren,
      });
    }

    return acc;
  }, []);
}

export default function Sidebar() {
  const pathname = usePathname();

  const [expanded, setExpanded] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileOpen, setMobileOpen]: any = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  const accessContext: MenuAccessContext = useMemo(
    () => ({
      permissions: [],
      roles: [],
      featureFlags: [],
      isSuperAdmin: true,
    }),
    [],
  );

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMobileOpen(false);
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, []);

  const allowedSections = useMemo(() => {
    return filterMenuSections(MENU_SECTIONS, accessContext);
  }, [accessContext]);

  const filteredSections = useMemo(() => {
    return filterSectionsBySearch(allowedSections, searchQuery);
  }, [allowedSections, searchQuery]);

  const showExpanded = isDesktop ? expanded : true;
  const isSearching = searchQuery.trim().length > 0;

  return (
    <>
      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        aria-label="باز کردن منوی کناری"
        aria-expanded={mobileOpen}
        aria-controls="app-sidebar"
        className={`
          fixed right-3 top-1/2 z-[60] flex h-11 w-11 -translate-y-1/2 items-center justify-center
          rounded-2xl border border-blue-300 bg-white text-gray-600 shadow-lg shadow-black/10
          transition-all duration-300 ease-out hover:bg-gray-50 active:scale-95 lg:hidden
          ${mobileOpen ? "pointer-events-none translate-x-3 opacity-0 scale-90" : "pointer-events-auto translate-x-0 opacity-100 scale-100"}
        `}
      >
        <PanelLeftOpen size={21} />
      </button>

      <div
        onClick={() => setMobileOpen(false)}
        className={`
          fixed inset-0 z-40 bg-black/40 backdrop-blur-[1px] transition-opacity duration-300 lg:hidden
          ${mobileOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"}
        `}
      />

      <aside
        id="app-sidebar"
        className={`
          fixed top-0 right-0 z-50 flex h-screen flex-col border-l-2 border-blue-300/60 bg-white
          transition-all duration-300 ease-in-out
          w-[82vw] max-w-[320px]
          ${mobileOpen ? "translate-x-0" : "translate-x-full"}
          lg:static lg:translate-x-0
          ${expanded ? "lg:w-64" : "lg:w-20"}
        `}
      >
        <div
          className={`
            flex h-16 shrink-0 items-center justify-between gap-3 border-b border-blue-300
            ${showExpanded ? "px-4" : "lg:mx-auto"}
          `}
        >
          <div className="min-w-0 overflow-hidden">
            {showExpanded ? (
              <HeaderBrand
                brandIcon="/assets/img/logo.png"
                brandIconAlt="فناوری کهربا"
                brandIconSizeHeight={54}
                title1="فناوری کهربا"
                title2="پنل مدیریت"
                isH1
              />
            ) : (
              <Image
                src="/assets/img/logo.png"
                width={35}
                height={48}
                alt="فناوری کهربا"
              />
            )}
          </div>

          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="flex h-9 w-9 items-center justify-center rounded-xl text-gray-500 transition hover:bg-gray-100 lg:hidden"
            aria-label="بستن منوی کناری"
          >
            <X size={20} />
          </button>
        </div>

        {showExpanded && (
          <div className="mt-4 shrink-0 px-4">
            <div className="group relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 transition-colors group-focus-within:text-blue-500"
                size={16}
              />
              <input
                type="text"
                placeholder="جستجوی سریع..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-white py-2 pl-10 pr-4 text-xs outline-none transition-all focus:border-blue-400 focus:ring-4 focus:ring-blue-50"
              />
            </div>
          </div>
        )}

        <nav className="custom-scrollbar mt-4 flex-1 overflow-y-auto px-3">
          {filteredSections.map((section) => (
            <div key={section.id} className="mb-4">
              {showExpanded && (
                <div className="mb-2 px-2 text-[11px] font-medium text-gray-400">
                  {section.title}
                </div>
              )}

              <div className="space-y-1">
                {section.children.map((item) => (
                  <SidebarItem
                    key={item.id}
                    item={item}
                    pathname={pathname}
                    expanded={showExpanded}
                    isSearching={isSearching}
                    closeMobileMenu={() => setMobileOpen(false)}
                  />
                ))}
              </div>
            </div>
          ))}

          {filteredSections.length === 0 && (
            <div className="py-10 text-center text-xs text-gray-400">
              موردی یافت نشد
            </div>
          )}
        </nav>

        <div className="flex shrink-0 flex-col items-center justify-center gap-y-1 border-t border-blue-300 p-2">
          <button
            type="button"
            onClick={() => setExpanded((prev) => !prev)}
            className="hidden h-10 w-full items-center justify-center rounded-xl border border-blue-300 text-gray-500 transition-colors hover:bg-gray-200/50 lg:flex"
            aria-label={expanded ? "جمع کردن سایدبار" : "باز کردن سایدبار"}
          >
            {expanded ? (
              <PanelLeftClose size={20} />
            ) : (
              <PanelLeftOpen size={20} />
            )}
          </button>

          <div className="flex flex-row items-center justify-center gap-x-2">
            <Image
              src="/assets/img/logo.png"
              width={20}
              height={38}
              alt="فناوری کهربا"
            />
            {showExpanded && (
              <span className="text-xs text-blue-600">
                تیم توسعه فناوری کهربا
              </span>
            )}
          </div>
        </div>

        <style jsx global>{`
          .custom-scrollbar::-webkit-scrollbar {
            width: 4px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: transparent;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #e5e7eb;
            border-radius: 10px;
          }
          .custom-scrollbar:hover::-webkit-scrollbar-thumb {
            background: #d1d5db;
          }
        `}</style>
      </aside>
    </>
  );
}
