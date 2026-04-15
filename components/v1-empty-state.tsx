"use client";

/**
 * V1 step 1 — Empty state. Banker lands here, picks product ×
 * entity × jurisdiction via card selectors, then [Create Deal →].
 * No jargon; a day-one banker should understand every word.
 */
import type { DemoEntity, DemoProduct } from "@/lib/dev-mode-context";
import { useDevMode } from "@/lib/dev-mode-context";
import { useFlowMode } from "@/lib/flow-mode-context";
import {
  Banknote,
  Briefcase,
  Building2,
  Coins,
  FileCheck,
  Gavel,
  ShieldCheck,
  TrendingUp,
  User,
  Users,
} from "lucide-react";

const PRODUCTS: {
  id: DemoProduct;
  label: string;
  description: string;
  Icon: typeof Banknote;
}[] = [
  {
    id: "term-loan",
    label: "Term Loan",
    description: "Standard business lending",
    Icon: Banknote,
  },
  {
    id: "bank-guarantee",
    label: "Bank Guarantee",
    description: "Performance bonds & financial guarantees",
    Icon: ShieldCheck,
  },
  {
    id: "trust-lending",
    label: "Trust Lending",
    description: "Lending to trust structures",
    Icon: FileCheck,
  },
  {
    id: "overdraft",
    label: "Equipment Finance",
    description: "Asset-backed lending",
    Icon: Coins,
  },
];

const ENTITIES: {
  id: DemoEntity;
  label: string;
  Icon: typeof User;
}[] = [
  { id: "sole-trader", label: "Individual", Icon: User },
  { id: "company", label: "Company (Pty Ltd)", Icon: Building2 },
  { id: "trust", label: "Trust", Icon: Briefcase },
  { id: "partnership", label: "Partnership", Icon: Users },
];

const JURISDICTIONS = ["NSW", "VIC", "QLD", "WA", "SA"] as const;

export function V1EmptyState() {
  const { product, setProduct, entity, setEntity } = useDevMode();
  const { draft, setDraft, setStep } = useFlowMode();

  // A simple "selected" model for each axis, seeded from draft.
  const selectedProduct = draft.product as DemoProduct | "";
  const selectedEntity = draft.entity as DemoEntity | "";
  const selectedJurisdiction = draft.jurisdiction;

  const allChosen =
    selectedProduct !== "" &&
    selectedEntity !== "" &&
    selectedJurisdiction !== "";

  function handleCreate() {
    if (!allChosen) return;
    // Promote draft selections into the dev-mode product/entity
    // so the deal reshape picks them up immediately.
    setProduct(selectedProduct as DemoProduct);
    setEntity(selectedEntity as DemoEntity);
    setStep("creator");
  }

  return (
    <main
      className="flex-1 flex items-start justify-center py-12 px-6"
      style={{ background: "var(--theme-page-bg)" }}
    >
      <div className="w-full max-w-[920px]">
        <header className="text-center mb-10">
          <h1
            className="text-[28px] font-semibold leading-[1.2]"
            style={{ color: "var(--theme-text-primary)" }}
          >
            Create a new deal
          </h1>
          <p
            className="text-[14px] mt-2"
            style={{ color: "var(--theme-text-secondary)" }}
          >
            Select deal type and we'll build your checklist.
          </p>
        </header>

        <section className="mb-8">
          <SectionLabel step="1" label="Product type" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {PRODUCTS.map((p) => (
              <CardSelector
                key={p.id}
                selected={selectedProduct === p.id}
                onClick={() => setDraft({ product: p.id })}
              >
                <p.Icon
                  size={22}
                  strokeWidth={1.8}
                  style={{ color: "var(--theme-primary)" }}
                />
                <div
                  className="text-[14px] font-semibold mt-3"
                  style={{ color: "var(--theme-text-primary)" }}
                >
                  {p.label}
                </div>
                <div
                  className="text-[11px] mt-0.5 leading-snug"
                  style={{ color: "var(--theme-text-secondary)" }}
                >
                  {p.description}
                </div>
              </CardSelector>
            ))}
          </div>
        </section>

        <section className="mb-8">
          <SectionLabel step="2" label="Entity type" />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {ENTITIES.map((e) => (
              <CardSelector
                key={e.id}
                selected={selectedEntity === e.id}
                onClick={() => setDraft({ entity: e.id })}
                compact
              >
                <e.Icon
                  size={18}
                  strokeWidth={1.8}
                  style={{ color: "var(--theme-primary)" }}
                />
                <div
                  className="text-[13px] font-semibold mt-2"
                  style={{ color: "var(--theme-text-primary)" }}
                >
                  {e.label}
                </div>
              </CardSelector>
            ))}
          </div>
        </section>

        <section className="mb-10">
          <SectionLabel step="3" label="Jurisdiction" />
          <div className="flex flex-wrap gap-2">
            {JURISDICTIONS.map((j) => (
              <button
                key={j}
                type="button"
                onClick={() => setDraft({ jurisdiction: j })}
                className="inline-flex items-center gap-1.5 h-10 px-4 text-[13px] font-semibold transition-colors"
                style={{
                  background:
                    selectedJurisdiction === j
                      ? "var(--theme-primary)"
                      : "var(--theme-card-bg)",
                  color:
                    selectedJurisdiction === j
                      ? "var(--theme-primary-fg)"
                      : "var(--theme-text-primary)",
                  border:
                    selectedJurisdiction === j
                      ? "1px solid var(--theme-primary)"
                      : "1px solid var(--theme-border-strong)",
                  borderRadius: "var(--theme-radius)",
                }}
              >
                <Gavel size={13} strokeWidth={2.2} />
                {j}
              </button>
            ))}
          </div>
        </section>

        <div className="flex items-center justify-center">
          <button
            type="button"
            onClick={handleCreate}
            disabled={!allChosen}
            className="inline-flex items-center gap-2 h-12 px-6 text-[14px] font-semibold text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            style={{
              background: "var(--theme-primary)",
              borderRadius: "var(--theme-radius)",
            }}
          >
            Create Deal
            <TrendingUp size={14} strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </main>
  );
}

function SectionLabel({ step, label }: { step: string; label: string }) {
  return (
    <div className="flex items-baseline gap-2 mb-3">
      <span
        className="text-[10px] uppercase font-semibold tabular-nums"
        style={{
          color: "var(--theme-text-tertiary)",
          letterSpacing: "0.5px",
        }}
      >
        Step {step}
      </span>
      <h2
        className="text-[14px] font-semibold"
        style={{ color: "var(--theme-text-primary)" }}
      >
        {label}
      </h2>
    </div>
  );
}

function CardSelector({
  selected,
  onClick,
  children,
  compact = false,
}: {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
  compact?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full flex flex-col items-start text-left transition-all ${compact ? "p-3" : "p-4"}`}
      style={{
        background: selected
          ? "var(--westpac-primary-soft)"
          : "var(--theme-card-bg)",
        border: selected
          ? "2px solid var(--theme-primary)"
          : "1px solid var(--theme-border)",
        borderRadius: "var(--theme-radius)",
        boxShadow: selected
          ? "0 1px 0 rgba(122,30,58,0.06)"
          : "none",
      }}
    >
      {children}
    </button>
  );
}
