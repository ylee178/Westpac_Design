"use client";

/**
 * V1 ↔ V2 header toggle — segmented control, top right of DealHeader.
 * V1 = Guided Checklist (structured rules)
 * V2 = AI Teammate (scripted chat with Pac)
 */
import { useFlowMode } from "@/lib/flow-mode-context";
import { ListChecks, Sparkles } from "lucide-react";
import { PacAvatar } from "@/components/pac-avatar";

export function ModeToggle() {
  const { mode, setMode } = useFlowMode();

  return (
    <div
      role="radiogroup"
      aria-label="Prototype mode"
      className="inline-flex items-center gap-0 border h-9"
      style={{
        borderColor: "var(--theme-border-strong)",
        borderRadius: "var(--theme-radius)",
        background: "var(--theme-card-bg)",
      }}
    >
      <button
        type="button"
        role="radio"
        aria-checked={mode === "v1"}
        onClick={() => setMode("v1")}
        className="flex items-center gap-1.5 h-full px-3 text-[12px] font-medium transition-colors whitespace-nowrap"
        style={{
          background: mode === "v1" ? "var(--theme-primary)" : "transparent",
          color:
            mode === "v1"
              ? "var(--theme-primary-fg)"
              : "var(--theme-text-secondary)",
        }}
      >
        <ListChecks size={13} strokeWidth={2.2} />
        V1 · Guided
      </button>
      <div
        className="w-px self-stretch"
        style={{ background: "var(--theme-border)" }}
      />
      <button
        type="button"
        role="radio"
        aria-checked={mode === "v2"}
        onClick={() => setMode("v2")}
        className="flex items-center gap-1.5 h-full px-3 text-[12px] font-medium transition-colors whitespace-nowrap"
        style={{
          background: mode === "v2" ? "var(--theme-primary)" : "transparent",
          color:
            mode === "v2"
              ? "var(--theme-primary-fg)"
              : "var(--theme-text-secondary)",
        }}
      >
        {mode === "v2" ? (
          <PacAvatar size={14} state="idle" />
        ) : (
          <Sparkles size={13} strokeWidth={2.2} />
        )}
        V2 · AI Teammate
      </button>
    </div>
  );
}
