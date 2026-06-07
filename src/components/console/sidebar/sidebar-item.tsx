/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Tooltip from "./tooltip";
import { MenuNode } from "@/config/menu/menu.types";


function hasActiveChild(item: MenuNode, pathname: string): boolean {
  if (item.type !== "group" || !item.children || item.children.length === 0)
    return false;

  return item.children.some((child) => {
    if (child.type === "item" && child.href === pathname) return true;
    return hasActiveChild(child, pathname);
  });
}

function isItemActive(item: MenuNode, pathname: string): boolean {
  if (item.type === "item" && item.href === pathname) return true;
  return hasActiveChild(item, pathname);
}

interface SidebarItemProps {
  item: MenuNode;
  expanded: boolean;
  level?: number;
  pathname: string;
  closeMobileMenu?: () => void;
  isSearching?: boolean;
}

export function SidebarItem({
  item,
  expanded,
  level = 0,
  pathname,
  closeMobileMenu,
  isSearching = false,
}: SidebarItemProps) {
  const [isOpen, setIsOpen] = useState(false);

  const hasChildren = item.type === "group" && item.children.length > 0;

  const childIsActive = useMemo(() => {
    return hasActiveChild(item, pathname);
  }, [item, pathname]);

  const isActive = useMemo(() => {
    return isItemActive(item, pathname);
  }, [item, pathname]);

  const Icon = item.icon;

  useEffect(() => {
    if (!hasChildren) return;

    if (childIsActive) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsOpen(true);
      return;
    }

    if (isSearching && expanded) {
      setIsOpen(true);
    }
  }, [hasChildren, childIsActive, isSearching, expanded]);

  useEffect(() => {
    if (!expanded) {
      setIsOpen(false);
    }
  }, [expanded]);

  const handleItemClick = () => {
    if (hasChildren) {
      setIsOpen((prev) => !prev);
    }
  };

  const content = (
    <div
      onClick={handleItemClick}
      className={`
        group my-0.5 flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2 transition-all duration-200
        ${isActive ? "bg-blue-50 text-blue-600" : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"}
        ${!expanded ? "justify-center px-0" : ""}
        ${item.disabled ? "pointer-events-none opacity-50" : ""}
      `}
      style={{ paddingLeft: expanded ? level * 12 + 12 : 0 }}
    >
      {Icon && (
        <Icon size={20} strokeWidth={isActive ? 2.5 : 2} className="shrink-0" />
      )}

      {expanded && (
        <>
          <span className="flex-1 truncate text-[13.5px] font-medium">
            {item.title}
          </span>

          {"badge" in item && item.badge && (
            <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] text-blue-600">
              {item.badge.text}
            </span>
          )}

          {hasChildren && (
            <ChevronDown
              size={14}
              className={`shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
            />
          )}
        </>
      )}
    </div>
  );

  return (
    <div className="w-full">
      <Tooltip text={item.title} expanded={expanded}>
        {item.type === "item" && item.href ? (
          <Link href={item.href} onClick={closeMobileMenu}>
            {content}
          </Link>
        ) : (
          content
        )}
      </Tooltip>

      <AnimatePresence initial={false}>
        {isOpen && hasChildren && expanded && item.type === "group" && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="overflow-hidden"
          >
            {item.children.map((child) => (
              <SidebarItem
                key={child.id}
                item={child}
                pathname={pathname}
                expanded={expanded}
                level={level + 1}
                closeMobileMenu={closeMobileMenu}
                isSearching={isSearching}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
