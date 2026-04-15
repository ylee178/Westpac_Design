/**
 * Westpac W-mark logo — the real PNG from Sean's design file.
 * Kept brand-red in all themes (brand is a constant, theme is a variable).
 * Uses next/image for automatic optimization.
 */
import Image from "next/image";

interface Props {
  size?: number;
  className?: string;
}

export function WestpacLogo({ size = 32, className = "" }: Props) {
  // Source aspect ratio is 3840 × 2160 = 16:9 (≈ 1.778).
  // Compute pixel-perfect dimensions at the requested logical height.
  const height = size;
  const width = Math.round(size * (3840 / 2160));

  return (
    <Image
      src="/westpac-logo.png"
      alt="Westpac"
      width={width}
      height={height}
      priority
      className={className}
      style={{
        height: `${height}px`,
        width: `${width}px`,
        objectFit: "contain",
      }}
    />
  );
}
