"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { PageShellAction } from "./page-shell";

interface QuickActionsProps {
  actions: PageShellAction[];
}

const variantClassMap: Record<
  NonNullable<PageShellAction["variant"]>,
  string
> = {
  primary:
    "bg-gray-950 text-white border-gray-950 hover:bg-gray-800 hover:border-gray-800",
  secondary:
    "bg-white text-gray-800 border-gray-200 hover:bg-gray-50 hover:border-gray-300",
  danger:
    "bg-white text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300",
  ghost:
    "bg-transparent text-gray-700 border-transparent hover:bg-gray-100 hover:border-gray-100",
};

function ActionContent({ action }: { action: PageShellAction }) {
  return (
    <>
      {action.icon && <span className="shrink-0">{action.icon}</span>}
      <span className="truncate">{action.label}</span>
    </>
  );
}

export default function QuickActions({ actions }: QuickActionsProps) {
  if (!actions.length) return null;

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={{
        hidden: {},
        show: {
          transition: {
            staggerChildren: 0.035,
          },
        },
      }}
      className="flex flex-wrap items-center gap-2"
    >
      {actions.map((action) => {
        const variant = action.variant || "secondary";
        const className = [
          "inline-flex h-9 items-center justify-center gap-2 rounded-xl border px-3 text-sm font-medium transition",
          "focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2",
          "disabled:cursor-not-allowed disabled:opacity-50",
          variantClassMap[variant],
        ].join(" ");

        const motionProps = {
          variants: {
            hidden: { opacity: 0, y: -4 },
            show: { opacity: 1, y: 0 },
          },
          transition: { duration: 0.2, ease: "easeOut" },
        };

        if (action.href && !action.disabled) {
          return (
            <motion.div key={action.id} {...motionProps}>
              <Link href={action.href} className={className}>
                <ActionContent action={action} />
              </Link>
            </motion.div>
          );
        }

        return (
          <motion.button
            key={action.id}
            type="button"
            disabled={action.disabled}
            onClick={action.onClick}
            className={className}
            {...motionProps}
          >
            <ActionContent action={action} />
          </motion.button>
        );
      })}
    </motion.div>
  );
}
