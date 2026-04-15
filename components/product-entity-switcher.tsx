"use client";

/**
 * D1 — Product + Entity switchers.
 * Changing these triggers the checklist to reshape (demo interaction #2).
 * In production this would read from the deal record; here it's interactive
 * for the prototype demo.
 */
import type { ProductType, EntityType } from "@/lib/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const PRODUCTS: { id: ProductType; label: string }[] = [
  { id: "bank-guarantee", label: "Bank Guarantee" },
  { id: "term-loan", label: "Term Loan" },
  { id: "overdraft", label: "Overdraft" },
  { id: "trust-lending", label: "Trust Lending" },
];

const ENTITIES: { id: EntityType; label: string }[] = [
  { id: "company", label: "Company (Pty Ltd)" },
  { id: "trust", label: "Trust" },
  { id: "partnership", label: "Partnership" },
  { id: "sole-trader", label: "Sole Trader" },
];

interface Props {
  product: ProductType;
  entity: EntityType;
  onProductChange: (p: ProductType) => void;
  onEntityChange: (e: EntityType) => void;
}

export function ProductEntitySwitcher({
  product,
  entity,
  onProductChange,
  onEntityChange,
}: Props) {
  return (
    <div className="flex items-center gap-4 flex-wrap">
      <SwitcherField label="Product">
        <Select
          value={product}
          onValueChange={(v) => onProductChange(v as ProductType)}
        >
          <SelectTrigger
            className="w-[200px] rounded-none h-10 bg-[#f4f4f4] border-0 border-b-2 border-[#161616] focus:ring-0 focus-visible:ring-0 focus-visible:border-[#0f62fe] text-[13px]"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="rounded-none border-[#c6c6c6]">
            {PRODUCTS.map((p) => (
              <SelectItem
                key={p.id}
                value={p.id}
                className="rounded-none text-[13px] focus:bg-[#edf5ff] focus:text-[#0043ce]"
              >
                {p.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </SwitcherField>

      <SwitcherField label="Entity type">
        <Select
          value={entity}
          onValueChange={(v) => onEntityChange(v as EntityType)}
        >
          <SelectTrigger
            className="w-[200px] rounded-none h-10 bg-[#f4f4f4] border-0 border-b-2 border-[#161616] focus:ring-0 focus-visible:ring-0 focus-visible:border-[#0f62fe] text-[13px]"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="rounded-none border-[#c6c6c6]">
            {ENTITIES.map((e) => (
              <SelectItem
                key={e.id}
                value={e.id}
                className="rounded-none text-[13px] focus:bg-[#edf5ff] focus:text-[#0043ce]"
              >
                {e.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </SwitcherField>
    </div>
  );
}

function SwitcherField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[11px] uppercase tracking-[0.5px] text-[#525252] font-normal">
        {label}
      </span>
      {children}
    </div>
  );
}
