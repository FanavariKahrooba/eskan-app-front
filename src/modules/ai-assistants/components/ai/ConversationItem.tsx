"use client";

import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { cn, formatRelativeDate } from "../../lib/utils";
import { ConversationListItem } from "../../types/ai";

interface Props {
  item: ConversationListItem;
  active?: boolean;
  onClick: () => void;
  onRename: (title: string) => void;
  onDelete: () => void;
}

export function ConversationItem({
  item,
  active,
  onClick,
  onRename,
  onDelete,
}: Props) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(item.title || "");
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });

  const menuButtonRef = useRef<HTMLButtonElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  function submitRename() {
    const clean = title.trim();
    if (!clean) return;
    onRename(clean);
    setEditing(false);
  }

  function openMenu() {
    if (!menuButtonRef.current) return;

    const rect = menuButtonRef.current.getBoundingClientRect();

    setMenuPosition({
      top: rect.bottom + 8,
      left: rect.left,
    });

    setMenuOpen(true);
  }

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      const target = e.target as Node;

      if (
        menuRef.current &&
        !menuRef.current.contains(target) &&
        menuButtonRef.current &&
        !menuButtonRef.current.contains(target)
      ) {
        setMenuOpen(false);
      }
    }

    function handleScrollOrResize() {
      if (!menuOpen || !menuButtonRef.current) return;
      const rect = menuButtonRef.current.getBoundingClientRect();
      setMenuPosition({
        top: rect.bottom + 8,
        left: rect.left,
      });
    }

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("resize", handleScrollOrResize);
    window.addEventListener("scroll", handleScrollOrResize, true);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("resize", handleScrollOrResize);
      window.removeEventListener("scroll", handleScrollOrResize, true);
    };
  }, [menuOpen]);

  return (
    <div
      className={cn(
        "group relative rounded-2xl border p-3 transition",
        active
          ? "border-cyan-400/40 bg-cyan-400/10"
          : "border-white/10 bg-white/[0.04] hover:bg-white/[0.08]",
      )}
    >
      <button onClick={onClick} className="block w-full text-right">
        {editing ? (
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={submitRename}
            onKeyDown={(e) => {
              if (e.key === "Enter") submitRename();
            }}
            autoFocus
            className="w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-sm text-white outline-none"
          />
        ) : (
          <>
            <div className="line-clamp-1 pl-10 text-sm font-medium text-slate-100">
              {item.title || "گفتگوی بدون عنوان"}
            </div>
            <div className="mt-2 text-[11px] text-slate-500">
              {formatRelativeDate(item.updated_at || item.created_at)}
            </div>
          </>
        )}
      </button>

      <div className="absolute left-3 top-3">
        <button
          ref={menuButtonRef}
          onClick={(e) => {
            e.stopPropagation();
            setMenuOpen((prev) => {
              if (!prev) {
                requestAnimationFrame(openMenu);
              }
              return !prev;
            });
          }}
          className="rounded-xl p-2 text-slate-400 opacity-0 transition hover:bg-white/10 hover:text-white group-hover:opacity-100"
        >
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </div>

      {menuOpen &&
        createPortal(
          <div
            ref={menuRef}
            style={{
              position: "fixed",
              top: menuPosition.top,
              left: menuPosition.left,
            }}
            className="z-[9999] w-36 rounded-2xl border border-white/10 bg-slate-950 p-2 shadow-xl"
          >
            <button
              onClick={() => {
                setEditing(true);
                setMenuOpen(false);
              }}
              className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-slate-200 hover:bg-white/10"
            >
              <Pencil className="h-4 w-4" />
              تغییر عنوان
            </button>

            <button
              onClick={() => {
                setMenuOpen(false);
                onDelete();
              }}
              className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-red-300 hover:bg-red-500/10"
            >
              <Trash2 className="h-4 w-4" />
              حذف
            </button>
          </div>,
          document.body,
        )}
    </div>
  );
}
