"use client";

/**
 * D7 — Three-way task ownership label.
 * Financial-UI tone: text + small icon, no pill background.
 */
import type { Owner } from "@/lib/types";
import { User, Cpu, Users } from "lucide-react";

const CONFIG: Record<
  Owner,
  { label: string; Icon: typeof User }
> = {
  banker: { label: "Banker", Icon: User },
  system: { label: "System", Icon: Cpu },
  customer: { label: "Customer", Icon: Users },
};

export function OwnerBadge({ owner }: { owner: Owner }) {
  const { label, Icon } = CONFIG[owner];
  return (
    <span
      className="inline-flex items-center gap-1 text-[11px] font-medium whitespace-nowrap"
      style={{ color: "var(--theme-text-secondary)" }}
    >
      <Icon size={11} strokeWidth={2.2} />
      {label}
    </span>
  );
}
