"use client";

import { ReactNode } from "react";

interface PermissionGuardProps {
  permissions?: string[];
  required?: string | string[];
  mode?: "any" | "all";
  fallback?: ReactNode;
  children: ReactNode;
}

export default function PermissionGuard({
  permissions = [],
  required,
  mode = "all",
  fallback = null,
  children,
}: PermissionGuardProps) {
  if (!required) return <>{children}</>;

  const requiredList = Array.isArray(required) ? required : [required];

  const allowed =
    mode === "all"
      ? requiredList.every((item) => permissions.includes(item))
      : requiredList.some((item) => permissions.includes(item));

  if (!allowed) return <>{fallback}</>;

  return <>{children}</>;
}
