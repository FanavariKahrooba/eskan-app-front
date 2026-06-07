/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutGrid,
  Search,
  Pin,
  PinOff,
  Clock3,
  ArrowLeft,
  ArrowRight,
  X,
  GripVertical,
  ChevronLeft,
  Trash2,
  ExternalLink,
  RotateCcw,
  Copy,
  Download,
  Upload,
  Sparkles,
  History,
} from "lucide-react";
import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  horizontalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Fuse from "fuse.js";
import FocusTrap from "focus-trap-react";

import { filterMenuSections } from "@/config/menu/menu.access";
import {
  findActiveMenuItem,
  flattenMenuSections,
  normalizePath,
  searchMenuItems,
} from "@/config/menu/menu.navigation";
import type { FlatMenuItem, MenuAccessContext } from "@/config/menu/menu.types";
import { MENU_SECTIONS } from "@/config/menu/menu.data";
import { APP_BASE_PATH, withBasePath, isExternalPath } from "@/config/app-path";

type MenuIcon = React.ComponentType<{ size?: number; className?: string }>;

type QuickAccessItem = {
  id: string;
  title: string;
  description: string;
  href: string;
  path: string;
  icon: MenuIcon;
  parentTitles: string[];
  sectionTitle: string;
  groupTitle?: string;
  breadcrumbs: string[];
  badgeText?: string;
  badgeVariant?: string;
  keywords?: string[];
};

type RecentEntry = {
  id: string;
  visitedAt: number;
};

type SearchHistoryEntry = {
  query: string;
  usedAt: number;
};

type ToastState = {
  id: number;
  message: string;
};

type SearchScope = {
  section?: string;
  group?: string;
  pinned?: boolean;
  recent?: boolean;
  external?: boolean;
  text: string;
};

type KeyboardItem =
  | { kind: "pinned"; item: QuickAccessItem }
  | { kind: "recent"; item: QuickAccessItem }
  | { kind: "all"; item: QuickAccessItem };

const STORAGE_SCHEMA_VERSION = 2;
const TENANT_ID = "default-tenant";
const USER_ID = "default-user";

const storageKey = (name: string) =>
  `quick-access:${STORAGE_SCHEMA_VERSION}:${TENANT_ID}:${USER_ID}:${name}`;

const PINNED_STORAGE_KEY = storageKey("pinned");
const RECENT_STORAGE_KEY = storageKey("recent");
const SEARCH_HISTORY_STORAGE_KEY = storageKey("search-history");
const ANALYTICS_STORAGE_KEY = storageKey("analytics");
const LEGACY_PINNED_STORAGE_KEY = "quick-access-pinned";
const LEGACY_RECENT_STORAGE_KEY = "quick-access-recent";

const MAX_RECENT = 8;
const MAX_SEARCH_HISTORY = 8;
const EXTERNAL_LINKS_ENABLED = true;

const DEFAULT_ACCESS_CONTEXT: MenuAccessContext = {
  permissions: [],
  roles: [],
  featureFlags: [],
  isSuperAdmin: true,
};

function normalizeHref(href: string) {
  if (!href) return "";
  if (isExternalPath(href)) return href;
  return withBasePath(normalizePath(href, ""));
}

function normalizeMenuPath(pathValue: string) {
  if (!pathValue) return "";
  if (isExternalPath(pathValue)) return pathValue;
  return withBasePath(normalizePath(pathValue, ""));
}

function normalizePathname(pathname: string) {
  return normalizePath(pathname, "");
}

function toQuickAccessItem(item: FlatMenuItem): QuickAccessItem {
  return {
    id: item.id,
    title: item.title,
    description: item.groupTitle || item.sectionTitle || "دسترسی مستقیم",
    href: normalizeHref(item.href),
    path: normalizeMenuPath(item.path || item.href),
    icon: (item.icon || LayoutGrid) as MenuIcon,
    parentTitles: item.breadcrumbs.slice(0, -1),
    sectionTitle: item.sectionTitle,
    groupTitle: item.groupTitle,
    breadcrumbs: item.breadcrumbs,
    badgeText: item.badge?.text,
    badgeVariant: item.badge?.variant,
    keywords: item.keywords,
  };
}

