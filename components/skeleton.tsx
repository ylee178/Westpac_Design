"use client";

/**
 * Reusable skeleton placeholder. Used for real loading states AND for
 * the grayscale "skeleton-first" dev mode (the CSS in globals.css
 * applies the same visual language to `.skeleton-detail` elements
 * when `data-grayscale="on"`).
 */

export type SkeletonVariant = "text" | "card" | "button" | "circle";
export type SkeletonAnimation = "pulse" | "wave" | "none";

interface Props {
  width?: number | string;
  height?: number | string;
  variant?: SkeletonVariant;
  animation?: SkeletonAnimation;
  className?: string;
  style?: React.CSSProperties;
}

const VARIANT_RADIUS: Record<SkeletonVariant, string> = {
  text: "4px",
  card: "8px",
  button: "6px",
  circle: "9999px",
};

function normalize(value: number | string | undefined, fallback: string): string {
  if (value === undefined) return fallback;
  if (typeof value === "number") return `${value}px`;
  return value;
}

export function Skeleton({
  width,
  height,
  variant = "text",
  animation = "pulse",
  className = "",
  style,
}: Props) {
  const defaultHeight = variant === "text" ? "1em" : variant === "button" ? "36px" : "40px";
  return (
    <span
      aria-hidden="true"
      className={`skeleton skeleton-${animation} ${className}`}
      style={{
        display: "inline-block",
        width: normalize(width, "100%"),
        height: normalize(height, defaultHeight),
        borderRadius: VARIANT_RADIUS[variant],
        backgroundColor: "var(--skeleton-bg)",
        verticalAlign: "middle",
        ...style,
      }}
    />
  );
}

/**
 * Convenience helper — two or three varying-width text bars stacked
 * to mimic a paragraph shape.
 */
export function SkeletonText({
  lines = 3,
  lastWidth = "45%",
  className = "",
}: {
  lines?: number;
  lastWidth?: string;
  className?: string;
}) {
  const widths = ["82%", "68%", "54%", "74%", "60%"];
  return (
    <span className={`flex flex-col gap-1.5 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          variant="text"
          width={i === lines - 1 ? lastWidth : widths[i % widths.length]}
          height="0.85em"
        />
      ))}
    </span>
  );
}
