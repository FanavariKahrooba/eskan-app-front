import type { ReactNode } from "react";

export type DataGridIconName =
  | "search"
  | "refresh"
  | "reset"
  | "download"
  | "settings"
  | "columns"
  | "filter"
  | "sortAsc"
  | "sortDesc"
  | "chevronDown"
  | "chevronRight"
  | "more"
  | "pin"
  | "eye"
  | "eyeOff"
  | "loading"
  | "empty"
  | "error"
  | "check"
  | "x";

export interface DataGridIconProps {
  name: DataGridIconName;
  size?: number;
  className?: string;
}

const icons: Record<DataGridIconName, ReactNode> = {
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.3-4.3" />
    </>
  ),
  refresh: (
    <>
      <path d="M21 12a9 9 0 0 1-15.4 6.4L3 16" />
      <path d="M3 16v5h5" />
      <path d="M3 12A9 9 0 0 1 18.4 5.6L21 8" />
      <path d="M21 8V3h-5" />
    </>
  ),
  reset: (
    <>
      <path d="M3 12a9 9 0 1 0 3-6.7" />
      <path d="M3 3v6h6" />
    </>
  ),
  download: (
    <>
      <path d="M12 3v12" />
      <path d="m7 10 5 5 5-5" />
      <path d="M5 21h14" />
    </>
  ),
  settings: (
    <>
      <path d="M12 15.5A3.5 3.5 0 1 0 12 8a3.5 3.5 0 0 0 0 7.5Z" />
      <path d="M19.4 15a1.8 1.8 0 0 0 .36 2l.06.06a2.2 2.2 0 1 1-3.11 3.11l-.06-.06a1.8 1.8 0 0 0-2-.36 1.8 1.8 0 0 0-1.1 1.66V21a2.2 2.2 0 1 1-4.4 0v-.09A1.8 1.8 0 0 0 8 19.25a1.8 1.8 0 0 0-2 .36l-.06.06a2.2 2.2 0 1 1-3.11-3.11l.06-.06a1.8 1.8 0 0 0 .36-2 1.8 1.8 0 0 0-1.66-1.1H1.5a2.2 2.2 0 1 1 0-4.4h.09A1.8 1.8 0 0 0 3.25 8a1.8 1.8 0 0 0-.36-2l-.06-.06a2.2 2.2 0 1 1 3.11-3.11l.06.06a1.8 1.8 0 0 0 2 .36h.1A1.8 1.8 0 0 0 9.2 1.6V1.5a2.2 2.2 0 1 1 4.4 0v.09A1.8 1.8 0 0 0 14.75 3a1.8 1.8 0 0 0 2-.36l.06-.06a2.2 2.2 0 1 1 3.11 3.11l-.06.06a1.8 1.8 0 0 0-.36 2v.1a1.8 1.8 0 0 0 1.66 1.1h.09a2.2 2.2 0 1 1 0 4.4h-.09A1.8 1.8 0 0 0 19.4 15Z" />
    </>
  ),
  columns: (
    <>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M9 4v16" />
      <path d="M15 4v16" />
    </>
  ),
  filter: (
    <>
      <path d="M3 5h18" />
      <path d="M6 12h12" />
      <path d="M10 19h4" />
    </>
  ),
  sortAsc: (
    <>
      <path d="M7 17V5" />
      <path d="m3 9 4-4 4 4" />
      <path d="M14 7h7" />
      <path d="M14 12h5" />
      <path d="M14 17h3" />
    </>
  ),
  sortDesc: (
    <>
      <path d="M7 7v12" />
      <path d="m3 15 4 4 4-4" />
      <path d="M14 7h3" />
      <path d="M14 12h5" />
      <path d="M14 17h7" />
    </>
  ),
  chevronDown: <path d="m6 9 6 6 6-6" />,
  chevronRight: <path d="m9 6 6 6-6 6" />,
  more: (
    <>
      <circle cx="5" cy="12" r="1.5" />
      <circle cx="12" cy="12" r="1.5" />
      <circle cx="19" cy="12" r="1.5" />
    </>
  ),
  pin: (
    <>
      <path d="M12 17v5" />
      <path d="M8 3h8l-1 7 3 3v2H6v-2l3-3-1-7Z" />
    </>
  ),
  eye: (
    <>
      <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  eyeOff: (
    <>
      <path d="m3 3 18 18" />
      <path d="M10.6 10.6A3 3 0 0 0 13.4 13.4" />
      <path d="M9.9 4.3A10.6 10.6 0 0 1 12 4c6 0 10 8 10 8a18.7 18.7 0 0 1-3.2 4.2" />
      <path d="M6.2 6.2C3.5 8 2 12 2 12s4 8 10 8a10.7 10.7 0 0 0 5.8-1.8" />
    </>
  ),
  loading: (
    <>
      <path d="M21 12a9 9 0 1 1-6.2-8.6" />
    </>
  ),
  empty: (
    <>
      <path d="M4 7h16v12H4z" />
      <path d="m4 7 3-4h10l3 4" />
      <path d="M9 13h6" />
    </>
  ),
  error: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v6" />
      <path d="M12 17h.01" />
    </>
  ),
  check: <path d="m20 6-11 11-5-5" />,
  x: (
    <>
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </>
  ),
};

export function DataGridIcon({
  name,
  size = 18,
  className,
}: DataGridIconProps) {
  return (
    <svg
      width={size}
      height={size}
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {icons[name]}
    </svg>
  );
}
