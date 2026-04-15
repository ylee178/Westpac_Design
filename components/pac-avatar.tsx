"use client";

/**
 * Pac — Westpac AI teammate.
 *
 * 16-bit pixel sprite rendered as an SVG grid of <rect> pixels
 * (shape-rendering: crispEdges). Brand-red body, simple white
 * square eye (no pupil — friendlier than a "watching you" dot).
 *
 * Static by default. The old idle bob was too noisy for small
 * chat avatars. Only the "speaking" state animates — it alternates
 * between two mouth frames every 200ms and is used inside the
 * typing indicator. "celebrate" still spins once for phase-complete
 * moments if ever needed.
 */
import { useEffect, useState } from "react";

const BRAND_RED = "#DA1710";
const EYE_WHITE = "#FFFFFF";

// 14x14 pixel grid — Pac-Man inspired round body with 2x2 square
// white eye (no pupil — friendlier than a "staring" dot). This is
// the original pixel shape, just with the eye simplified.
//   X = red body pixel
//   E = white eye pixel
//   . = transparent
const PAC_OPEN: readonly string[] = [
  "....XXXXXX....",
  "..XXXXXXXXXX..",
  ".XXXXXXXXXXXX.",
  "XXXXEEXXXXXX..",
  "XXXXEEXXXXX...",
  "XXXXXXXXXX....",
  "XXXXXXXX......",
  "XXXXXX........",
  "XXXXXX........",
  "XXXXXXXX......",
  "XXXXXXXXXX....",
  ".XXXXXXXXXXXX.",
  "..XXXXXXXXXX..",
  "....XXXXXX....",
];

const PAC_CLOSED: readonly string[] = [
  "....XXXXXX....",
  "..XXXXXXXXXX..",
  ".XXXXXXXXXXXX.",
  "XXXXEEXXXXXXX.",
  "XXXXEEXXXXXXX.",
  "XXXXXXXXXXXXX.",
  "XXXXXXXXXXXXX.",
  "XXXXXXXXXXXX..",
  "XXXXXXXXXXXXX.",
  "XXXXXXXXXXXXX.",
  "XXXXXXXXXXXX..",
  ".XXXXXXXXXXXX.",
  "..XXXXXXXXXX..",
  "....XXXXXX....",
];

function renderGrid(grid: readonly string[], keyPrefix: string) {
  const pixels: React.ReactElement[] = [];
  grid.forEach((row, y) => {
    for (let x = 0; x < row.length; x++) {
      const ch = row[x];
      if (ch === "X") {
        pixels.push(
          <rect
            key={`${keyPrefix}-${x}-${y}`}
            x={x}
            y={y}
            width={1}
            height={1}
            fill={BRAND_RED}
          />,
        );
      } else if (ch === "E") {
        pixels.push(
          <rect
            key={`${keyPrefix}-${x}-${y}`}
            x={x}
            y={y}
            width={1}
            height={1}
            fill={EYE_WHITE}
          />,
        );
      }
    }
  });
  return pixels;
}

export type PacState = "idle" | "speaking" | "celebrate";

interface Props {
  size?: number;
  state?: PacState;
  className?: string;
}

export function PacAvatar({ size = 40, state = "idle", className = "" }: Props) {
  const [frame, setFrame] = useState<"open" | "closed">("open");

  useEffect(() => {
    if (state !== "speaking") {
      setFrame("open");
      return;
    }
    const interval = setInterval(() => {
      setFrame((f) => (f === "open" ? "closed" : "open"));
    }, 200);
    return () => clearInterval(interval);
  }, [state]);

  const grid = frame === "open" ? PAC_OPEN : PAC_CLOSED;

  const animationClass =
    state === "celebrate" ? "pac-celebrate" : "";

  return (
    <span
      className={`pac-avatar ${animationClass} ${className}`}
      style={{
        display: "inline-block",
        width: size,
        height: size,
        lineHeight: 0,
      }}
    >
      <svg
        viewBox="0 0 14 14"
        width={size}
        height={size}
        shapeRendering="crispEdges"
        aria-hidden="true"
        style={{ display: "block" }}
      >
        {renderGrid(grid, frame)}
      </svg>
    </span>
  );
}
