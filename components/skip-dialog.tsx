"use client";

/**
 * D2 — Skip dialog with structured reason picker + "Other" safety valve.
 * Submit button is disabled until the banker makes a deliberate choice.
 * Address D2's known failure mode (lazy free-text reasons → audit noise).
 */
import { useState } from "react";
import type { ChecklistItem } from "@/lib/types";
import { SKIP_REASON_OPTIONS } from "@/data/deal-data";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { AlertTriangle } from "lucide-react";

interface Props {
  open: boolean;
  item: ChecklistItem | null;
  onCancel: () => void;
  onConfirm: (payload: { category: string; freeText?: string }) => void;
}

export function SkipDialog({ open, item, onCancel, onConfirm }: Props) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [freeText, setFreeText] = useState("");

  // Derived — Submit is enabled only when a category is picked AND, if "Other",
  // free text is non-empty.
  const canSubmit =
    selectedId !== null &&
    (selectedId !== "other" || freeText.trim().length > 0);

  function handleConfirm() {
    if (!selectedId) return;
    const option = SKIP_REASON_OPTIONS.find((o) => o.id === selectedId);
    onConfirm({
      category: option?.label ?? selectedId,
      freeText: selectedId === "other" ? freeText.trim() : undefined,
    });
    // Reset for next open
    setSelectedId(null);
    setFreeText("");
  }

  function handleCancel() {
    setSelectedId(null);
    setFreeText("");
    onCancel();
  }

  return (
    <Dialog open={open} onOpenChange={(o) => (o ? null : handleCancel())}>
      <DialogContent
        className="max-w-[560px] p-0"
        style={{
          background: "var(--theme-card-bg)",
          borderColor: "var(--theme-border-strong)",
          borderRadius: "var(--theme-radius-lg)",
        }}
      >
        <DialogHeader
          className="px-6 pt-5 pb-3"
          style={{ borderBottom: "1px solid var(--theme-border)" }}
        >
          <div
            className="text-[10px] uppercase font-medium flex items-center gap-1.5"
            style={{
              color: "var(--theme-text-tertiary)",
              letterSpacing: "0.5px",
            }}
          >
            <AlertTriangle size={11} strokeWidth={2} />
            Skip with reason · D2
          </div>
          <DialogTitle
            className="text-[18px] leading-[1.35] mt-1 font-medium"
            style={{ color: "var(--theme-text-primary)" }}
          >
            {item ? item.label : "Skip this step"}
          </DialogTitle>
          <DialogDescription
            className="text-[13px] leading-[1.5] mt-1"
            style={{ color: "var(--theme-text-secondary)" }}
          >
            Select a reason category below. If none match, choose
            "Other" and describe briefly. Logged to the audit trail.
          </DialogDescription>
        </DialogHeader>

        <div className="px-6 py-4 space-y-2.5 max-h-[400px] overflow-y-auto">
          {SKIP_REASON_OPTIONS.map((opt) => {
            const selected = selectedId === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => setSelectedId(opt.id)}
                className="w-full text-left px-4 py-3 border transition-colors"
                style={{
                  backgroundColor: selected
                    ? "var(--theme-accent-bg)"
                    : "var(--theme-card-bg)",
                  borderColor: selected
                    ? "var(--theme-primary)"
                    : "var(--theme-border)",
                  borderWidth: selected ? "2px" : "1px",
                  borderRadius: "var(--theme-radius)",
                }}
              >
                <div
                  className="text-[13px] font-semibold leading-[1.3] text-[#161616]"
                >
                  {opt.label}
                </div>
                {opt.description ? (
                  <div className="text-[12px] text-[#525252] mt-1 leading-[1.4] tracking-[0.16px]">
                    {opt.description}
                  </div>
                ) : null}
              </button>
            );
          })}

          {selectedId === "other" ? (
            <div className="pt-2">
              <Label
                htmlFor="skip-freetext"
                className="text-[11px] uppercase tracking-[0.5px] text-[#525252] font-normal"
              >
                Describe the reason
              </Label>
              <Input
                id="skip-freetext"
                value={freeText}
                onChange={(e) => setFreeText(e.target.value)}
                placeholder="Brief explanation (required)"
                className="mt-1 h-10 border-0 border-b-2 focus-visible:ring-0"
                style={{
                  backgroundColor: "var(--theme-surface-subtle)",
                  borderBottomColor: "var(--theme-text-primary)",
                  borderRadius: "var(--theme-radius) var(--theme-radius) 0 0",
                }}
              />
            </div>
          ) : null}
        </div>

        <DialogFooter
          className="px-0 py-0 flex-row gap-0 sm:gap-0"
          style={{ borderTop: "1px solid var(--theme-border)" }}
        >
          <Button
            variant="ghost"
            onClick={handleCancel}
            className="flex-1 h-11 rounded-none text-[13px] font-medium"
            style={{ color: "var(--theme-text-primary)" }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!canSubmit}
            className="flex-1 h-11 rounded-none text-[13px] font-medium text-white"
            style={{
              background: canSubmit
                ? "var(--theme-primary)"
                : "var(--theme-border-strong)",
              borderLeft: "1px solid var(--theme-border)",
            }}
          >
            Skip with reason
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
