"use client";

/**
 * Floating dev panel — bottom-right gear button that opens a popover
 * with 3 controls: version (V1/V2), theme (IBM/Stripe), grayscale on/off.
 *
 * Used to demo the same prototype under different design-system bases
 * while the Westpac brand overlay stays constant.
 */
import { Settings, Check } from "lucide-react";
import { useDevMode, type AppTheme, type AppVersion } from "@/lib/dev-mode-context";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const VERSIONS: { id: AppVersion; label: string; sub: string }[] = [
  {
    id: "v1",
    label: "V1",
    sub: "Structured rules · checklist + skip picker + mode indicators",
  },
  {
    id: "v2",
    label: "V2",
    sub: "AI teammate layer · smart ordering + AI confidence input",
  },
];

const THEMES: { id: AppTheme; label: string; sub: string }[] = [
  {
    id: "ibm",
    label: "IBM Carbon",
    sub: "Rectangular · flat · Plex Sans · background layering",
  },
  {
    id: "stripe",
    label: "Stripe",
    sub: "Rounded · shadows · Inter · airy spacing",
  },
];

export function DevPanel() {
  const { version, setVersion, theme, setTheme, grayscale, setGrayscale } =
    useDevMode();

  return (
    <div className="fixed bottom-5 right-5 z-[1000]">
      <Popover>
        <PopoverTrigger asChild>
          <button
            aria-label="Open dev panel"
            className="group flex items-center justify-center w-12 h-12 text-white shadow-lg transition-all hover:scale-105 active:scale-95"
            style={{
              background: "var(--westpac-brand-maroon)",
              borderRadius: "50%",
              border: "2px solid var(--westpac-brand-red)",
              boxShadow:
                "0 8px 24px rgba(98,17,50,0.35), 0 2px 6px rgba(0,0,0,0.15)",
            }}
          >
            <Settings
              size={20}
              strokeWidth={2.2}
              className="transition-transform group-hover:rotate-45"
            />
          </button>
        </PopoverTrigger>
        <PopoverContent
          align="end"
          side="top"
          sideOffset={12}
          className="w-[340px] p-0 rounded-none border"
          style={{
            background: "var(--theme-card-bg)",
            borderColor: "var(--theme-border-strong)",
            color: "var(--theme-text-primary)",
            borderRadius: "var(--theme-radius-lg)",
            boxShadow: "var(--theme-shadow-float)",
          }}
        >
          {/* Header */}
          <div
            className="px-4 py-3 border-b"
            style={{
              borderColor: "var(--theme-border)",
              background: "var(--theme-surface-subtle)",
            }}
          >
            <div
              className="text-[10px] uppercase tracking-[0.5px] font-semibold"
              style={{ color: "var(--westpac-brand-maroon)" }}
            >
              Dev panel
            </div>
            <div
              className="text-[13px] font-semibold mt-0.5"
              style={{ color: "var(--theme-text-primary)" }}
            >
              Prototype controls
            </div>
            <div
              className="text-[11px] mt-1 leading-snug"
              style={{ color: "var(--theme-text-secondary)" }}
            >
              Swap the underlying design system; the Westpac brand overlay
              stays constant.
            </div>
          </div>

          {/* Section 1 — Version */}
          <SectionLabel>1 · Version</SectionLabel>
          <div className="px-3 pb-3 space-y-1.5">
            {VERSIONS.map((v) => (
              <OptionButton
                key={v.id}
                selected={version === v.id}
                label={v.label}
                sub={v.sub}
                onClick={() => setVersion(v.id)}
              />
            ))}
          </div>

          {/* Section 2 — Grayscale */}
          <SectionLabel>2 · Grayscale filter</SectionLabel>
          <div className="px-3 pb-3">
            <button
              type="button"
              role="switch"
              aria-checked={grayscale}
              onClick={() => setGrayscale(!grayscale)}
              className="w-full flex items-center justify-between px-3 py-2.5 border transition-colors"
              style={{
                background: grayscale
                  ? "var(--westpac-brand-maroon-soft)"
                  : "var(--theme-card-bg)",
                borderColor: grayscale
                  ? "var(--westpac-brand-maroon)"
                  : "var(--theme-border)",
                borderWidth: grayscale ? "2px" : "1px",
                borderRadius: "var(--theme-radius)",
              }}
            >
              <div className="text-left">
                <div
                  className="text-[12px] font-semibold"
                  style={{ color: "var(--theme-text-primary)" }}
                >
                  Grayscale filter
                </div>
                <div
                  className="text-[10px] mt-0.5 leading-tight"
                  style={{ color: "var(--theme-text-secondary)" }}
                >
                  Off = full colour. Toggle to verify the UI still reads without hue.
                </div>
              </div>
              <span
                className="text-[10px] uppercase tracking-[0.5px] font-semibold px-2 py-1 border"
                style={{
                  color: grayscale
                    ? "var(--westpac-brand-maroon)"
                    : "var(--theme-text-tertiary)",
                  borderColor: grayscale
                    ? "var(--westpac-brand-maroon)"
                    : "var(--theme-border)",
                  background: grayscale
                    ? "var(--theme-card-bg)"
                    : "var(--theme-surface-subtle)",
                }}
              >
                {grayscale ? "ON" : "OFF"}
              </span>
            </button>
          </div>

          {/* Section 3 — Design system */}
          <SectionLabel>3 · Design system base</SectionLabel>
          <div className="px-3 pb-3 space-y-1.5">
            {THEMES.map((t) => (
              <OptionButton
                key={t.id}
                selected={theme === t.id}
                label={t.label}
                sub={t.sub}
                onClick={() => setTheme(t.id)}
              />
            ))}
          </div>

          {/* Brand note */}
          <div
            className="px-4 py-2.5 border-t text-[10px] leading-snug"
            style={{
              borderColor: "var(--theme-border)",
              background: "var(--theme-surface-subtle)",
              color: "var(--theme-text-secondary)",
            }}
          >
            <span
              className="inline-block w-2 h-2 align-middle mr-1.5"
              style={{ background: "var(--westpac-brand-red)" }}
            />
            Westpac brand (red · maroon · W-mark) is applied as an overlay on
            top of the chosen design system.
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="px-4 pt-3 pb-1.5 text-[10px] uppercase tracking-[0.5px] font-semibold"
      style={{ color: "var(--theme-text-tertiary)" }}
    >
      {children}
    </div>
  );
}

