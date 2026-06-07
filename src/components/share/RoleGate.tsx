"use client";
/**
 * RoleGate Component
 *
 * A wrapper component to restrict access to certain parts of the UI
 * based on user roles.
 *
 * Props:
 * - roles?: string[]          // The current user's roles
 * - required: string | string[] // The required role(s) to access the content
 * - children: React.ReactNode   // The content to render if access is granted
 *
 * Behavior:
 * 1. Converts `required` to an array for consistent checks.
 * 2. Checks if the user has at least one of the required roles.
 * 3. If the user does not have access, redirects to "/unauthorized".
 * 4. If access is granted, renders the children components.
 */
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function RoleGate({
  roles,
  required,
  children,
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
      router.replace("/console/unauthorized");
    }
  }, [hasAccess, router]);

  if (!hasAccess) return null;

  return <>{children}</>;
}
