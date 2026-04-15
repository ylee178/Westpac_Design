"use client";

/**
 * D7 — Three-way task ownership badge (Banker / System / Customer).
 * Compact tag, Carbon-style — Blue 10 for Banker, Gray 10 for System,
 * Green 10 for Customer. Pill (24px radius is the one Carbon exception).
 */
import type { Owner } from "@/lib/types";
import { User, Cpu, Users } from "lucide-react";

const CONFIG: Record<
  Owner,
  { label: string; bg: string; fg: string; border: string; Icon: typeof User }
> = {
  banker: {
    label: "Banker",
    bg: "#edf5ff",
    fg: "#0043ce",
    border: "#a6c8ff",
    Icon: User,
  },
  system: {
    label: "System",
    bg: "#f4f4f4",
    fg: "#525252",
    border: "#c6c6c6",
    Icon: Cpu,
  },
  customer: {
    label: "Customer",
    bg: "#defbe6",
    fg: "#0e6027",
    border: "#a7f0ba",
    Icon: Users,
  },
};

export function OwnerBadge({ owner, size = "sm" }: { owner: Owner; size?: "sm" | "md" }) {
  const { label, bg, fg, border, Icon } = CONFIG[owner];
  const padding = size === "sm" ? "px-2 py-[2px]" : "px-2.5 py-1";
  const fontSize = size === "sm" ? "11px" : "12px";
  return (
    <span
      className={`inline-flex items-center gap-1 ${padding} rounded-full border font-medium tracking-[0.32px] whitespace-nowrap`}
      style={{ backgroundColor: bg, color: fg, borderColor: border, fontSize }}
    >
      <Icon size={size === "sm" ? 11 : 12} strokeWidth={2.2} />
      {label}
    </span>
  );
}
