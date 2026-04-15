"use client";

/**
 * D1 — Product + Entity switchers. Quiet financial-UI dropdowns,
 * thin border, no heavy input shells.
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
    <div className="flex items-center gap-3 flex-wrap">
      <SwitcherField label="Product">
        <Select
          value={product}
          onValueChange={(v) => onProductChange(v as ProductType)}
        >
          <SelectTrigger
            className="w-[200px] h-9 text-[13px] focus:ring-0 focus-visible:ring-0"
            style={{
              background: "var(--theme-card-bg)",
              borderColor: "var(--theme-border)",
              color: "var(--theme-text-primary)",
              borderRadius: "var(--theme-radius)",
            }}
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent
            style={{
              background: "var(--theme-card-bg)",
              borderColor: "var(--theme-border)",
              borderRadius: "var(--theme-radius)",
            }}
          >
            {PRODUCTS.map((p) => (
              <SelectItem
                key={p.id}
                value={p.id}
                className="text-[13px]"
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
            className="w-[200px] h-9 text-[13px] focus:ring-0 focus-visible:ring-0"
            style={{
              background: "var(--theme-card-bg)",
              borderColor: "var(--theme-border)",
              color: "var(--theme-text-primary)",
              borderRadius: "var(--theme-radius)",
            }}
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent
            style={{
              background: "var(--theme-card-bg)",
              borderColor: "var(--theme-border)",
              borderRadius: "var(--theme-radius)",
            }}
          >
            {ENTITIES.map((e) => (
              <SelectItem
                key={e.id}
                value={e.id}
                className="text-[13px]"
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
      <span
        className="text-[10px] uppercase font-medium"
        style={{
          color: "var(--theme-text-tertiary)",
          letterSpacing: "0.32px",
        }}
      >
        {label}
      </span>
      {children}
    </div>
  );
}
