"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function RoleGate({
  roles,
  required,
  children
}: {
  roles?: string[];
  required: string | string[];
  children: React.ReactNode;
}) {
  const router = useRouter();

  const requiredRoles = Array.isArray(required) ? required : [required];
  const hasAccess = Array.isArray(roles)
    ? requiredRoles.some((role) => roles.includes(role))
    : false;

  useEffect(() => {
    if (!hasAccess) {
      router.replace("/unauthorized");
    }
  }, [hasAccess, router]);

  if (!hasAccess) return null;

  return <>{children}</>;
}
