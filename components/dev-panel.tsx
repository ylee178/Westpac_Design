"use client";

/**
 * Floating dev panel — bottom-right gear button.
 * Compact popover: 3 stacked option groups, no subtexts, tight gaps.
 * Height capped to viewport; body scrolls if content overflows.
 */
import { Settings, Check } from "lucide-react";
import {
  useDevMode,
  type AppTheme,
  type DemoProduct,
  type DemoEntity,
} from "@/lib/dev-mode-context";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const THEMES: { id: AppTheme; label: string }[] = [
  { id: "ibm", label: "IBM Carbon" },
  { id: "stripe", label: "Stripe" },
];

const PRODUCTS: { id: DemoProduct; label: string }[] = [
  { id: "business-loan", label: "Business Loan" },
  { id: "bank-guarantee", label: "Bank Guarantee" },
  { id: "equipment-finance", label: "Equipment Finance" },
  { id: "business-overdraft", label: "Business Overdraft" },
];

const ENTITIES: { id: DemoEntity; label: string }[] = [
  { id: "company", label: "Company" },
  { id: "trust", label: "Trust" },
  { id: "partnership", label: "Partnership" },
  { id: "sole-trader", label: "Sole trader" },
];

export function DevPanel() {
  const {
    theme,
    setTheme,
    grayscale,
    setGrayscale,
    product,
    setProduct,
    entity,
    setEntity,
    aiPanel,
    setAiPanel,
  } = useDevMode();

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
          className="w-[260px] p-0 overflow-hidden flex flex-col"
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

          {/* Scrollable body */}
          <div className="flex-1 overflow-y-auto">
            <SectionLabel>AI Teammate panel</SectionLabel>
            <div className="px-2 pb-2">
              <OptionButton
                selected={aiPanel}
                label={aiPanel ? "Panel visible" : "Panel hidden (V1 only)"}
                onClick={() => setAiPanel(!aiPanel)}
              />
            </div>

            <SectionLabel>Grayscale</SectionLabel>
            <div className="px-2 pb-2">
              <OptionButton
                selected={grayscale}
                label={grayscale ? "Skeleton mode · on" : "Skeleton mode · off"}
                onClick={() => setGrayscale(!grayscale)}
              />
            </div>

            <SectionLabel>Design system</SectionLabel>
            <div className="px-2 pb-2 space-y-1">
              {THEMES.map((t) => (
                <OptionButton
                  key={t.id}
                  selected={theme === t.id}
                  label={t.label}
                  onClick={() => setTheme(t.id)}
                />
              ))}
            </div>

            <SectionLabel>D1 · Product</SectionLabel>
            <div className="px-2 pb-2 space-y-1">
              {PRODUCTS.map((p) => (
                <OptionButton
                  key={p.id}
                  selected={product === p.id}
                  label={p.label}
                  onClick={() => setProduct(p.id)}
                />
              ))}
            </div>

            <SectionLabel>D1 · Entity type</SectionLabel>
            <div className="px-2 pb-2 space-y-1">
              {ENTITIES.map((e) => (
                <OptionButton
                  key={e.id}
                  selected={entity === e.id}
                  label={e.label}
                  onClick={() => setEntity(e.id)}
                />
              ))}
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
