"use client";

/**
 * Pac — Westpac AI teammate.
 *
 * 16x16 pixel creature: front-facing round body, two white square
 * eyes, small arms sticking out at the sides, two legs with feet.
 * Not Pac-Man — just a chunky pixel blob with brand-red fill.
 *
 * Animation states:
 *   - idle:      static grid
 *   - speaking:  blinks every 240ms (used briefly on new chat bubbles)
 *   - celebrate: one-shot 360° spin (kept for phase-complete moments)
 */
import { useEffect, useState } from "react";

const BRAND_RED = "#DA1710";
const EYE_WHITE = "#FFFFFF";

// 16x16 pixel grid.
//   X = red body pixel
//   E = white eye pixel (2x2 each, front-facing)
//   . = transparent
const PAC_OPEN: readonly string[] = [
  ".....XXXXXX.....",
  "...XXXXXXXXXX...",
  "..XXXXXXXXXXXX..",
  ".XXXEEXXXXEEXXX.",
  ".XXXEEXXXXEEXXX.",
  ".XXXXXXXXXXXXXX.",
  ".XXXXXXXXXXXXXX.",
  ".XXXXXXXXXXXXXX.",
  "XX.XXXXXXXXXX.XX",
  "XX.XXXXXXXXXX.XX",
  ".XXXXXXXXXXXXXX.",
  ".XXXXXXXXXXXXXX.",
  "..XXXXXXXXXXXX..",
  "..XXXX....XXXX..",
  "..XXXX....XXXX..",
  ".XXXXX....XXXXX.",
];

// Speaking frame — eyes blink (disappear for a beat) so the new
// bubble has a small "alive" signal without needing a mouth.
const PAC_BLINK: readonly string[] = [
  ".....XXXXXX.....",
  "...XXXXXXXXXX...",
  "..XXXXXXXXXXXX..",
  ".XXXXXXXXXXXXXX.",
  ".XXXXXXXXXXXXXX.",
  ".XXXXXXXXXXXXXX.",
  ".XXXXXXXXXXXXXX.",
  ".XXXXXXXXXXXXXX.",
  "XX.XXXXXXXXXX.XX",
  "XX.XXXXXXXXXX.XX",
  ".XXXXXXXXXXXXXX.",
  ".XXXXXXXXXXXXXX.",
  "..XXXXXXXXXXXX..",
  "..XXXX....XXXX..",
  "..XXXX....XXXX..",
  ".XXXXX....XXXXX.",
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
    // Eye blink cycle — mostly open, brief blink
    let openPhase = true;
    const tick = () => {
      openPhase = !openPhase;
      setFrame(openPhase ? "open" : "blink");
    };
    // Longer open phase than blink for natural feel
    const openMs = 700;
    const blinkMs = 140;
    let timer: ReturnType<typeof setTimeout>;
    const schedule = () => {
      timer = setTimeout(
        () => {
          tick();
          schedule();
        },
        openPhase ? openMs : blinkMs,
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