function OptionButton({
  selected,
  label,
  sub,
  onClick,
}: {
  selected: boolean;
  label: string;
  sub: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full flex items-start gap-2.5 px-3 py-2.5 border text-left transition-colors"
      style={{
        background: selected
          ? "var(--westpac-brand-maroon-soft)"
          : "var(--theme-card-bg)",
        borderColor: selected
          ? "var(--westpac-brand-maroon)"
          : "var(--theme-border)",
        borderWidth: selected ? "2px" : "1px",
        borderRadius: "var(--theme-radius)",
      }}
    >
      <div
        className="flex items-center justify-center w-4 h-4 mt-0.5 shrink-0"
        style={{
          background: selected
            ? "var(--westpac-brand-maroon)"
            : "transparent",
          border: selected
            ? "none"
            : "1px solid var(--theme-border-strong)",
          borderRadius: "50%",
        }}
      >
        {selected ? <Check size={10} strokeWidth={3} color="white" /> : null}
      </div>
      <div className="min-w-0 flex-1">
        <div
          className="text-[12px] font-semibold"
          style={{ color: "var(--theme-text-primary)" }}
        >
          {label}
        </div>
        <div
          className="text-[10px] mt-0.5 leading-tight"
          style={{ color: "var(--theme-text-secondary)" }}
        >
          {sub}
        </div>
      </div>
    </button>
  );
}