function safeParseJson<T>(value: string | null, fallback: T): T {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

function normalizeSearchQuery(value: string) {
  return value.trim().replace(/\s+/g, " ");
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function copyToClipboard(value: string) {
  if (typeof navigator === "undefined") {
    return Promise.reject(new Error("Clipboard unavailable"));
  }

  if (navigator.clipboard?.writeText) {
    return navigator.clipboard.writeText(value);
  }

  const textarea = document.createElement("textarea");
  textarea.value = value;
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();

  try {
    document.execCommand("copy");
    document.body.removeChild(textarea);
    return Promise.resolve();
  } catch (error) {
    document.body.removeChild(textarea);
    return Promise.reject(error);
  }
}

function formatRelativeTime(timestamp: number) {
  const diff = Date.now() - timestamp;
  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;

  if (diff < minute) return "همین حالا";
  if (diff < hour) return `${Math.floor(diff / minute)} دقیقه پیش`;
  if (diff < day) return `${Math.floor(diff / hour)} ساعت پیش`;
  return `${Math.floor(diff / day)} روز پیش`;
}

function shouldTrackRecent(item: QuickAccessItem | null, basePath: string) {
  if (!item) return false;
  if (!item.href) return false;
  if (isExternalPath(item.href)) return false;

  const normalized = normalizePathname(item.href);
  if (!normalized || normalized === basePath) return false;

  return true;
}

function parseSearchScope(rawQuery: string): SearchScope {
  const parts = rawQuery.trim().split(/\s+/).filter(Boolean);
  const scope: SearchScope = { text: "" };
  const freeText: string[] = [];

  for (const part of parts) {
    const [key, ...rest] = part.split(":");
    const value = rest.join(":");

    if (!value) {
      freeText.push(part);
      continue;
    }

    const normalizedKey = key.toLowerCase();
    const normalizedValue = value.toLowerCase();

    if (normalizedKey === "section") {
      scope.section = normalizedValue;
      continue;
    }
    if (normalizedKey === "group") {
      scope.group = normalizedValue;
      continue;
    }
    if (normalizedKey === "pinned") {
      scope.pinned = ["1", "true", "yes"].includes(normalizedValue);
      continue;
    }
    if (normalizedKey === "recent") {
      scope.recent = ["1", "true", "yes"].includes(normalizedValue);
      continue;
    }
    if (normalizedKey === "external") {
      scope.external = ["1", "true", "yes"].includes(normalizedValue);
      continue;
    }

    freeText.push(part);
  }

  scope.text = freeText.join(" ");
  return scope;
}

function itemMatchesScope(
  item: QuickAccessItem,
  scope: SearchScope,
  pinnedIds: string[],
  recentEntries: RecentEntry[],
) {
  if (scope.section && !item.sectionTitle.toLowerCase().includes(scope.section)) {
    return false;
  }

  if (scope.group && !(item.groupTitle || "").toLowerCase().includes(scope.group)) {
    return false;
  }

  if (typeof scope.pinned === "boolean" && pinnedIds.includes(item.id) !== scope.pinned) {
    return false;
  }

  if (
    typeof scope.recent === "boolean" &&
    recentEntries.some((entry) => entry.id === item.id) !== scope.recent
  ) {
    return false;
  }

  if (
    typeof scope.external === "boolean" &&
    isExternalPath(item.href) !== scope.external
  ) {
    return false;
  }

  return true;
}

function highlightText(text: string, query: string) {
  const normalized = normalizeSearchQuery(query);
  if (!normalized) return text;

  const terms = normalized
    .split(/\s+/)
    .map((term) => term.trim())
    .filter((term) => term && !term.includes(":"));

  if (terms.length === 0) return text;

  let result: React.ReactNode[] = [text];

  for (const term of terms) {
    const next: React.ReactNode[] = [];
    const regex = new RegExp(`(${escapeRegExp(term)})`, "gi");

    result.forEach((part, partIndex) => {
      if (typeof part !== "string") {
        next.push(part);
        return;
      }

      const chunks = part.split(regex);

      chunks.forEach((chunk, chunkIndex) => {
        if (!chunk) return;

        if (chunk.toLowerCase() === term.toLowerCase()) {
          next.push(
            <mark
              key={`${term}-${partIndex}-${chunkIndex}`}
              className="rounded bg-yellow-100 px-0.5 text-inherit"
            >
              {chunk}
            </mark>,
          );
        } else {
          next.push(chunk);
        }
      });
    });

    result = next;
  }

  return result;
}

function getSmartContextMenuPosition(
  x: number,
  y: number,
  menuWidth = 260,
  menuHeight = 180,
) {
  if (typeof window === "undefined") return { x, y };

  const padding = 8;
  const maxX = window.innerWidth - menuWidth - padding;
  const maxY = window.innerHeight - menuHeight - padding;

  return {
    x: Math.max(padding, Math.min(x, maxX)),
    y: Math.max(padding, Math.min(y, maxY)),
  };
}

function groupRecentEntriesByTime(
  items: QuickAccessItem[],
  recentMap: Map<string, number>,
) {
  const now = Date.now();
  const day = 24 * 60 * 60 * 1000;

  return items.reduce(
    (acc, item) => {
      const visitedAt = recentMap.get(item.id) ?? now;
      const diff = now - visitedAt;

      if (diff < day) {
        acc.today.push(item);
      } else if (diff < 7 * day) {
        acc.thisWeek.push(item);
      } else {
        acc.older.push(item);
      }

      return acc;
    },
    {
      today: [] as QuickAccessItem[],
      thisWeek: [] as QuickAccessItem[],
      older: [] as QuickAccessItem[],
    },
  );
}

function SortablePinnedItem({
  item,
  active,
  onOpen,
  onContextMenu,
}: {
  item: QuickAccessItem;
  active: boolean;
  onOpen: (item: QuickAccessItem) => void;
  onContextMenu: (event: React.MouseEvent, item: QuickAccessItem) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: item.id });

  const Icon = item.icon;

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <button
      ref={setNodeRef}
      style={style}
      type="button"
      onClick={() => onOpen(item)}
      onContextMenu={(event) => onContextMenu(event, item)}
      className={[
        "group inline-flex h-8 shrink-0 cursor-pointer items-center gap-2 rounded-lg border px-2.5 text-sm shadow-sm transition",
        "max-w-[130px] sm:max-w-[180px]",
        active
          ? "border-blue-200 bg-blue-50 text-blue-700 ring-1 ring-blue-100"
          : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900",
        isDragging ? "z-50 opacity-70 shadow-md" : "",
      ].join(" ")}
      aria-label={`باز کردن ${item.title}`}
      {...attributes}
      {...listeners}
    >
      <Icon
        size={15}
        className={active ? "shrink-0 text-blue-600" : "shrink-0 text-slate-500"}
      />
      <span className="min-w-0 truncate">{item.title}</span>
    </button>
  );
}

