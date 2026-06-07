import type { CSSProperties, ReactNode } from "react";

export interface ImageCellRendererProps {
  value: unknown;
  className?: string;
  style?: CSSProperties;
  emptyValue?: ReactNode;
  alt?: string;
  width?: number | string;
  height?: number | string;
  rounded?: boolean;
  objectFit?: CSSProperties["objectFit"];
  fallbackSrc?: string;
  preview?: boolean;
  onClick?: (src: string) => void;
}

function normalizeSrc(value: unknown): string {
  if (typeof value === "string") {
    return value;
  }

  if (
    value &&
    typeof value === "object" &&
    "src" in value &&
    typeof (value as { src?: unknown }).src === "string"
  ) {
    return (value as { src: string }).src;
  }

  if (
    value &&
    typeof value === "object" &&
    "url" in value &&
    typeof (value as { url?: unknown }).url === "string"
  ) {
    return (value as { url: string }).url;
  }

  return "";
}

export function ImageCellRenderer({
  value,
  className,
  style,
  emptyValue = "—",
  alt = "",
  width = 40,
  height = 40,
  rounded = true,
  objectFit = "cover",
  fallbackSrc,
  preview = false,
  onClick,
}: ImageCellRendererProps) {
  const src = normalizeSrc(value);

  if (!src) {
    return (
      <span className={className} style={style}>
        {emptyValue}
      </span>
    );
  }

  return (
    <img
      className={className}
      src={src}
      alt={alt}
      width={typeof width === "number" ? width : undefined}
      height={typeof height === "number" ? height : undefined}
      style={{
        width,
        height,
        objectFit,
        borderRadius: rounded ? 8 : 0,
        cursor: preview || onClick ? "pointer" : undefined,
        display: "inline-block",
        ...style,
      }}
      onClick={() => {
        if (onClick) {
          onClick(src);
          return;
        }

        if (preview) {
          window.open(src, "_blank", "noopener,noreferrer");
        }
      }}
      onError={(event) => {
        if (fallbackSrc && event.currentTarget.src !== fallbackSrc) {
          event.currentTarget.src = fallbackSrc;
        }
      }}
      loading="lazy"
    />
  );
}

export default ImageCellRenderer;
