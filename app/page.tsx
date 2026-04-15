"use client";

/**
 * Main page — BizEdge Deal Workspace.
 *
 * This single page composes all 9 design decisions and drives the
 * 11-step interactive demo flow. State lives here; child components
 * are presentation + event handlers only.
 */
import { useMemo, useState } from "react";
import type {
  ChecklistItem as CI,
  Deal,
  EntityType,
  OwnerFilter as OF,
  ProductType,
} from "@/lib/types";
import { INITIAL_CHECKLIST, SAMPLE_DEAL } from "@/data/deal-data";
import { calculateConfidence } from "@/lib/confidence-calc";
import {
  reshapeChecklist,
  itemsForPhase,
} from "@/lib/checklist-reshape";

import { DealHeader } from "@/components/deal-header";
import { ProgressSpine } from "@/components/progress-spine";
import { ProductEntitySwitcher } from "@/components/product-entity-switcher";
import { OwnerFilter } from "@/components/owner-filter";
import { ChecklistItemRow } from "@/components/checklist-item";
import { SkipDialog } from "@/components/skip-dialog";
import { DevPanel } from "@/components/dev-panel";
import { Info } from "lucide-react";

export default function Page() {
  // ——— State ———
  const [deal, setDeal] = useState<Deal>(SAMPLE_DEAL);
  const [library, setLibrary] = useState<CI[]>(INITIAL_CHECKLIST);
  const [ownerFilter, setOwnerFilter] = useState<OF>("all");
  const [skipTarget, setSkipTarget] = useState<CI | null>(null);

  // ——— Derived (computed during render — no useEffect for this) ———
  // D1: reshape by product × entity
  const reshaped = useMemo(
    () => reshapeChecklist(library, deal),
    [library, deal],
  );

  // D5: items for the current phase only
  const currentPhaseItems = useMemo(
    () => itemsForPhase(reshaped, deal.phase),
    [reshaped, deal.phase],
  );

  // D7: apply owner filter on top of reshaped+phase items
  const visibleItems = useMemo(
    () =>
      ownerFilter === "all"
        ? currentPhaseItems
        : currentPhaseItems.filter((i) => i.owner === ownerFilter),
    [currentPhaseItems, ownerFilter],
  );

  // Owner counts (shown next to filter buttons)
  const ownerCounts = useMemo<Record<OF, number>>(() => {
    const counts: Record<OF, number> = {
      all: currentPhaseItems.length,
      banker: 0,
      system: 0,
      customer: 0,
    };
    for (const i of currentPhaseItems) counts[i.owner] += 1;
    return counts;
  }, [currentPhaseItems]);

  // D9: confidence score — calculated from the full reshaped library, not just phase
  const breakdown = useMemo(
    () => calculateConfidence(reshaped, deal),
    [reshaped, deal],
  );

  // Red flag: any legally mandatory item in the reshaped list is not complete
  const hasRedFlag = useMemo(
    () =>
      reshaped.some(
        (i) =>
          i.legallyMandatory &&
          i.status !== "complete" &&
          i.status !== "skipped",
      ),
    [reshaped],
  );

  // ——— Handlers ———
  function handleProductChange(product: ProductType) {
    setDeal((d) => ({ ...d, product }));
  }

  function handleEntityChange(entity: EntityType) {
    setDeal((d) => ({ ...d, entity }));
  }

  function handleRequestSkip(item: CI) {
    setSkipTarget(item);
  }

  function handleSkipConfirm(payload: { category: string; freeText?: string }) {
    if (!skipTarget) return;
    setLibrary((prev) =>
      prev.map((i) =>
        i.id === skipTarget.id
          ? { ...i, status: "skipped", skipReason: payload }
          : i,
      ),
    );
    setSkipTarget(null);
  }

  function handleSkipCancel() {
    setSkipTarget(null);
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header — customer, amount, D8 mode, D9 confidence */}
      <DealHeader deal={deal} breakdown={breakdown} hasRedFlag={hasRedFlag} />

      {/* D5 — Progress spine */}
      <ProgressSpine currentPhase={deal.phase} />

      {/* Main workspace — table-first, quiet */}
      <main
        className="flex-1"
        style={{ background: "var(--theme-page-bg)" }}
      >
        <div className="max-w-[1584px] mx-auto px-6 md:px-8 py-5">
          {/* Inline filter bar — dense, bank-style */}
          <div
            className="flex items-end justify-between gap-4 flex-wrap mb-4 pb-4"
            style={{ borderBottom: "1px solid var(--theme-border-subtle)" }}
          >
            <ProductEntitySwitcher
              product={deal.product}
              entity={deal.entity}
              onProductChange={handleProductChange}
              onEntityChange={handleEntityChange}
            />

            <div className="flex flex-col gap-1">
              <span
                className="text-[10px] uppercase font-medium"
                style={{
                  color: "var(--theme-text-tertiary)",
                  letterSpacing: "0.32px",
                }}
              >
                Owner filter
              </span>
              <OwnerFilter
                value={ownerFilter}
                onChange={setOwnerFilter}
                counts={ownerCounts}
              />
            </div>
          </div>

          {/* Section heading — quiet */}
          <div className="mb-2 flex items-baseline justify-between flex-wrap gap-2">
            <h2
              className="text-[15px] leading-[1.4] font-semibold"
              style={{ color: "var(--theme-text-primary)" }}
            >
              Identification phase — checklist
            </h2>
            <div
              className="text-[11px]"
              style={{ color: "var(--theme-text-tertiary)" }}
            >
              Showing {visibleItems.length} of {currentPhaseItems.length} items
              · reshape: {deal.product} × {deal.entity}
            </div>
          </div>

          {/* Table-like list */}
          {visibleItems.length > 0 ? (
            <div
              style={{
                background: "var(--theme-card-bg)",
                border: "1px solid var(--theme-border)",
                borderRadius: "var(--theme-radius)",
                overflow: "hidden",
              }}
            >
              <ul>
                {visibleItems.map((item) => (
                  <ChecklistItemRow
                    key={item.id}
                    item={item}
                    onRequestSkip={handleRequestSkip}
                  />
                ))}
              </ul>
            </div>
          ) : (
            <div
              className="py-12 text-center text-[12px]"
              style={{
                background: "var(--theme-card-bg)",
                border: "1px solid var(--theme-border)",
                color: "var(--theme-text-tertiary)",
                borderRadius: "var(--theme-radius)",
              }}
            >
              No items match the current filter. Change Owner filter back to "All".
            </div>
          )}

          {/* Footer hint — subtle, table-like */}
          <aside
            className="mt-6 p-3 flex items-start gap-2.5"
            style={{
              background: "var(--theme-card-bg)",
              border: "1px solid var(--theme-border)",
              borderLeft: "2px solid var(--theme-primary)",
              borderRadius: "var(--theme-radius)",
            }}
          >
            <Info
              className="shrink-0 mt-0.5"
              size={13}
              style={{ color: "var(--theme-primary)" }}
            />
            <div
              className="text-[11px] leading-[1.55]"
              style={{ color: "var(--theme-text-secondary)" }}
            >
              <span
                className="font-semibold"
                style={{ color: "var(--theme-text-primary)" }}
              >
                Demo flow:
              </span>{" "}
              Switch product (Bank Guarantee → Term Loan) to see D1 reshape.
              Click any row to expand (D4). Open knowledge cards (D3), hover
              provenance (D6), filter by owner (D7), try skipping a
              non-mandatory item (D2), and try skipping "Source of funds
              declaration" to see the legally-mandatory lock. Hover the Deal
              Confidence score (D9) for the breakdown. Hover the CDD mode
              label (D8) for AUSTRAC reform context.
            </div>
          </aside>
        </div>
      </main>

      {/* D2 — Skip dialog */}
      <SkipDialog
        open={skipTarget !== null}
        item={skipTarget}
        onCancel={handleSkipCancel}
        onConfirm={handleSkipConfirm}
      />

      {/* Floating dev panel — theme / version / grayscale */}
      <DevPanel />
    </div>
  );
}
