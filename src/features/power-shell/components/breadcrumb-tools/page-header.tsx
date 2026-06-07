"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";
// import Breadcrumb from "@/components/console/layout/breadcrumb";
import FavoriteButton from "@/components/console/layout/favorite-button";
import QuickActions from "./quick-actions";
import type { PageShellAction, PageShellBreadcrumbItem } from "./page-shell";
import Breadcrumb from "../layout/breadcrumb";

interface PageHeaderProps {
  title: string;
  description?: string;
  breadcrumbs?: PageShellBreadcrumbItem[];
  currentPath?: string;
  actions?: PageShellAction[];
  favoriteKey?: string;
  sticky?: boolean;
  meta?: ReactNode;
  rightSlot?: ReactNode;
  maxWidthClass?: string;
}

export default function PageHeader({
  title,
  description,
  breadcrumbs = [],
  currentPath,
  actions = [],
  favoriteKey,
  sticky = true,
  meta,
  rightSlot,
  maxWidthClass = "max-w-7xl",
}: PageHeaderProps) {
  return (
    <header
      className={[
        "border-b border-gray-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80",
        sticky ? "sticky top-0 z-40" : "relative z-10",
      ].join(" ")}
    >
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.22, ease: "easeOut" }}
        className={`${maxWidthClass} mx-auto px-4 md:px-6 py-4`}
      >
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0 flex-1">
              {!!breadcrumbs.length && (
                <div className="mb-2">
                  <Breadcrumb
                    items={breadcrumbs} 
                    currentPath={currentPath || ""}
                    maxWidth="100%"
                  />
                </div>
              )}

              <div className="flex min-w-0 items-center gap-2">
                <h1 className="truncate text-xl font-bold tracking-tight text-gray-950 md:text-2xl">
                  {title}
                </h1>

                {favoriteKey && <FavoriteButton page={favoriteKey} />}
              </div>

              {description && (
                <p className="mt-1 max-w-3xl text-sm leading-6 text-gray-500">
                  {description}
                </p>
              )}

              {meta && <div className="mt-3">{meta}</div>}
            </div>

            <div className="flex shrink-0 flex-col gap-2 sm:flex-row sm:items-center lg:justify-end">
              {rightSlot}

              {!!actions.length && <QuickActions actions={actions} />}
            </div>
          </div>
        </div>
      </motion.div>
    </header>
  );
}
