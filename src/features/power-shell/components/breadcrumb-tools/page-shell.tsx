"use client";

import { ReactNode, Suspense } from "react";
import PageHeader from "./page-header";
import PageShellMotion from "./page-shell-motion";
import PageErrorBoundary from "./page-error-boundary";
import PageSkeleton from "./page-skeleton";
import CommandPaletteShell, {
  CommandPaletteAction,
} from "./command-palette-shell";

export interface PageShellBreadcrumbItem {
  label: string;
  href?: string;
}

export interface PageShellAction {
  id: string;
  label: string;
  icon?: ReactNode;
  href?: string;
  onClick?: () => void;
  disabled?: boolean;
  variant?: "primary" | "secondary" | "danger" | "ghost";
  permission?: string;
}

interface PageShellProps {
  children: ReactNode;

  title: string;
  description?: string;

  breadcrumbs?: PageShellBreadcrumbItem[];

  currentPath?: string;

  actions?: PageShellAction[];

  commandActions?: CommandPaletteAction[];

  enablePalette?: boolean;

  loading?: boolean;

  favoriteKey?: string;

  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "full";

  padded?: boolean;

  stickyHeader?: boolean;

  userPermissions?: string[];

  headerMeta?: ReactNode;

  headerRightSlot?: ReactNode;

  fallback?: ReactNode;
  featureFlags?: string[];
}

const maxWidthMap: Record<NonNullable<PageShellProps["maxWidth"]>, string> = {
  sm: "max-w-3xl",
  md: "max-w-5xl",
  lg: "max-w-6xl",
  xl: "max-w-7xl",
  "2xl": "max-w-[1536px]",
  full: "max-w-full",
};

function filterActionsByPermission(
  actions: PageShellAction[],
  userPermissions?: string[],
) {
  if (!userPermissions) return actions;

  return actions.filter((action) => {
    if (!action.permission) return true;
    return userPermissions.includes(action.permission);
  });
}

export default function PageShell({
  children,
  title,
  description,
  breadcrumbs = [],
  currentPath,
  actions = [],
  commandActions = [],
  enablePalette = true,
  loading = false,
  favoriteKey,
  maxWidth = "xl",
  padded = true,
  stickyHeader = true,
  userPermissions,
  headerMeta,
  headerRightSlot,
  fallback,
  featureFlags,
}: PageShellProps) {
  const safeActions = filterActionsByPermission(actions, userPermissions);

  return (
    <>
      {enablePalette && <CommandPaletteShell actions={commandActions} />}

      <div className="min-h-screen bg-gray-50">
        <PageHeader
          title={title}
          description={description}
          breadcrumbs={breadcrumbs}
          currentPath={currentPath}
          actions={safeActions}
          favoriteKey={favoriteKey}
          sticky={stickyHeader}
          meta={headerMeta}
          rightSlot={headerRightSlot}
          maxWidthClass={maxWidthMap[maxWidth]}
        />

        <PageShellMotion maxWidth={maxWidthMap[maxWidth]} padded={padded}>
          <PageErrorBoundary fallback={fallback}>
            <Suspense fallback={<PageSkeleton />}>
              {loading ? <PageSkeleton /> : children}
            </Suspense>
          </PageErrorBoundary>
        </PageShellMotion>
      </div>
    </>
  );
}
