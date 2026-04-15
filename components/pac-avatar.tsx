"use client";

/**
 * Pac — Westpac AI teammate.
 *
 * Inspired by the Westpac W-mark logo. Composed of two parts with
 * a one-pixel gap between them (matching the gaps between the three
 * W-bars below):
 *
 *   - A semicircle "face" on top, holding two square eyes.
 *   - The three W-bars fan out below as the body, tapering at the
 *     bottom like legs.
 *
 * The 1px gap row between face and body mirrors the 1px gutters
 * between the three W-bars for visual consistency.
 *
 * Animation states:
 *   - idle:      static grid
 *   - speaking:  eye blink (subtle "thinking" cue)
 *   - celebrate: one-shot 360° spin
 */
import { useEffect, useState } from "react";

const BRAND_RED = "#DA1710";
const EYE_WHITE = "#FFFFFF";

// 16x16 pixel grid — Westpac W-mark mascot.
//   X = red body pixel
//   E = white eye pixel
//   . = transparent
//
// Rows 0-4:  semicircle face (dome) with two square eyes
// Row 5:     1px gap (matches column gaps between W-bars)
// Rows 6-15: W-mark body fanning down into legs
const PAC_OPEN: readonly string[] = [
  "......XXXX......",
  "....XXXXXXXX....",
  "...XXXXXXXXXX...",
  "...XEEXXXXEEX...",
  "...XXXXXXXXXX...",
  "................",
  ".XXX.XXXXXX.XXX.",
  ".XXX.XXXXXX.XXX.",
  ".XXX.XXXXXX.XXX.",
  ".XXX.XXXXXX.XXX.",
  ".XXX.XXXXXX.XXX.",
  "..XX.XXXXXX.XX..",
  "..XX.XXXXXX.XX..",
  "...X.XXXXXX.X...",
  "...X.XXXXXX.X...",
  "................",
];

// Blink frame — eyes fill in with body colour.
const PAC_BLINK: readonly string[] = [
  "......XXXX......",
  "....XXXXXXXX....",
  "...XXXXXXXXXX...",
  "...XXXXXXXXXX...",
  "...XXXXXXXXXX...",
  "................",
  ".XXX.XXXXXX.XXX.",
  ".XXX.XXXXXX.XXX.",
  ".XXX.XXXXXX.XXX.",
  ".XXX.XXXXXX.XXX.",
  ".XXX.XXXXXX.XXX.",
  "..XX.XXXXXX.XX..",
  "..XX.XXXXXX.XX..",
  "...X.XXXXXX.X...",
  "...X.XXXXXX.X...",
  "................",
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
  const [frame, setFrame] = useState<"open" | "blink">("open");

  useEffect(() => {
    if (state !== "speaking") {
      setFrame("open");
      return;
    }
    let openPhase = true;
    let timer: ReturnType<typeof setTimeout>;
    const schedule = () => {
      timer = setTimeout(
        () => {
          openPhase = !openPhase;
          setFrame(openPhase ? "open" : "blink");
          schedule();
        },
        openPhase ? 700 : 140,
      );
    };
    schedule();
    return () => clearTimeout(timer);
  }, [state]);

  const grid = frame === "open" ? PAC_OPEN : PAC_BLINK;
  const animationClass = state === "celebrate" ? "pac-celebrate" : "";

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
        viewBox="0 0 16 16"
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
