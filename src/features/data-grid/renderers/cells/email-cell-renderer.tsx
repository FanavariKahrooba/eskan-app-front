import type { CSSProperties, ReactNode } from "react";

export interface EmailCellRendererProps {
  value: unknown;
  className?: string;
  style?: CSSProperties;
  emptyValue?: ReactNode;
  label?: ReactNode;
  subject?: string;
  body?: string;
  validate?: boolean;
  invalidValue?: ReactNode;
}

function normalizeEmail(value: unknown): string {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim();
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function buildMailto(email: string, subject?: string, body?: string): string {
  const params = new URLSearchParams();

  if (subject) {
    params.set("subject", subject);
  }

  if (body) {
    params.set("body", body);
  }

  const query = params.toString();

  return query ? `mailto:${email}?${query}` : `mailto:${email}`;
}

export function EmailCellRenderer({
  value,
  className,
  style,
  emptyValue = "—",
  label,
  subject,
  body,
  validate = true,
  invalidValue = "Invalid email",
}: EmailCellRendererProps) {
  const email = normalizeEmail(value);

  if (!email) {
    return (
      <span className={className} style={style}>
        {emptyValue}
      </span>
    );
  }

  if (validate && !isValidEmail(email)) {
    return (
      <span className={className} style={style} title={email}>
        {invalidValue}
      </span>
    );
  }

  return (
    <a
      className={className}
      style={{
        color: "#2563eb",
        textDecoration: "none",
        ...style,
      }}
      href={buildMailto(email, subject, body)}
      title={email}
    >
      {label ?? email}
    </a>
  );
}

export default EmailCellRenderer;
