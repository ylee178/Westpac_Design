"use client";

/**
 * Dev panel — bottom-right gear button. Keeps exactly three demo
 * controls the interviewer (or Sean) can use during presentation:
 *
 *   1. Version — V1 (plain checklist) or V2 (Pac AI panel visible)
 *   2. Skeleton mode — toggles the lo-fi placeholder overlay
 *   3. Reset state — rewinds to the empty deal-creation screen
 *
 * Theme swap, D1 product/entity overrides, and any other knobs
 * have been removed to keep the panel focused.
 */
import { Settings, Check, RotateCcw } from "lucide-react";
import { useDevMode } from "@/lib/dev-mode-context";
import { useFlowMode } from "@/lib/flow-mode-context";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function DevPanel() {
  const { grayscale, setGrayscale, aiPanel, setAiPanel } = useDevMode();
  const { requestReset } = useFlowMode();

  return (
    <div className="fixed bottom-5 right-5 z-[1000]">
      <Popover>
        <PopoverTrigger asChild>
          <button
            aria-label="Open dev panel"
            className="group flex items-center justify-center w-11 h-11 text-white transition-all hover:scale-105 active:scale-95"
            style={{
              background: "#3f3f46",
              borderRadius: "50%",
              border: "none",
              boxShadow: "0 4px 14px rgba(0,0,0,0.25)",
            }}
          >
            <Settings
              size={18}
              strokeWidth={2.2}
              className="transition-transform group-hover:rotate-45"
            />
          </button>
        </PopoverTrigger>
        <PopoverContent
          align="end"
          side="top"
          sideOffset={10}
          collisionPadding={12}
          className="w-[240px] p-0 overflow-hidden flex flex-col"
          style={{
            background: "var(--theme-card-bg)",
            borderColor: "var(--theme-border-strong)",
            color: "var(--theme-text-primary)",
            borderRadius: "var(--theme-radius-lg)",
            boxShadow: "var(--theme-shadow-float)",
            maxHeight: "calc(100vh - 120px)",
          }}
        >
          {/* Tiny header */}
          <div
            className="px-3 py-2 shrink-0"
            style={{ borderBottom: "1px solid var(--theme-border)" }}
          >
            <div
              className="text-[10px] uppercase font-semibold tracking-[0.5px]"
              style={{ color: "var(--theme-text-tertiary)" }}
            >
              Dev panel
            </div>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto">
            {/* 1. Version */}
            <SectionLabel>1 · Version</SectionLabel>
            <div className="px-2 pb-2 space-y-1">
              <OptionButton
                selected={!aiPanel}
                label="V1 · Guided checklist"
                onClick={() => setAiPanel(false)}
              />
              <OptionButton
                selected={aiPanel}
                label="V2 · AI teammate (Pac)"
                onClick={() => setAiPanel(true)}
              />
            </div>

            {/* 2. Skeleton mode */}
            <SectionLabel>2 · Skeleton mode</SectionLabel>
            <div className="px-2 pb-2">
              <OptionButton
                selected={grayscale}
                label={grayscale ? "Skeleton mode · on" : "Skeleton mode · off"}
                onClick={() => setGrayscale(!grayscale)}
              />
            </div>

            {/* 3. Reset state */}
            <SectionLabel>3 · Reset</SectionLabel>
            <div className="px-2 pb-3">
              <button
                type="button"
                onClick={() => requestReset()}
                className="w-full flex items-center gap-2 px-2.5 py-1.5 text-left transition-colors"
                style={{
                  background: "transparent",
                  border: "1px solid var(--theme-border-strong)",
                  borderRadius: "var(--theme-radius)",
                }}
              >
                <RotateCcw
                  size={11}
                  strokeWidth={2.2}
                  style={{ color: "var(--theme-text-secondary)" }}
                />
                <span
                  className="text-[12px] font-medium"
                  style={{ color: "var(--theme-text-primary)" }}
                >
                  Reset to empty state
                </span>
              </button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="px-3 pt-2.5 pb-1 text-[9px] uppercase font-semibold tracking-[0.5px]"
      style={{ color: "var(--theme-text-tertiary)" }}
    >
      {children}
    </div>
  );
}

function OptionButton({
  selected,
  label,
  onClick,
}: {
  selected: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full flex items-center gap-2 px-2.5 py-1.5 text-left transition-colors"
      style={{
        background: selected
          ? "var(--westpac-primary-soft)"
          : "transparent",
        border: selected
          ? "1px solid var(--theme-primary)"
          : "1px solid transparent",
        borderRadius: "var(--theme-radius)",
      }}
    >
      <div
        className="flex items-center justify-center w-3.5 h-3.5 shrink-0"
        style={{
          background: selected ? "var(--theme-primary)" : "transparent",
          border: selected
            ? "none"
            : "1px solid var(--theme-border-strong)",
          borderRadius: "50%",
        }}
      >
        {selected ? <Check size={9} strokeWidth={3.5} color="white" /> : null}
      </div>
      <span
        className="text-[12px] font-medium"
        style={{ color: "var(--theme-text-primary)" }}
      >
        {label}
      </span>
    </button>
  );
}
