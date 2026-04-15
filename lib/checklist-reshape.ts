/**
 * D1 — Dynamic checklist reshape.
 *
 * Given a full checklist library + current deal profile, return the items
 * that actually apply for this product × entity × jurisdiction combination.
 *
 * This is what makes the checklist "dynamic" — when the banker switches
 * the product from Bank Guarantee to Term Loan, bank-guarantee-specific
 * items disappear and term-loan-specific items appear.
 */
import type { ChecklistItem, Deal } from "@/lib/types";

export function applies(item: ChecklistItem, deal: Deal): boolean {
  const productOk =
    item.appliesTo.product === null ||
    item.appliesTo.product.includes(deal.product);
  const entityOk =
    item.appliesTo.entity === null ||
    item.appliesTo.entity.includes(deal.entity);
  // (Jurisdiction reshape hook intentionally omitted in the prototype;
  //  demo focuses on product × entity axis.)
  return productOk && entityOk;
}

export function reshapeChecklist(
  library: ChecklistItem[],
  deal: Deal,
): ChecklistItem[] {
  return library.filter((item) => applies(item, deal));
}

/**
 * Filter for the current phase — D5 progress spine shows only current stage.
 */
export function itemsForPhase(
  items: ChecklistItem[],
  phase: Deal["phase"],
): ChecklistItem[] {
  return items.filter((i) => i.phase === phase);
}
