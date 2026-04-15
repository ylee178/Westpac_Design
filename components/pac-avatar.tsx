"use client";

/**
 * Pac — Westpac AI teammate.
 *
 * Smooth-SVG character (no longer pixel grid). Subtle friendliness
 * refinements: smaller warm-cream eye, dark-burgundy pupil (not
 * harsh black), rounded mouth (not sharp wedge), subtle highlight
 * for 3D depth. Brand-red body is the constant.
 *
 * Three animation states:
 *   - idle:      gentle bobbing (translateY)
 *   - speaking:  mouth toggles open ↔ closed every 200ms
 *   - celebrate: one-shot 360° spin
 */
import { useEffect, useState } from "react";

const BRAND_RED = "#DA1710";
const EYE_CREAM = "#FFF5F2";
const EYE_PUPIL = "#3A0A0A";
const MOUTH_CREAM = "#FFF5F2";

const MOUTH_OPEN_D = "M20,20 L38,14 Q39.5,20 38,26 Z";
const MOUTH_CLOSED_D = "M20,20 L38,19 Q39,20 38,21 Z";

export type PacState = "idle" | "speaking" | "celebrate";

interface Props {
  size?: number;
  state?: PacState;
  className?: string;
}

export function PacAvatar({ size = 40, state = "idle", className = "" }: Props) {
  const [mouthFrame, setMouthFrame] = useState<"open" | "closed">("open");

  useEffect(() => {
    if (state !== "speaking") {
      setMouthFrame("open");
      return;
    }
    const interval = setInterval(() => {
      setMouthFrame((f) => (f === "open" ? "closed" : "open"));
    }, 200);
    return () => clearInterval(interval);
  }, [state]);

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
        viewBox="0 0 40 40"
        width={size}
        height={size}
        aria-hidden="true"
        style={{ display: "block", overflow: "visible" }}
      >
        {/* Body — Westpac Red */}
        <circle cx="20" cy="20" r="18" fill={BRAND_RED} />

        {/* Subtle highlight for 3D depth */}
        <ellipse
          cx="14"
          cy="13"
          rx="4.5"
          ry="2.5"
          fill="white"
          opacity="0.18"
        />

        {/* Mouth — rounded wedge (warmer cream than pure white) */}
        <path
          d={mouthFrame === "open" ? MOUTH_OPEN_D : MOUTH_CLOSED_D}
          fill={MOUTH_CREAM}
          style={{ transition: "d 120ms ease-in-out" }}
        />

        {/* Eye — warm cream with small dark-burgundy pupil */}
        <circle cx="22" cy="11" r="2" fill={EYE_CREAM} />
        <circle cx="22.5" cy="10.6" r="0.8" fill={EYE_PUPIL} />
      </svg>
    </span>
  );
}
