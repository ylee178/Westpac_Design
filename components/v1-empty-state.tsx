"use client";

/**
 * V1 step 1 — Empty state with DYNAMIC option loading.
 *
 * The banker picks a product card, then the entity / amount /
 * purpose / jurisdiction sections appear as skeleton placeholders
 * and progressively resolve into product-specific options. This
 * is D1 (dynamic reshape) at the entry point — the FORM itself
 * reshapes based on the product, not just the checklist later.
 *
 * Product options are verified from westpac.com.au.
 */
import { useEffect, useRef, useState } from "react";
import type { DemoEntity, DemoProduct } from "@/lib/dev-mode-context";
import { useDevMode } from "@/lib/dev-mode-context";
import { useFlowMode } from "@/lib/flow-mode-context";
import {
  PRODUCTS_IN_ORDER,
  WESTPAC_PRODUCTS,
  type WestpacProductId,
  type WestpacJurisdiction,
  type AmountBucket,
  type OptionValue,
} from "@/data/product-options";
import { Skeleton } from "@/components/skeleton";
import {
  ArrowRight,
  Banknote,
  Briefcase,
  Building2,
  FileCheck,
  Gavel,
  ShieldCheck,
  User,
  Users,
  Wallet,
  Wrench,
} from "lucide-react";

// Product → icon mapping for the hero card row
const PRODUCT_ICON: Record<WestpacProductId, typeof Banknote> = {
  "business-loan": Banknote,
  "bank-guarantee": ShieldCheck,
  "equipment-finance": Wrench,
  "business-overdraft": Wallet,
};

// Entity → icon mapping
const ENTITY_ICON: Record<string, typeof User> = {
  "sole-trader": User,
  company: Building2,
  trust: FileCheck,
  partnership: Users,
};

// Stagger delays per section, in ms from product-selection moment
const STAGGER = {
  entity: 200,
  amount: 350,
  secondary: 500,
  jurisdiction: 650,
};

type SectionKey = "entity" | "amount" | "secondary" | "jurisdiction";