function AccessCard({
  item,
  pinned,
  active,
  visitedAt,
  searchQuery,
  keyboardSelected,
  onTogglePin,
  onOpen,
  onOpenInNewTab,
  onCopyLink,
  onClearRecentItem,
  onContextMenu,
}: {
  item: QuickAccessItem;
  pinned: boolean;
  active: boolean;
  visitedAt?: number | null;
  searchQuery: string;
  keyboardSelected?: boolean;
  onTogglePin: (itemId: string) => void;
  onOpen: (item: QuickAccessItem) => void;
  onOpenInNewTab: (item: QuickAccessItem) => void;
  onCopyLink: (item: QuickAccessItem) => void;
  onClearRecentItem: (itemId: string) => void;
  onContextMenu: (event: React.MouseEvent, item: QuickAccessItem) => void;
}) {
  const Icon = item.icon;

  return (
    <div
      onContextMenu={(event) => onContextMenu(event, item)}
      className={[
        "group rounded-2xl border bg-white p-4 shadow-sm transition hover:shadow-md",
        active ? "border-blue-200 ring-2 ring-blue-50" : "border-slate-200 hover:border-slate-300",
        keyboardSelected ? "border-slate-400 ring-2 ring-slate-900/10" : "",
      ].join(" ")}
      aria-selected={keyboardSelected}
    >
      <div className="flex items-start gap-3">
        <div
          className={[
            "inline-flex size-11 shrink-0 items-center justify-center rounded-xl",
            active ? "bg-blue-50 text-blue-700" : "bg-slate-100 text-slate-700",
          ].join(" ")}
        >
          <Icon size={20} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex min-w-0 items-center gap-2">
                <h3 className="truncate text-sm font-semibold text-slate-900">
                  {highlightText(item.title, searchQuery)}
                </h3>

                {active && (
                  <span className="shrink-0 rounded-full bg-blue-50 px-2 py-0.5 text-[11px] font-medium text-blue-700">
                    فعال
                  </span>
                )}

                {isExternalPath(item.href) && (
                  <span className="shrink-0 rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-700">
                    خارجی
                  </span>
                )}

                {item.badgeText ? (
                  <span className="shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600">
                    {item.badgeText}
                  </span>
                ) : null}
              </div>

              <p className="mt-1 line-clamp-2 text-sm text-slate-500">
                {highlightText(item.description, searchQuery)}
              </p>

              {item.breadcrumbs?.length > 0 ? (
                <p className="mt-1 line-clamp-1 text-xs text-slate-400">
                  {item.breadcrumbs.join(" / ")}
                </p>
              ) : null}

              {visitedAt ? (
                <p className="mt-2 text-xs text-slate-400">
                  آخرین بازدید: {formatRelativeTime(visitedAt)}
                </p>
              ) : null}
            </div>

            <button
              type="button"
              onClick={() => onTogglePin(item.id)}
              className={[
                "inline-flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-xl border bg-white transition",
                pinned
                  ? "border-blue-100 text-blue-600 hover:bg-blue-50"
                  : "border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-900",
              ].join(" ")}
              title={pinned ? "حذف از پین‌شده‌ها" : "افزودن به پین‌شده‌ها"}
              aria-label={pinned ? "حذف از پین‌شده‌ها" : "افزودن به پین‌شده‌ها"}
            >
              {pinned ? <PinOff size={16} /> : <Pin size={16} />}
            </button>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              {isExternalPath(item.href) ? (
                <button
                  type="button"
                  onClick={() => onOpenInNewTab(item)}
                  className={[
                    "inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition",
                    active ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-slate-900 text-white hover:bg-slate-700",
                  ].join(" ")}
                  disabled={!EXTERNAL_LINKS_ENABLED}
                >
                  باز کردن
                  <ExternalLink size={14} />
                </button>
              ) : (
                <Link
                  href={item.href}
                  onClick={() => onOpen(item)}
                  className={[
                    "inline-flex items-center rounded-lg px-3 py-2 text-sm font-medium transition",
                    active ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-slate-900 text-white hover:bg-slate-700",
                  ].join(" ")}
                >
                  باز کردن
                </Link>
              )}

              <button
                type="button"
                onClick={() => onOpenInNewTab(item)}
                className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-xs text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
              >
                تب جدید
              </button>

              <button
                type="button"
                onClick={() => onCopyLink(item)}
                className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-xs text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
              >
                <Copy size={13} />
                کپی لینک
              </button>

              {visitedAt ? (
                <button
                  type="button"
                  onClick={() => onClearRecentItem(item.id)}
                  className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-xs text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
                >
                  <Trash2 size={13} />
                  حذف از اخیر
                </button>
              ) : null}
            </div>

            <span className="text-xs text-slate-400">
              {pinned ? "پین شده" : "پین نشده"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function QuickAccess() {
  const router = useRouter();
  const pathname = usePathname();
  const basePath = APP_BASE_PATH;

  const accessContext = DEFAULT_ACCESS_CONTEXT;

  const visibleSections = useMemo(() => {
    return filterMenuSections(MENU_SECTIONS, accessContext);
  }, [accessContext]);

  const QUICK_ACCESS_ITEMS = useMemo(() => {
    return flattenMenuSections(visibleSections).map(toQuickAccessItem);
  }, [visibleSections]);

  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [pinnedIds, setPinnedIds] = useState<string[]>([]);
  const [recentEntries, setRecentEntries] = useState<RecentEntry[]>([]);
  const [searchHistory, setSearchHistory] = useState<SearchHistoryEntry[]>([]);
  const [storageHydrated, setStorageHydrated] = useState(false);
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    item: QuickAccessItem;
  } | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [toast, setToast] = useState<ToastState | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [analyticsSnapshot, setAnalyticsSnapshot] = useState({
    opens: 0,
    searches: 0,
    clicks: 0,
  });

  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const headerPinnedRef = useRef<HTMLDivElement | null>(null);
  const openStartedAtRef = useRef<number | null>(null);
  const liveRegionRef = useRef<HTMLDivElement | null>(null);
  const fileImportRef = useRef<HTMLInputElement | null>(null);
  const resultRefs = useRef<Array<HTMLDivElement | null>>([]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 6 },
    }),
  );

  const announce = (message: string) => {
    if (!liveRegionRef.current) return;
    liveRegionRef.current.textContent = "";
    window.setTimeout(() => {
      if (liveRegionRef.current) {
        liveRegionRef.current.textContent = message;
      }
    }, 20);
  };

  const showToast = (message: string) => {
    setToast({ id: Date.now(), message });
    announce(message);
  };

  const trackAnalytics = (
    type: "open" | "search" | "click" | "dwell",
    payload?: unknown,
  ) => {
    try {
      const raw = safeParseJson<{
        opens: number;
        searches: number;
        clicks: number;
        dwells: number[];
        lastPayloads: unknown[];
      }>(localStorage.getItem(ANALYTICS_STORAGE_KEY), {
        opens: 0,
        searches: 0,
        clicks: 0,
        dwells: [],
        lastPayloads: [],
      });

      if (type === "open") raw.opens += 1;
      if (type === "search") raw.searches += 1;
      if (type === "click") raw.clicks += 1;
      if (type === "dwell" && typeof payload === "number") raw.dwells.push(payload);

      if (payload && type !== "dwell") {
        raw.lastPayloads = [payload, ...raw.lastPayloads].slice(0, 10);
      }

      localStorage.setItem(ANALYTICS_STORAGE_KEY, JSON.stringify(raw));
      setAnalyticsSnapshot({
        opens: raw.opens,
        searches: raw.searches,
        clicks: raw.clicks,
      });
    } catch {}
  };

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(media.matches);
    update();
    media.addEventListener?.("change", update);

    return () => {
      media.removeEventListener?.("change", update);
    };
  }, []);

  useEffect(() => {
    const validIds = new Set(QUICK_ACCESS_ITEMS.map((item) => item.id));

    const readPinned = () => {
      try {
        const migrated =
          localStorage.getItem(PINNED_STORAGE_KEY) ??
          localStorage.getItem(LEGACY_PINNED_STORAGE_KEY);

        if (!migrated) return [];

        const parsed = JSON.parse(migrated);
        if (!Array.isArray(parsed)) return [];

        return parsed
          .filter((id): id is string => typeof id === "string")
          .filter((id) => validIds.has(id));
      } catch {
        return [];
      }
    };

    const readRecent = () => {
      try {
        const migrated =
          localStorage.getItem(RECENT_STORAGE_KEY) ??
          localStorage.getItem(LEGACY_RECENT_STORAGE_KEY);

        if (!migrated) return [];

        const parsed = JSON.parse(migrated);
        if (!Array.isArray(parsed)) return [];

        const normalized = parsed
          .map((entry) => {
            if (typeof entry === "string") {
              return { id: entry, visitedAt: Date.now() } satisfies RecentEntry;
            }

            if (
              entry &&
              typeof entry === "object" &&
              typeof entry.id === "string" &&
              typeof entry.visitedAt === "number"
            ) {
              return {
                id: entry.id,
                visitedAt: entry.visitedAt,
              } satisfies RecentEntry;
            }

            return null;
          })
          .filter((entry): entry is RecentEntry => Boolean(entry))
          .filter((entry) => validIds.has(entry.id));

        const dedupedMap = new Map<string, RecentEntry>();

        for (const entry of normalized) {
          const current = dedupedMap.get(entry.id);
          if (!current || entry.visitedAt > current.visitedAt) {
            dedupedMap.set(entry.id, entry);
          }
        }

        return Array.from(dedupedMap.values())
          .sort((a, b) => b.visitedAt - a.visitedAt)
          .slice(0, MAX_RECENT);
      } catch {
        return [];
      }
    };

    const readSearchHistory = () => {
      const parsed = safeParseJson<SearchHistoryEntry[]>(
        localStorage.getItem(SEARCH_HISTORY_STORAGE_KEY),
        [],
      );

      if (!Array.isArray(parsed)) return [];

      return parsed
        .filter(
          (entry) =>
            entry &&
            typeof entry === "object" &&
            typeof entry.query === "string" &&
            typeof entry.usedAt === "number",
        )
        .sort((a, b) => b.usedAt - a.usedAt)
        .slice(0, MAX_SEARCH_HISTORY);
    };

    const analytics = safeParseJson<{
      opens: number;
      searches: number;
      clicks: number;
    }>(localStorage.getItem(ANALYTICS_STORAGE_KEY), {
      opens: 0,
      searches: 0,
      clicks: 0,
    });

    setPinnedIds(readPinned());
    setRecentEntries(readRecent());
    setSearchHistory(readSearchHistory());
    setAnalyticsSnapshot(analytics);
    setStorageHydrated(true);
  }, [QUICK_ACCESS_ITEMS]);

  useEffect(() => {
    if (!storageHydrated) return;
    localStorage.setItem(PINNED_STORAGE_KEY, JSON.stringify(pinnedIds));
  }, [pinnedIds, storageHydrated]);

  useEffect(() => {
    if (!storageHydrated) return;
    localStorage.setItem(RECENT_STORAGE_KEY, JSON.stringify(recentEntries));
  }, [recentEntries, storageHydrated]);

  useEffect(() => {
    if (!storageHydrated) return;
    localStorage.setItem(SEARCH_HISTORY_STORAGE_KEY, JSON.stringify(searchHistory));
  }, [searchHistory, storageHydrated]);

  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => {
      setToast((prev) => (prev?.id === toast.id ? null : prev));
    }, 2200);

    return () => window.clearTimeout(t);
  }, [toast]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const isShortcut = (event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k";

      if (isShortcut) {
        event.preventDefault();
        setIsOpen(true);
      }

      if (event.key === "Escape") {
        setIsOpen(false);
        setContextMenu(null);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    trackAnalytics("open", { pathname });
    openStartedAtRef.current = performance.now();

    const t = setTimeout(() => {
      searchInputRef.current?.focus();
    }, 50);

    return () => clearTimeout(t);
  }, [isOpen, pathname]);

  useEffect(() => {
    if (isOpen) return;

    if (openStartedAtRef.current != null) {
      const dwell = performance.now() - openStartedAtRef.current;
      trackAnalytics("dwell", Math.round(dwell));
      openStartedAtRef.current = null;
    }
  }, [isOpen]);

  useEffect(() => {
    const closeContextMenu = () => setContextMenu(null);

    window.addEventListener("click", closeContextMenu);
    window.addEventListener("scroll", closeContextMenu);
    window.addEventListener("resize", closeContextMenu);

    return () => {
      window.removeEventListener("click", closeContextMenu);
      window.removeEventListener("scroll", closeContextMenu);
      window.removeEventListener("resize", closeContextMenu);
    };
  }, []);

  const itemMap = useMemo(() => {
    return new Map(QUICK_ACCESS_ITEMS.map((item) => [item.id, item]));
  }, [QUICK_ACCESS_ITEMS]);

  const recentMap = useMemo(() => {
    return new Map(recentEntries.map((entry) => [entry.id, entry.visitedAt]));
  }, [recentEntries]);

  const activeMenu = useMemo(() => {
    return findActiveMenuItem(visibleSections, pathname || "", basePath);
  }, [visibleSections, pathname, basePath]);

  const activeItem = useMemo(() => {
    if (!activeMenu) return null;
    return itemMap.get(activeMenu.item.id) ?? null;
  }, [activeMenu, itemMap]);

  const ActiveIcon = activeItem?.icon;

  useEffect(() => {
    if (!storageHydrated) return;
    if (!shouldTrackRecent(activeItem, basePath)) return;

    setRecentEntries((prev) => {
      if (prev[0]?.id === activeItem!.id) return prev;

      const next: RecentEntry[] = [
        { id: activeItem!.id, visitedAt: Date.now() },
        ...prev.filter((entry) => entry.id !== activeItem!.id),
      ];

      return next.slice(0, MAX_RECENT);
    });
  }, [activeItem?.id, storageHydrated, basePath]);

  const pinnedItems = useMemo(() => {
    return pinnedIds
      .map((id) => itemMap.get(id))
      .filter((item): item is QuickAccessItem => Boolean(item));
  }, [pinnedIds, itemMap]);

  const recentItems = useMemo(() => {
    return recentEntries
      .filter((entry) => entry.id !== activeItem?.id)
      .map((entry) => itemMap.get(entry.id))
      .filter((item): item is QuickAccessItem => Boolean(item))
      .filter((item) => !pinnedIds.includes(item.id));
  }, [recentEntries, pinnedIds, itemMap, activeItem]);

  const searchScope = useMemo(() => parseSearchScope(search), [search]);

  const fuse = useMemo(() => {
    return new Fuse(QUICK_ACCESS_ITEMS, {
      threshold: 0.32,
      ignoreLocation: true,
      minMatchCharLength: 2,
      keys: [
        { name: "title", weight: 3 },
        { name: "description", weight: 2 },
        { name: "href", weight: 1.5 },
        { name: "path", weight: 1.5 },
        { name: "sectionTitle", weight: 1.3 },
        { name: "groupTitle", weight: 1.2 },
        { name: "keywords", weight: 2.2 },
        { name: "breadcrumbs", weight: 1.6 },
        { name: "parentTitles", weight: 1.2 },
      ],
    });
  }, [QUICK_ACCESS_ITEMS]);

  const filteredItems = useMemo(() => {
    const q = search.trim();

    const scopedItems = QUICK_ACCESS_ITEMS.filter((item) =>
      itemMatchesScope(item, searchScope, pinnedIds, recentEntries),
    );

    if (!q) return scopedItems;

    const textQuery = searchScope.text.trim();
    if (!textQuery) return scopedItems;

    const fuseResults = fuse.search(textQuery).map((result) => result.item);
    const found = searchMenuItems(visibleSections, textQuery);
    const combinedMap = new Map<string, QuickAccessItem>();

    [...fuseResults, ...found.map(toQuickAccessItem)].forEach((item) => {
      if (scopedItems.some((scoped) => scoped.id === item.id)) {
        combinedMap.set(item.id, itemMap.get(item.id) ?? item);
      }
    });

    return Array.from(combinedMap.values());
  }, [
    search,
    QUICK_ACCESS_ITEMS,
    visibleSections,
    searchScope,
    pinnedIds,
    recentEntries,
    fuse,
    itemMap,
  ]);

  const filteredPinnedItems = useMemo(() => {
    const q = search.trim().toLowerCase();

    const scoped = pinnedItems.filter((item) =>
      itemMatchesScope(item, searchScope, pinnedIds, recentEntries),
    );

    if (!q) return scoped;

    return scoped.filter((item) => {
      const searchableText = [
        item.title,
        item.description,
        item.href,
        item.path,
        item.sectionTitle,
        item.groupTitle,
        ...item.parentTitles,
        ...(item.keywords ?? []),
        ...(item.breadcrumbs ?? []),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchableText.includes(searchScope.text.toLowerCase()) || searchableText.includes(q);
    });
  }, [search, pinnedItems, searchScope, pinnedIds, recentEntries]);

  const filteredRecentItems = useMemo(() => {
    const q = search.trim().toLowerCase();

    const scoped = recentItems.filter((item) =>
      itemMatchesScope(item, searchScope, pinnedIds, recentEntries),
    );

    if (!q) return scoped;

    return scoped.filter((item) => {
      const searchableText = [
        item.title,
        item.description,
        item.href,
        item.path,
        item.sectionTitle,
        item.groupTitle,
        ...item.parentTitles,
        ...(item.keywords ?? []),
        ...(item.breadcrumbs ?? []),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchableText.includes(searchScope.text.toLowerCase()) || searchableText.includes(q);
    });
  }, [search, recentItems, searchScope, pinnedIds, recentEntries]);

  const allItemsWithoutPinned = useMemo(() => {
    return filteredItems.filter((item) => !pinnedIds.includes(item.id));
  }, [filteredItems, pinnedIds]);

  const keyboardItems = useMemo<KeyboardItem[]>(() => {
    return [
      ...filteredPinnedItems.map((item) => ({ kind: "pinned", item }) as const),
      ...filteredRecentItems.map((item) => ({ kind: "recent", item }) as const),
      ...allItemsWithoutPinned.map((item) => ({ kind: "all", item }) as const),
    ];
  }, [filteredPinnedItems, filteredRecentItems, allItemsWithoutPinned]);

  const firstSearchResult = useMemo(() => {
    if (filteredPinnedItems.length > 0) return filteredPinnedItems[0];
    if (filteredRecentItems.length > 0) return filteredRecentItems[0];
    if (allItemsWithoutPinned.length > 0) return allItemsWithoutPinned[0];
    return null;
  }, [filteredPinnedItems, filteredRecentItems, allItemsWithoutPinned]);

  useEffect(() => {
    if (!isOpen) return;
    setSelectedIndex(0);
  }, [search, isOpen]);

  useEffect(() => {
    const selectedNode = resultRefs.current[selectedIndex];
    if (selectedNode) {
      selectedNode.scrollIntoView({
        block: "nearest",
        behavior: reducedMotion ? "auto" : "smooth",
      });
    }
  }, [selectedIndex, reducedMotion]);

  useEffect(() => {
    if (!storageHydrated) return;

    const normalized = normalizeSearchQuery(search);
    if (!normalized || normalized.length < 2) return;

    const t = window.setTimeout(() => {
      trackAnalytics("search", normalized);

      setSearchHistory((prev) => {
        const next: SearchHistoryEntry[] = [
          { query: normalized, usedAt: Date.now() },
          ...prev.filter((entry) => entry.query !== normalized),
        ];
        return next.slice(0, MAX_SEARCH_HISTORY);
      });
    }, 350);

    return () => window.clearTimeout(t);
  }, [search, storageHydrated]);

  const handleTogglePin = (itemId: string) => {
    setPinnedIds((prev) => {
      const exists = prev.includes(itemId);

      if (exists) {
        showToast("از پین‌شده‌ها حذف شد");
        return prev.filter((id) => id !== itemId);
      }

      showToast("به پین‌شده‌ها اضافه شد");
      return [...prev, itemId];
    });
  };

  const handleItemOpen = (
    item: QuickAccessItem,
    shouldNavigate = false,
    keepOpen = false,
  ) => {
    if (shouldTrackRecent(item, basePath)) {
      setRecentEntries((prev) => {
        const next: RecentEntry[] = [
          { id: item.id, visitedAt: Date.now() },
          ...prev.filter((entry) => entry.id !== item.id),
        ];
        return next.slice(0, MAX_RECENT);
      });
    }

    trackAnalytics("click", { type: "open", id: item.id, href: item.href });

    if (!keepOpen) {
      setIsOpen(false);
      setContextMenu(null);
    }

    if (shouldNavigate) {
      if (isExternalPath(item.href)) {
        if (!EXTERNAL_LINKS_ENABLED) {
          showToast("باز کردن لینک خارجی غیرفعال است");
          return;
        }
        window.open(item.href, "_blank", "noopener,noreferrer");
      } else {
        router.push(item.href);
      }
    }
  };

  const handleOpenInNewTab = (item: QuickAccessItem) => {
    window.open(item.href, "_blank", "noopener,noreferrer");
    trackAnalytics("click", { type: "new-tab", id: item.id });
    handleItemOpen(item, false, true);
  };

  const handleCopyLink = async (item: QuickAccessItem) => {
    try {
      await copyToClipboard(item.href);
      showToast("لینک کپی شد");
    } catch {
      showToast("کپی لینک ناموفق بود");
    }
  };

  const handleClearRecentItem = (itemId: string) => {
    setRecentEntries((prev) => prev.filter((entry) => entry.id !== itemId));
    showToast("از اخیرها حذف شد");
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setPinnedIds((prev) => {
      const oldIndex = prev.indexOf(String(active.id));
      const newIndex = prev.indexOf(String(over.id));
      if (oldIndex === -1 || newIndex === -1) return prev;
      return arrayMove(prev, oldIndex, newIndex);
    });

    showToast("ترتیب پین‌شده‌ها تغییر کرد");
  };

  const handleContextMenu = (event: React.MouseEvent, item: QuickAccessItem) => {
    event.preventDefault();
    const pos = getSmartContextMenuPosition(event.clientX, event.clientY);
    setContextMenu({ x: pos.x, y: pos.y, item });
  };

  const scrollPinned = (direction: "left" | "right") => {
    const el = headerPinnedRef.current;
    if (!el) return;

    const amount = direction === "left" ? -220 : 220;

    el.scrollBy({
      left: amount,
      behavior: reducedMotion ? "auto" : "smooth",
    });
  };

  const clearRecent = () => {
    setRecentEntries([]);
    showToast("لیست اخیرها پاک شد");
  };

  const resetPinnedOrder = () => {
    const alphabetical = [...pinnedItems]
      .sort((a, b) => a.title.localeCompare(b.title, "fa"))
      .map((item) => item.id);

    setPinnedIds(alphabetical);
    showToast("ترتیب پین‌شده‌ها بازنشانی شد");
  };

  const exportPinned = async () => {
    const payload = {
      schemaVersion: STORAGE_SCHEMA_VERSION,
      tenantId: TENANT_ID,
      userId: USER_ID,
      exportedAt: Date.now(),
      pinnedIds,
    };

    try {
      await copyToClipboard(JSON.stringify(payload, null, 2));
      showToast("خروجی پین‌شده‌ها کپی شد");
    } catch {
      showToast("خروجی گرفتن ناموفق بود");
    }
  };

  const importPinned = (text: string) => {
    try {
      const parsed = JSON.parse(text) as { pinnedIds?: string[] };

      if (!parsed || !Array.isArray(parsed.pinnedIds)) {
        showToast("فرمت ورودی نامعتبر است");
        return;
      }

      const validIds = new Set(QUICK_ACCESS_ITEMS.map((item) => item.id));
      const next = parsed.pinnedIds.filter(
        (id) => typeof id === "string" && validIds.has(id),
      );

      setPinnedIds(Array.from(new Set(next)));
      showToast("پین‌شده‌ها با موفقیت وارد شدند");
    } catch {
      showToast("خواندن فایل ورودی ناموفق بود");
    }
  };

  const recentGrouped = useMemo(() => {
    return groupRecentEntriesByTime(filteredRecentItems, recentMap);
  }, [filteredRecentItems, recentMap]);

  let keyboardCursor = -1;

  const bindKeyboardRef = (itemId: string) => {
    // eslint-disable-next-line react-hooks/immutability
    keyboardCursor += 1;
    const currentIndex = keyboardCursor;

    return {
      ref: (node: HTMLDivElement | null) => {
        resultRefs.current[currentIndex] = node;
      },
      selected: keyboardItems[selectedIndex]?.item.id === itemId,
    };
  };

  return (
    <>
      <div className="sr-only" aria-live="polite" aria-atomic="true" ref={liveRegionRef} />

      {toast && (
        <div className="fixed bottom-4 left-1/2 z-[1200] -translate-x-1/2 rounded-xl bg-slate-900 px-4 py-2 text-sm text-white shadow-2xl">
          {toast.message}
        </div>
      )}

      <input
        ref={fileImportRef}
        type="file"
        accept="application/json"
        className="hidden"
        onChange={async (event) => {
          const file = event.target.files?.[0];
          if (!file) return;

          try {
            const text = await file.text();
            importPinned(text);
          } catch {
            showToast("خواندن فایل ممکن نشد");
          } finally {
            event.currentTarget.value = "";
          }
        }}
      />

      <div className="w-full min-w-0" dir="rtl">
        <div className="flex h-11 min-w-0 items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50/80 px-2">
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="inline-flex shrink-0 cursor-pointer items-center gap-2 rounded-xl bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm ring-1 ring-slate-200 transition hover:bg-slate-50 hover:text-slate-900"
            aria-label="باز کردن دسترسی سریع"
          >
            <LayoutGrid size={17} className="text-slate-500" />
            <span className="hidden sm:inline">دسترسی سریع</span>
            <span className="sm:hidden">سریع</span>
          </button>

          {activeItem && (
            <button
              type="button"
              onClick={() => setIsOpen(true)}
              className="hidden min-w-0 max-w-[260px] shrink-0 cursor-pointer items-center gap-1 rounded-xl border border-blue-100 bg-blue-50 px-3 py-2 text-xs font-medium text-blue-700 transition hover:bg-blue-100 md:inline-flex"
              title={activeItem.href}
            >
              <span className="shrink-0">فعال:</span>
              <span className="min-w-0 truncate">
                {activeMenu?.sectionTitle ? `${activeMenu.sectionTitle} / ` : ""}
                {activeItem.title}
              </span>
            </button>
          )}

          <button
            type="button"
            onClick={() => scrollPinned("right")}
            className="hidden size-8 shrink-0 cursor-pointer items-center justify-center rounded-lg text-slate-500 transition hover:bg-white hover:text-slate-900 sm:inline-flex"
          >
            <ArrowRight size={17} />
          </button>

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={pinnedIds} strategy={horizontalListSortingStrategy}>
              <div
                ref={headerPinnedRef}
                className="flex min-w-0 flex-1 items-center gap-2 overflow-x-auto scroll-smooth py-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                role="list"
                aria-label="آیتم‌های پین‌شده"
              >
                {pinnedItems.length > 0 ? (
                  pinnedItems.map((item) => (
                    <SortablePinnedItem
                      key={item.id}
                      item={item}
                      active={activeItem?.id === item.id}
                      onOpen={(clickedItem) => handleItemOpen(clickedItem, true)}
                      onContextMenu={handleContextMenu}
                    />
                  ))
                ) : (
                  <button
                    type="button"
                    onClick={() => setIsOpen(true)}
                    className="min-w-0 cursor-pointer truncate rounded-lg px-3 py-1.5 text-sm text-slate-500 transition hover:bg-white hover:text-slate-800"
                  >
                    هنوز آیتمی پین نشده است
                  </button>
                )}
              </div>
            </SortableContext>
          </DndContext>

          <button
            type="button"
            onClick={() => scrollPinned("left")}
            className="hidden size-8 shrink-0 cursor-pointer items-center justify-center rounded-lg text-slate-500 transition hover:bg-white hover:text-slate-900 sm:inline-flex"
          >
            <ArrowLeft size={17} />
          </button>

          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="inline-flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-xl bg-white text-slate-600 shadow-sm ring-1 ring-slate-200 transition hover:bg-slate-50 hover:text-slate-900"
            aria-label="باز کردن مودال دسترسی سریع"
          >
            <LayoutGrid size={18} />
          </button>
        </div>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 z-[1000] flex items-start justify-center overflow-y-auto bg-slate-900/30 px-3 py-4 sm:px-6 sm:py-10"
          dir="rtl"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setIsOpen(false);
            }
          }}
        >
          <FocusTrap
            active={isOpen}
            focusTrapOptions={{
              clickOutsideDeactivates: true,
              initialFocus: false,
              escapeDeactivates: false,
            }}
          >
            <div
              className="flex max-h-[calc(100vh-2rem)] w-full max-w-5xl flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl sm:max-h-[calc(100vh-5rem)]"
              role="dialog"
              aria-modal="true"
              aria-label="دسترسی سریع"
              onKeyDown={(event) => {
                if (contextMenu && event.key === "Escape") {
                  event.preventDefault();
                  setContextMenu(null);
                  return;
                }

                if (event.key === "ArrowDown") {
                  event.preventDefault();
                  setSelectedIndex((prev) =>
                    keyboardItems.length === 0 ? 0 : Math.min(prev + 1, keyboardItems.length - 1),
                  );
                }

                if (event.key === "ArrowUp") {
                  event.preventDefault();
                  setSelectedIndex((prev) =>
                    keyboardItems.length === 0 ? 0 : Math.max(prev - 1, 0),
                  );
                }

                if (event.key === "Home") {
                  event.preventDefault();
                  setSelectedIndex(0);
                }

                if (event.key === "End") {
                  event.preventDefault();
                  setSelectedIndex(Math.max(0, keyboardItems.length - 1));
                }

                if (event.key === "Enter") {
                  const selected = keyboardItems[selectedIndex]?.item ?? firstSearchResult;
                  if (!selected) return;

                  event.preventDefault();

                  if (event.shiftKey) {
                    handleTogglePin(selected.id);
                    return;
                  }

                  if (event.ctrlKey || event.metaKey) {
                    handleOpenInNewTab(selected);
                    return;
                  }

                  handleItemOpen(selected, true);
                }
              }}
            >
              <div className="shrink-0 border-b border-slate-200 p-4 sm:p-5">
                <div className="flex items-center gap-3">
                  <div className="inline-flex size-11 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
                    <LayoutGrid size={20} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <h2 className="text-base font-semibold text-slate-900 sm:text-lg">
                      دسترسی سریع
                    </h2>
                    <p className="text-xs text-slate-500 sm:text-sm">
                      جستجو، باز کردن صفحات اخیر و مدیریت میانبرهای پین‌شده
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="inline-flex size-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 hover:text-slate-900"
                    aria-label="بستن"
                  >
                    <X size={18} />
                  </button>
                </div>

                {activeItem && (
                  <div className="mt-4 rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3">
                    <div className="flex items-center gap-2">
                      {ActiveIcon && (
                        <div className="inline-flex size-8 shrink-0 items-center justify-center rounded-xl bg-white text-blue-700">
                          <ActiveIcon size={17} />
                        </div>
                      )}

                      <div className="min-w-0 flex-1">
                        <div className="flex min-w-0 items-center gap-2">
                          <span className="shrink-0 text-xs font-medium text-blue-600">
                            صفحه فعال:
                          </span>
                          <span className="min-w-0 truncate text-sm font-semibold text-blue-800">
                            {activeItem.title}
                          </span>
                        </div>

                        <div className="mt-1 flex flex-wrap items-center gap-1 text-xs text-blue-700/90">
                          {activeMenu?.breadcrumbs?.map((crumb, index) => (
                            <React.Fragment key={`${crumb}-${index}`}>
                              {index > 0 && <ChevronLeft size={13} className="shrink-0" />}
                              <span className="truncate">{crumb}</span>
                            </React.Fragment>
                          ))}
                        </div>

                        <div className="mt-1" dir="ltr">
                          <span className="truncate text-xs text-blue-600/80">
                            {activeItem.href}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="mt-4 flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <Search size={18} className="shrink-0 text-slate-400" />

                  <input
                    ref={searchInputRef}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="جستجو در منوها، صفحات و مسیرها... مثال: section:مالی pinned:true"
                    className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
                    aria-label="جستجو در دسترسی سریع"
                    aria-autocomplete="list"
                  />

                  <div
                    dir="ltr"
                    className="hidden rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs text-slate-500 sm:block"
                  >
                    Ctrl / Cmd + K
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                  <span className="rounded-full bg-slate-100 px-2 py-1">Enter: باز کردن</span>
                  <span className="rounded-full bg-slate-100 px-2 py-1">Ctrl/Cmd + Enter: تب جدید</span>
                  <span className="rounded-full bg-slate-100 px-2 py-1">Shift + Enter: پین/آن‌پین</span>
                  <span className="rounded-full bg-slate-100 px-2 py-1">↑ ↓: جابه‌جایی</span>
                </div>

                {searchHistory.length > 0 && !search.trim() && (
                  <div className="mt-4">
                    <div className="mb-2 flex items-center gap-2">
                      <History size={14} className="text-slate-500" />
                      <span className="text-xs font-medium text-slate-600">جستجوهای اخیر</span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {searchHistory.map((entry) => (
                        <button
                          key={`${entry.query}-${entry.usedAt}`}
                          type="button"
                          onClick={() => setSearch(entry.query)}
                          className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
                        >
                          {entry.query}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={resetPinnedOrder}
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
                  >
                    <RotateCcw size={14} />
                    بازنشانی ترتیب پین‌ها
                  </button>

                  <button
                    type="button"
                    onClick={exportPinned}
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
                  >
                    <Download size={14} />
                    خروجی پین‌ها
                  </button>

                  <button
                    type="button"
                    onClick={() => fileImportRef.current?.click()}
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
                  >
                    <Upload size={14} />
                    ورود پین‌ها
                  </button>

                  <div className="inline-flex items-center gap-2 rounded-xl bg-slate-100 px-3 py-2 text-xs text-slate-600">
                    <Sparkles size={14} />
                    بازشدن‌ها: {analyticsSnapshot.opens} / جستجوها: {analyticsSnapshot.searches} / کلیک‌ها: {analyticsSnapshot.clicks}
                  </div>
                </div>
              </div>

              <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-5">
                {pinnedItems.length > 0 && (
                  <section className="mb-6">
                    <div className="mb-3 flex items-center gap-2">
                      <Pin size={16} className="text-slate-500" />
                      <h3 className="text-sm font-semibold text-slate-900">پین‌شده‌ها</h3>
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500">
                        {filteredPinnedItems.length}
                      </span>
                    </div>

                    {filteredPinnedItems.length > 0 ? (
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
                        {filteredPinnedItems.map((item) => {
                          const kb = bindKeyboardRef(item.id);
                          return (
                            <div key={item.id} ref={kb.ref}>
                              <AccessCard
                                item={item}
                                pinned
                                active={activeItem?.id === item.id}
                                visitedAt={recentMap.get(item.id) ?? null}
                                searchQuery={search}
                                keyboardSelected={kb.selected}
                                onTogglePin={handleTogglePin}
                                onOpen={(clickedItem) => handleItemOpen(clickedItem)}
                                onOpenInNewTab={handleOpenInNewTab}
                                onCopyLink={handleCopyLink}
                                onClearRecentItem={handleClearRecentItem}
                                onContextMenu={handleContextMenu}
                              />
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center">
                        <p className="text-sm text-slate-500">
                          موردی در پین‌شده‌ها مطابق جستجو پیدا نشد.
                        </p>
                      </div>
                    )}
                  </section>
                )}

                {recentItems.length > 0 && (
                  <section className="mb-6">
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <Clock3 size={16} className="text-slate-500" />
                        <h3 className="text-sm font-semibold text-slate-900">اخیر</h3>
                        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500">
                          {filteredRecentItems.length}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={clearRecent}
                        className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
                      >
                        <Trash2 size={14} />
                        پاک کردن اخیرها
                      </button>
                    </div>

                    {filteredRecentItems.length > 0 ? (
                      <>
                        <div className="mb-4 grid grid-cols-1 gap-3 md:grid-cols-3">
                          {recentGrouped.today.length > 0 && (
                            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-600">
                              امروز: {recentGrouped.today.length}
                            </div>
                          )}
                          {recentGrouped.thisWeek.length > 0 && (
                            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-600">
                              این هفته: {recentGrouped.thisWeek.length}
                            </div>
                          )}
                          {recentGrouped.older.length > 0 && (
                            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-600">
                              قدیمی‌تر: {recentGrouped.older.length}
                            </div>
                          )}
                        </div>

                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
                          {filteredRecentItems.map((item) => {
                            const kb = bindKeyboardRef(item.id);
                            return (
                              <div key={item.id} ref={kb.ref}>
                                <AccessCard
                                  item={item}
                                  pinned={pinnedIds.includes(item.id)}
                                  active={activeItem?.id === item.id}
                                  visitedAt={recentMap.get(item.id) ?? null}
                                  searchQuery={search}
                                  keyboardSelected={kb.selected}
                                  onTogglePin={handleTogglePin}
                                  onOpen={(clickedItem) => handleItemOpen(clickedItem)}
                                  onOpenInNewTab={handleOpenInNewTab}
                                  onCopyLink={handleCopyLink}
                                  onClearRecentItem={handleClearRecentItem}
                                  onContextMenu={handleContextMenu}
                                />
                              </div>
                            );
                          })}
                        </div>
                      </>
                    ) : (
                      <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center">
                        <p className="text-sm text-slate-500">
                          موردی در اخیر مطابق جستجو پیدا نشد.
                        </p>
                      </div>
                    )}
                  </section>
                )}

                <section>
                  <div className="mb-3 flex items-center gap-2">
                    <GripVertical size={16} className="text-slate-500" />
                    <h3 className="text-sm font-semibold text-slate-900">همه منوها</h3>
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500">
                      {allItemsWithoutPinned.length}
                    </span>
                  </div>

                  {allItemsWithoutPinned.length > 0 ? (
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
                      {allItemsWithoutPinned.map((item) => {
                        const kb = bindKeyboardRef(item.id);
                        return (
                          <div key={item.id} ref={kb.ref}>
                            <AccessCard
                              item={item}
                              pinned={pinnedIds.includes(item.id)}
                              active={activeItem?.id === item.id}
                              visitedAt={recentMap.get(item.id) ?? null}
                              searchQuery={search}
                              keyboardSelected={kb.selected}
                              onTogglePin={handleTogglePin}
                              onOpen={(clickedItem) => handleItemOpen(clickedItem)}
                              onOpenInNewTab={handleOpenInNewTab}
                              onCopyLink={handleCopyLink}
                              onClearRecentItem={handleClearRecentItem}
                              onContextMenu={handleContextMenu}
                            />
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center">
                      <p className="text-sm text-slate-500">
                        موردی مطابق جستجوی شما پیدا نشد.
                      </p>
                    </div>
                  )}
                </section>
              </div>
            </div>
          </FocusTrap>
        </div>
      )}

      {contextMenu && (
        <div className="fixed inset-0 z-[1100]" onMouseDown={() => setContextMenu(null)}>
          <div
            className="fixed min-w-[260px] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl"
            style={{ left: contextMenu.x, top: contextMenu.y }}
            dir="rtl"
            onMouseDown={(e) => e.stopPropagation()}
            role="menu"
          >
            <button
              type="button"
              onClick={() => {
                handleTogglePin(contextMenu.item.id);
                setContextMenu(null);
              }}
              className="flex w-full cursor-pointer items-center gap-2 px-3 py-2.5 text-right text-sm text-slate-700 transition hover:bg-slate-50 hover:text-slate-900"
              role="menuitem"
            >
              {pinnedIds.includes(contextMenu.item.id) ? <PinOff size={15} /> : <Pin size={15} />}
              {pinnedIds.includes(contextMenu.item.id)
                ? "حذف از پین‌شده‌ها"
                : "افزودن به پین‌شده‌ها"}
            </button>

            <button
              type="button"
              onClick={() => {
                handleOpenInNewTab(contextMenu.item);
                setContextMenu(null);
              }}
              className="flex w-full cursor-pointer items-center gap-2 px-3 py-2.5 text-right text-sm text-slate-700 transition hover:bg-slate-50 hover:text-slate-900"
              role="menuitem"
            >
              <ExternalLink size={15} />
              باز کردن در تب جدید
            </button>

            <button
              type="button"
              onClick={() => {
                handleCopyLink(contextMenu.item);
                setContextMenu(null);
              }}
              className="flex w-full cursor-pointer items-center gap-2 px-3 py-2.5 text-right text-sm text-slate-700 transition hover:bg-slate-50 hover:text-slate-900"
              role="menuitem"
            >
              <Copy size={15} />
              کپی لینک
            </button>

            {recentEntries.some((entry) => entry.id === contextMenu.item.id) && (
              <button
                type="button"
                onClick={() => {
                  handleClearRecentItem(contextMenu.item.id);
                  setContextMenu(null);
                }}
                className="flex w-full cursor-pointer items-center gap-2 px-3 py-2.5 text-right text-sm text-red-600 transition hover:bg-red-50"
                role="menuitem"
              >
                <Trash2 size={15} />
                حذف از اخیر
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
}
