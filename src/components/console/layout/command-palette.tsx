"use client";

import { Command } from "cmdk";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Fuse from "fuse.js";

import { useCommandStore } from "@/store/command-store";
import { MenuNode, MenuSection } from "@/config/menu/menu.types";
import { MENU_SECTIONS } from "@/config/menu/menu.data";

type CommandItem = {
  title: string;
  path: string;
  icon?: React.ComponentType<{
    size?: number;
    className?: string;
    strokeWidth?: number;
  }>;
  group: string;
};

function flattenNodes(nodes: MenuNode[], groupTitle: string): CommandItem[] {
  const list: CommandItem[] = [];

  nodes.forEach((node) => {
    if (node.type === "item") {
      if (node.href) {
        list.push({
          title: node.title,
          path: node.href,
          icon: node.icon,
          group: groupTitle,
        });
      }
      return;
    }

    list.push(...flattenNodes(node.children, node.title || groupTitle));
  });

  return list;
}

function flattenMenu(sections: MenuSection[]): CommandItem[] {
  const list: CommandItem[] = [];

  sections.forEach((section) => {
    list.push(...flattenNodes(section.children, section.title));
  });

  return list;
}

export default function CommandPalette() {
  const router = useRouter();
  const { open, setOpen } = useCommandStore();

  const [search, setSearch] = useState("");

  const commands = useMemo(() => flattenMenu(MENU_SECTIONS), []);

  const fuse = useMemo(() => {
    return new Fuse(commands, {
      keys: ["title", "group"],
      threshold: 0.4,
    });
  }, [commands]);

  const results = search
    ? fuse.search(search).map((result) => result.item)
    : commands;

  const quickActions = [
    { title: "Create Order", path: "/sales/orders/new" },
    { title: "Create Invoice", path: "/sales/invoices/new" },
    { title: "Add User", path: "/users/new" },
  ];

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev: boolean) => !prev);
      }

      if (e.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("keydown", down);
    return () => {
      document.removeEventListener("keydown", down);
    };
  }, [setOpen]);

  function navigate(path: string) {
    router.push(path);

    const recent = JSON.parse(
      localStorage.getItem("recent-pages") || "[]",
    ) as string[];
    const updated = [path, ...recent.filter((item) => item !== path)].slice(
      0,
      5,
    );

    localStorage.setItem("recent-pages", JSON.stringify(updated));
    setOpen(false);
  }

  const recentPages =
    typeof window !== "undefined"
      ? (JSON.parse(localStorage.getItem("recent-pages") || "[]") as string[])
      : [];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-start justify-center bg-black/20 pt-32"
          onClick={() => setOpen(false)}
        >
          <motion.div
            initial={{ scale: 0.96, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.96, opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={(e) => e.stopPropagation()}
          >
            <Command className="w-[680px] overflow-hidden rounded-xl border bg-white shadow-2xl">
              <Command.Input
                value={search}
                onValueChange={setSearch}
                placeholder="Search pages, actions..."
                className="w-full border-b p-4 text-sm outline-none"
              />

              <Command.List className="max-h-[420px] overflow-y-auto p-2">
                {search === "" && recentPages.length > 0 && (
                  <Command.Group heading="Recent">
                    {recentPages.map((path) => (
                      <Command.Item
                        key={path}
                        onSelect={() => navigate(path)}
                        className="rounded-lg px-3 py-2 aria-selected:bg-gray-100"
                      >
                        {path}
                      </Command.Item>
                    ))}
                  </Command.Group>
                )}

                {search === "" && (
                  <Command.Group heading="Quick Actions">
                    {quickActions.map((action) => (
                      <Command.Item
                        key={action.path}
                        onSelect={() => navigate(action.path)}
                        className="rounded-lg px-3 py-2 aria-selected:bg-gray-100"
                      >
                        {action.title}
                      </Command.Item>
                    ))}
                  </Command.Group>
                )}

                <Command.Group heading="Pages">
                  {results.map((cmd) => {
                    const Icon = cmd.icon;

                    return (
                      <Command.Item
                        key={cmd.path}
                        onSelect={() => navigate(cmd.path)}
                        className="flex items-center gap-3 rounded-lg px-3 py-2 aria-selected:bg-gray-100"
                      >
                        {Icon && <Icon size={18} />}
                        <span className="text-sm">{cmd.title}</span>
                      </Command.Item>
                    );
                  })}
                </Command.Group>
              </Command.List>

              <div className="flex justify-between border-t p-2 text-xs text-gray-400">
                <span>↑↓ navigate</span>
                <span>enter select</span>
                <span>esc close</span>
              </div>
            </Command>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