function scrollToRef(ref: React.RefObject<HTMLElement | null>, delay = 350) {
  setTimeout(() => {
    ref.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, delay);
}

export function V1EmptyState() {
  const { setProduct, setEntity } = useDevMode();
  const { draft, setDraft, setStep } = useFlowMode();

  const entityRef = useRef<HTMLElement>(null);
  const amountRef = useRef<HTMLElement>(null);
  const secondaryRef = useRef<HTMLElement>(null);
  const jurisdictionRef = useRef<HTMLElement>(null);
  const submitRef = useRef<HTMLDivElement>(null);

  const selectedProductId = draft.product as WestpacProductId | "";
  const product = selectedProductId
    ? WESTPAC_PRODUCTS[selectedProductId]
    : null;

  // Reveal map — which sections have resolved past the skeleton state.
  const [revealed, setRevealed] = useState<Record<SectionKey, boolean>>({
    entity: false,
    amount: false,
    secondary: false,
    jurisdiction: false,
  });

  // Whenever the product changes, reset reveal + clear downstream draft
  // selections, then stagger-reveal each section.
  useEffect(() => {
    if (!selectedProductId) {
      setRevealed({
        entity: false,
        amount: false,
        secondary: false,
        jurisdiction: false,
      });
      return;
    }
    setRevealed({
      entity: false,
      amount: false,
      secondary: false,
      jurisdiction: false,
    });
    setDraft({
      entity: "",
      amountBucket: "",
      purpose: "",
      jurisdiction: "",
    });
    const timers: ReturnType<typeof setTimeout>[] = [];
    timers.push(
      setTimeout(() => setRevealed((p) => ({ ...p, entity: true })), STAGGER.entity),
    );
    timers.push(
      setTimeout(() => setRevealed((p) => ({ ...p, amount: true })), STAGGER.amount),
    );
    timers.push(
      setTimeout(
        () => setRevealed((p) => ({ ...p, secondary: true })),
        STAGGER.secondary,
      ),
    );
    timers.push(
      setTimeout(
        () => setRevealed((p) => ({ ...p, jurisdiction: true })),
        STAGGER.jurisdiction,
      ),
    );
    return () => timers.forEach(clearTimeout);
    // intentionally only re-run when product changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedProductId]);

  // Readiness check — every required axis chosen?
  const allChosen =
    selectedProductId !== "" &&
    draft.entity !== "" &&
    draft.amountBucket !== "" &&
    draft.purpose !== "" &&
    draft.jurisdiction !== "";

  function handleCreate() {
    if (!allChosen || !product) return;
    setProduct(selectedProductId as DemoProduct);
    setEntity(draft.entity as DemoEntity);
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

        {/* Product type — always visible */}
        <section className="mb-8">
          <SectionLabel label="Product type" />
          {!product ? (
            <div
              className="text-[12px] mb-3 -mt-1"
              style={{ color: "var(--theme-text-tertiary)" }}
            >
              Select a product to continue.
            </div>
          ) : null}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {PRODUCTS_IN_ORDER.map((id) => {
              const p = WESTPAC_PRODUCTS[id];
              const Icon = PRODUCT_ICON[id];
              return (
                <CardSelector
                  key={id}
                  selected={selectedProductId === id}
                  onClick={() => {
                    setDraft({ product: id });
                    scrollToRef(entityRef, 500);
                  }}
                >
                  <IconTile>
                    <Icon
                      size={20}
                      strokeWidth={1.9}
                      style={{ color: "var(--theme-primary)" }}
                    />
                  </IconTile>
                  <div
                    className="text-[14px] font-semibold mt-3"
                    style={{ color: "var(--theme-text-primary)" }}
                  >
                    {p.name}
                  </div>
                  <div
                    className="text-[11px] mt-0.5 leading-snug"
                    style={{ color: "var(--theme-text-secondary)" }}
                  >
                    {p.tagline}
                  </div>
                  {p.existingCustomerOnly ? (
                    <span
                      className="inline-flex items-center mt-2 px-2 py-[2px] text-[9px] font-semibold uppercase"
                      style={{
                        background: "rgba(0, 0, 0, 0.08)",
                        color: "var(--theme-text-secondary)",
                        borderRadius: "999px",
                        letterSpacing: "0.4px",
                      }}
                    >
                      Existing customer
                    </span>
                  ) : null}
                </CardSelector>
              );
            })}
          </div>
        </section>

        {/* Dynamic sections — only render once a product is chosen */}
        {product ? (
          <>
            <section ref={entityRef} className="mb-8">
              <SectionLabel label="Entity type" />
              {revealed.entity ? (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 animate-fade-in">
                  {product.entityTypes.map((e) => {
                    const Icon = ENTITY_ICON[e.id] ?? User;
                    return (
                      <CardSelector
                        key={e.id}
                        selected={draft.entity === e.id}
                        onClick={() => {
                          setDraft({ entity: e.id });
                          scrollToRef(amountRef);
                        }}
                        compact
                      >
                        <IconTile size={32}>
                          <Icon
                            size={16}
                            strokeWidth={1.9}
                            style={{ color: "var(--theme-primary)" }}
                          />
                        </IconTile>
                        <div
                          className="text-[13px] font-semibold mt-2"
                          style={{ color: "var(--theme-text-primary)" }}
                        >
                          {e.label}
                        </div>
                      </CardSelector>
                    );
                  })}
                </div>
              ) : (
                <SkeletonCardRow count={4} compact />
              )}
            </section>

            <section ref={amountRef} className="mb-8">
              <SectionLabel label="Amount range" />
              {product.amountNote && revealed.amount ? (
                <div
                  className="text-[11px] mb-2 animate-fade-in"
                  style={{ color: "var(--theme-text-tertiary)" }}
                >
                  {product.amountNote}
                </div>
              ) : null}
              {revealed.amount ? (
                <div className="flex flex-wrap gap-2 animate-fade-in">
                  {product.amountBuckets.map((b) => (
                    <PillSelector
                      key={b.id}
                      selected={draft.amountBucket === b.id}
                      onClick={() => {
                        setDraft({ amountBucket: b.id });
                        scrollToRef(secondaryRef);
                      }}
                    >
                      {b.label}
                    </PillSelector>
                  ))}
                </div>
              ) : (
                <SkeletonPillRow count={4} />
              )}
            </section>

            <section ref={secondaryRef} className="mb-8">
              <SectionLabel label={product.secondary.sectionLabel} />
              {revealed.secondary ? (
                <div className="flex flex-wrap gap-2 animate-fade-in">
                  {product.secondary.options.map((opt) => (
                    <PillSelector
                      key={opt.id}
                      selected={draft.purpose === opt.id}
                      onClick={() => {
                        setDraft({ purpose: opt.id });
                        scrollToRef(jurisdictionRef);
                      }}
                    >
                      {opt.label}
                    </PillSelector>
                  ))}
                </div>
              ) : (
                <SkeletonPillRow count={4} />
              )}
            </section>

            <section ref={jurisdictionRef} className="mb-10">
              <SectionLabel label="Jurisdiction" />
              {revealed.jurisdiction ? (
                <div className="flex flex-wrap gap-2 animate-fade-in">
                  {product.jurisdictions.map((j) => (
                    <button
                      key={j}
                      type="button"
                      onClick={() => {
                        setDraft({ jurisdiction: j });
                        scrollToRef(submitRef);
                      }}
                      className="interactive-pill inline-flex items-center gap-1.5 h-10 px-4 text-[13px] font-semibold cursor-pointer"
                      style={{
                        background:
                          draft.jurisdiction === j
                            ? "var(--theme-primary)"
                            : "var(--theme-card-bg)",
                        color:
                          draft.jurisdiction === j
                            ? "var(--theme-primary-fg)"
                            : "var(--theme-text-primary)",
                        border:
                          draft.jurisdiction === j
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
              ) : (
                <SkeletonPillRow count={5} />
              )}
            </section>
          </>
        ) : null}

        <div ref={submitRef} className="flex items-center justify-end">
          <button
            type="button"
            onClick={handleCreate}
            disabled={!allChosen}
            className="interactive-primary inline-flex items-center gap-2 h-12 px-6 text-[14px] font-semibold text-white cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            style={{
              background: "var(--theme-primary)",
              borderRadius: "var(--theme-radius)",
            }}
          >
            Create Deal
            <ArrowRight size={14} strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </main>
  );
}

function SectionLabel({ label }: { label: string }) {
  return (
    <div className="mb-3">
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
      className={`interactive-card w-full flex flex-col items-start text-left cursor-pointer ${compact ? "p-3" : "p-4"}`}
      style={{
        background: selected
          ? "var(--westpac-primary-soft)"
          : "var(--theme-card-bg)",
        border: selected
          ? "2px solid var(--theme-primary)"
          : "1px solid var(--theme-border)",
        borderRadius: "var(--theme-radius)",
      }}
    >
      {children}
    </button>
  );
}

/**
 * Rounded-square icon tile — wraps product/entity card icons in a
 * pale Westpac-maroon background so each card has a clear visual
 * anchor independent of label length. Uses westpac-primary-soft so
 * the selected state's background still shows through cleanly.
 */
function IconTile({
  children,
  size = 36,
}: {
  children: React.ReactNode;
  size?: number;
}) {
  return (
    <span
      className="inline-flex items-center justify-center shrink-0"
      style={{
        width: size,
        height: size,
        background: "var(--westpac-primary-soft)",
        borderRadius: "8px",
      }}
    >
      {children}
    </span>
  );
}

function PillSelector({
  selected,
  onClick,
  children,
}: {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="interactive-pill inline-flex items-center h-10 px-4 text-[13px] font-semibold cursor-pointer"
      style={{
        background: selected
          ? "var(--theme-primary)"
          : "var(--theme-card-bg)",
        color: selected
          ? "var(--theme-primary-fg)"
          : "var(--theme-text-primary)",
        border: selected
          ? "1px solid var(--theme-primary)"
          : "1px solid var(--theme-border-strong)",
        borderRadius: "var(--theme-radius)",
      }}
    >
      {children}
    </button>
  );
}

function SkeletonCardRow({
  count,
  compact = false,
}: {
  count: number;
  compact?: boolean;
}) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`w-full ${compact ? "p-3" : "p-4"}`}
          style={{
            background: "var(--theme-card-bg)",
            border: "1px solid var(--theme-border)",
            borderRadius: "var(--theme-radius)",
          }}
        >
          <Skeleton
            animation="none"
            variant="card"
            width={compact ? 32 : 36}
            height={compact ? 32 : 36}
          />
          <div className="mt-2.5">
            <Skeleton animation="none" variant="text" width="70%" height="13px" />
          </div>
        </div>
      ))}
    </div>
  );
}

function SkeletonPillRow({ count }: { count: number }) {
  const widths = ["110px", "130px", "120px", "100px", "90px"];
  return (
    <div className="flex flex-wrap gap-2">
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton
          key={i}
          animation="none"
          variant="button"
          width={widths[i % widths.length]}
          height={40}
        />
      ))}
    </div>
  );
}
