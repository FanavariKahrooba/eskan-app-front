"use client";

import { useEffect } from "react";
import { DynamicPageShell } from "../page-shell/dynamic-page-shell";
import { useDynamicPageShell } from "../page-shell/use-dynamic-page-shell";
import { registerCoreShellModules } from "./register-core-shell-modules";
import type {
  PageShellHeaderAction,
  PageShellModuleConfig,
} from "../page-shell/page-shell-types";

interface UpgradedPageShellProps<TContext = any> {
  pageKey: string;
  title: string;
  description?: string;
  context?: TContext;

  userPermissions?: string[];
  defaultModules?: PageShellModuleConfig[];

  actions?: PageShellHeaderAction[];
  className?: string;
  contentClassName?: string;

  allowDrag?: boolean;
  allowResize?: boolean;
  allowHide?: boolean;
  allowReset?: boolean;

  loading?: boolean;
  emptyState?: React.ReactNode;

  loadLayout?: (pageKey: string) => Promise<PageShellModuleConfig[] | null>;
  saveLayout?: (
    pageKey: string,
    modules: PageShellModuleConfig[],
  ) => Promise<void> | void;
}

export function UpgradedPageShell<TContext = any>({
  pageKey,
  title,
  description,
  context,
  userPermissions = [],
  defaultModules,
  actions = [],
  className,
  contentClassName,
  allowDrag = true,
  allowResize = true,
  allowHide = true,
  allowReset = true,
  loading: externalLoading = false,
  emptyState,
  loadLayout,
  saveLayout,
}: UpgradedPageShellProps<TContext>) {
  useEffect(() => {
    registerCoreShellModules();
  }, []);

  const {
    filteredModules,
    defaultModules: filteredDefaultModules,
    loading,
    setModules,
  } = useDynamicPageShell({
    pageKey,
    userPermissions,
    defaultModules,
    loadLayout,
    saveLayout,
  });

  return (
    <DynamicPageShell
      pageKey={pageKey}
      title={title}
      description={description}
      modules={filteredModules}
      defaultModules={filteredDefaultModules}
      onModulesChange={setModules}
      context={context}
      actions={actions}
      className={className}
      contentClassName={contentClassName}
      allowDrag={allowDrag}
      allowResize={allowResize}
      allowHide={allowHide}
      allowReset={allowReset}
      emptyState={emptyState}
      loading={loading || externalLoading}
    />
  );
}
