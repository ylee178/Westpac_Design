"use client";

/**
 * Pac — Westpac AI teammate character.
 *
 * 16-bit pixel sprite rendered as an SVG grid of <rect> pixels.
 * Inspired by both Pac-Man (round body, mouth wedge) and the
 * Claude mascot (small, friendly, approachable). Brand-red
 * (#DA1710) is the constant — Pac never re-tints with theme.
 *
 * Three animation states:
 *   - idle:      subtle translateY bobbing
 *   - speaking:  mouth open ↔ closed every 200ms (typing indicator)
 *   - celebrate: one-shot 360° spin
 */
import { useEffect, useState } from "react";

const BRAND_RED = "#DA1710";
const EYE_WHITE = "#ffffff";
const EYE_PUPIL = "#1a1a1a";

// 14×14 pixel grid. Glyphs:
//   X = red body pixel
//   E = eye white pixel
//   P = eye pupil pixel
//   . = transparent
const PAC_OPEN: readonly string[] = [
  "....XXXXXX....",
  "..XXXXXXXXXX..",
  ".XXXXXXXXXXXX.",
  "XXXXEEXXXXXX..",
  "XXXXEPXXXXX...",
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
  "XXXXEPXXXXXXX.",
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
      } else if (ch === "P") {
        pixels.push(
          <rect
            key={`${keyPrefix}-${x}-${y}`}
            x={x}
            y={y}
            width={1}
            height={1}
            fill={EYE_PUPIL}
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
  // Simple frame toggler for the speaking animation — alternates
  // open/closed mouth every 200ms without relying on complex CSS keyframes.
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
    state === "idle"
      ? "pac-idle"
      : state === "celebrate"
        ? "pac-celebrate"
        : "";

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
