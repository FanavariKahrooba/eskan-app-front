"use client";

import * as React from "react";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { cn } from "../../lib/utils";

interface DropdownContextValue {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const DropdownContext = createContext<DropdownContextValue | null>(null);

function useDropdown() {
  const ctx = useContext(DropdownContext);
  if (!ctx) {
    throw new Error("Dropdown components must be used inside <DropdownMenu>");
  }
  return ctx;
}

/* ================= ROOT ================= */

export function DropdownMenu({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <DropdownContext.Provider value={{ open, setOpen }}>
      <div className="relative inline-block text-left">{children}</div>
    </DropdownContext.Provider>
  );
}

/* ================= TRIGGER ================= */

export function DropdownMenuTrigger({
  children,
  asChild = false,
}: {
  children: React.ReactNode;
  asChild?: boolean;
}) {
  const { setOpen } = useDropdown();

  const handleClick: React.MouseEventHandler = () => {
    setOpen((prev) => !prev);
  };

  if (
    asChild &&
    React.isValidElement<{ onClick?: React.MouseEventHandler }>(children)
  ) {
    return React.cloneElement(children, {
      onClick: handleClick,
    });
  }

  return (
    <button type="button" onClick={handleClick}>
      {children}
    </button>
  );
}
/* ================= CONTENT ================= */

export function DropdownMenuContent({
  children,
  className,
  align = "start",
}: {
  children: React.ReactNode;
  className?: string;
  align?: "start" | "end";
}) {
  const { open, setOpen } = useDropdown();
  const ref = useRef<HTMLDivElement>(null);

  // close on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open, setOpen]);

  if (!open) return null;

  return (
    <div
      ref={ref}
      className={cn(
        "absolute z-50 mt-2 min-w-[180px] overflow-hidden rounded-xl border border-border bg-popover p-1 text-popover-foreground shadow-lg",
        "animate-in fade-in-80 zoom-in-95",
        align === "end" ? "right-0" : "left-0",
        className,
      )}
    >
      {children}
    </div>
  );
}

/* ================= ITEM ================= */

export function DropdownMenuItem({
  children,
  className,
  onClick,
  disabled,
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
}) {
  const { setOpen } = useDropdown();

  const handleClick = () => {
    if (disabled) return;
    onClick?.();
    setOpen(false);
  };

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={handleClick}
      className={cn(
        "flex w-full cursor-pointer select-none items-center rounded-lg px-3 py-2 text-sm transition",
        "hover:bg-muted focus:bg-muted",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
    >
      {children}
    </button>
  );
}

/* ================= SEPARATOR ================= */

export function DropdownMenuSeparator() {
  return <div className="my-1 h-px bg-border" />;
}
