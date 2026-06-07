"use client";

import { motion } from "framer-motion";
import type {
  DynamicPageShellProps,
  PageShellModuleConfig,
} from "./page-shell-types";
import { PageShellGrid } from "./page-shell-grid";

interface ExtendedDynamicPageShellProps<
  TContext = any,
> extends DynamicPageShellProps<TContext> {
  defaultModules?: PageShellModuleConfig[];
}

export function DynamicPageShell<TContext = any>({
  pageKey,
  title,
  description,
  modules,
  defaultModules = [],
  onModulesChange,
  context,
  className,
  contentClassName,
  allowDrag = true,
  allowResize = true,
  allowHide = true,
  allowReset = true,
  actions = [],
  emptyState,
  loading = false,
}: ExtendedDynamicPageShellProps<TContext>) {
  return (
    <div className={["space-y-6", className].filter(Boolean).join(" ")}>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4 rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:flex-row sm:items-start sm:justify-between"
      >
        <div className="min-w-0">
          <h1 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-2xl">
            {title}
          </h1>

          {description ? (
            <p className="mt-2 max-w-3xl text-sm leading-6 text-zinc-500 dark:text-zinc-400">
              {description}
            </p>
          ) : null}
        </div>

        {actions.length > 0 ? (
          <div className="flex flex-wrap items-center gap-2">
            {actions.map((action) => (
              <button
                key={action.key}
                type="button"
                onClick={action.onClick}
                className={[
                  "inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition",
                  action.variant === "primary"
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : action.variant === "danger"
                      ? "bg-red-600 text-white hover:bg-red-700"
                      : "border border-zinc-200 text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-900",
                ].join(" ")}
              >
                {action.icon}
                {action.label}
              </button>
            ))}
          </div>
        ) : null}
      </motion.div>

      <div className={contentClassName}>
        {loading ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="col-span-1 min-h-[220px] animate-pulse rounded-2xl border border-zinc-200 bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 md:col-span-2"
              />
            ))}
          </div>
        ) : (
          <PageShellGrid
            pageKey={pageKey}
            modules={modules}
            defaultModules={defaultModules}
            onChange={onModulesChange}
            context={context}
            allowDrag={allowDrag}
            allowResize={allowResize}
            allowHide={allowHide}
            allowReset={allowReset}
            emptyState={emptyState}
          />
        )}
      </div>
    </div>
  );
}
