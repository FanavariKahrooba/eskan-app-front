"use client";

import Link from "next/link";
import { Fragment } from "react";
import { ChevronLeft, Home } from "lucide-react";
import { motion } from "framer-motion";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  currentPath?: string;
  maxWidth?: string | number;
  showHome?: boolean;
  homeHref?: string;
  homeLabel?: string;
}

export default function Breadcrumb({
  items,
  currentPath,
  maxWidth = 640,
  showHome = true,
  homeHref = "/",
  homeLabel = "خانه",
}: BreadcrumbProps) {
  const normalizedItems = items.filter(Boolean);

  if (!normalizedItems.length && !showHome) return null;

  const renderItem = (item: BreadcrumbItem, index: number) => {
    const isLast = index === normalizedItems.length - 1;
    const isCurrent =
      currentPath && item.href
        ? currentPath.replace(/\/$/, "") === item.href.replace(/\/$/, "")
        : isLast;

    if (item.href && !isCurrent) {
      return (
        <Link
          href={item.href}
          className="truncate text-gray-500 transition hover:text-gray-900"
          title={item.label}
        >
          {item.label}
        </Link>
      );
    }

    return (
      <span
        className="truncate font-medium text-gray-900"
        aria-current="page"
        title={item.label}
      >
        {item.label}
      </span>
    );
  };

  return (
    <motion.nav
      initial={{ opacity: 0, x: 8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      aria-label="Breadcrumb"
      className="min-w-0"
      style={{ maxWidth }}
    >
      <ol className="flex min-w-0 items-center gap-1 overflow-hidden whitespace-nowrap text-xs">
        {showHome && (
          <>
            <li className="flex min-w-0 items-center">
              <Link
                href={homeHref}
                className="inline-flex items-center gap-1 text-gray-500 transition hover:text-gray-900"
                title={homeLabel}
              >
                <Home size={13} />
                <span className="hidden sm:inline">{homeLabel}</span>
              </Link>
            </li>

            {!!normalizedItems.length && (
              <li className="flex items-center text-gray-300">
                <ChevronLeft size={14} />
              </li>
            )}
          </>
        )}

        {normalizedItems.map((item, index) => (
          <Fragment key={`${item.label}-${item.href || index}`}>
            <li className="flex min-w-0 items-center">
              {renderItem(item, index)}
            </li>

            {index < normalizedItems.length - 1 && (
              <li className="flex items-center text-gray-300">
                <ChevronLeft size={14} />
              </li>
            )}
          </Fragment>
        ))}
      </ol>
    </motion.nav>
  );
}
