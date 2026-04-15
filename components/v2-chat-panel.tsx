"use client";

/**
 * V2 — Pac AI teammate side panel.
 *
 * Always-visible 400px sidebar alongside the V1 main work area.
 * Event-driven: reacts to state changes in the main area (step,
 * focused item, completion, skip) by appending new Pac messages to
 * the chat timeline.
 *
 * Chat threading pattern:
 *   - First Pac message = full intro card with big avatar + name
 *   - Subsequent Pac messages = compact 28px avatar on the left
 *   - Same-speaker continuation within 30s = avatar omitted, text
 *     aligned into the avatar column
 *   - Banker messages = right-aligned maroon bubble + small 'S' avatar
 */
import { useEffect, useRef, useState } from "react";
import type { ChecklistItem as CI, Deal } from "@/lib/types";
import { PacAvatar } from "@/components/pac-avatar";
import { Send, UserCircle2 } from "lucide-react";
import { productLabel } from "@/data/product-options";
import { useFlowMode } from "@/lib/flow-mode-context";

// ——— Message types ———
type Sender = "pac" | "banker" | "system";

interface TimelineMessage {
  id: string;
  sender: Sender;
  /** HTML-ish content — string-based for speed */
  content: string;
  /** If true this is a full intro card (first Pac message) */
  intro?: boolean;
  /** Milliseconds at which the message was created */
  createdAt: number;
}

interface Props {
  deal: Deal;
  currentFocusedItem: CI | null;
  readinessScore: number;
}

// First-mount intro. Everything else is event-driven via props.
function buildIntro(bankerFirstName: string): TimelineMessage {
  return {
    id: "intro",
    sender: "pac",
    intro: true,
    createdAt: Date.now(),
    content:
      `Hi ${bankerFirstName}. I'm watching this deal alongside you. ` +
      `Pick a product in the main area and I'll surface contextual ` +
      `guidance as you go — checking what's legally mandatory, ` +
      `flagging rare-product risks, and explaining the AUSTRAC reform ` +
      `moves.`,
  };
}

const PAC_HUMAN_GAP_MS = 30_000;

export function V2ChatPanel({ deal, currentFocusedItem, readinessScore }: Props) {
  const { step, draft } = useFlowMode();
  const firstName = deal.banker.name.split(" ")[0] || "there";

  const [timeline, setTimeline] = useState<TimelineMessage[]>(() => [
    buildIntro(firstName),
  ]);
  const [freeText, setFreeText] = useState("");
  const [pacTyping, setPacTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // ——— Event detection refs ———
  // We track the last value of each tracked piece of state so the
  // useEffect only appends a new message when something truly changes.
  const lastProduct = useRef(draft.product);
  const lastStep = useRef(step);
  const lastFocusedItemId = useRef<string | null>(null);
  const lastCompletedItemId = useRef<string | null>(null);
  const lastSkippedItemId = useRef<string | null>(null);

  // Push a Pac message with a brief typing delay so it feels alive.
  function pushPac(content: string) {
    setPacTyping(true);
    setTimeout(() => {
      setTimeline((t) => [
        ...t,
        {
          id: `pac-${Date.now()}-${Math.random()}`,
          sender: "pac",
          content,
          createdAt: Date.now(),
        },
      ]);
      setPacTyping(false);
    }, 900);
  }

  function pushBanker(content: string) {
    setTimeline((t) => [
      ...t,
      {
        id: `banker-${Date.now()}`,
        sender: "banker",
        content: escapeHtml(content),
        createdAt: Date.now(),
      },
    ]);
  }

  // ——— Sync reaction 1: product selection in empty state ———
  useEffect(() => {
    if (step !== "empty") return;
    if (draft.product && draft.product !== lastProduct.current) {
      lastProduct.current = draft.product;
      const label = productLabel(draft.product);
      pushPac(
        `<strong>${label}</strong> — good choice. I'll surface the ` +
        `entity-specific requirements as you configure. Let me know if ` +
        `you want context on the rare-product items.`,
      );
    }
  }, [draft.product, step]);

  // ——— Sync reaction 2: step transitions ———
  useEffect(() => {
    if (step === lastStep.current) return;
    const prev = lastStep.current;
    lastStep.current = step;

    if (step === "creator") {
      pushPac(
        `Once you submit the customer details, I'll build out the ` +
        `checklist and watch for items that need a second pair of eyes.`,
      );
    } else if (step === "loading") {
      pushPac(
        `Building your checklist. I'm auto-verifying the Setup items ` +
        `against system sources — you'll see them resolve in order with ` +
        `provenance tags. That's <strong>D6</strong> at work.`,
      );
    } else if (step === "focused" && prev === "loading") {
      pushPac(
        `Setup done — 3 items auto-verified. <strong>Ready to Submit: 12%</strong>. ` +
        `Now we're in <strong>Identification</strong> — 6 items, 3 need your input. ` +
        `First up is beneficial owners, which is legally mandatory under ` +
        `the AUSTRAC reform.`,
      );
    } else if (step === "showAll") {
      pushPac(
        `Showing all items in the current phase. Click any row to ` +
        `focus it. The list shows owner and status at a glance.`,
      );
    } else if (step === "focused" && prev === "showAll") {
      pushPac(`Back to guided mode. Let me know if you need context.`);
    }
  }, [step]);

  // ——— Sync reaction 3: focused item changes ———
  useEffect(() => {
    if (!currentFocusedItem) {
      lastFocusedItemId.current = null;
      return;
    }
    if (currentFocusedItem.id === lastFocusedItemId.current) return;
    lastFocusedItemId.current = currentFocusedItem.id;
    // Only announce focus changes AFTER the initial entry to focused step
    if (step !== "focused") return;
    if (timeline.length < 3) return; // skip the very first auto-selection

    const mandatory = currentFocusedItem.legallyMandatory
      ? "🔒 <strong>Legally mandatory</strong> — can't skip this one."
      : "Optional if you have a valid reason to skip.";
    pushPac(
      `Next up: <strong>${currentFocusedItem.label}</strong>.<br/>${mandatory}`,
    );
  }, [currentFocusedItem?.id, step]);

  // ——— Auto-scroll on new entries ———
  useEffect(() => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [timeline, pacTyping]);

  function handleSendFreeText(e: React.FormEvent) {
    e.preventDefault();
    const text = freeText.trim();
    if (!text) return;
    pushBanker(text);
    setFreeText("");
    setTimeout(() => {
      pushPac(
        `Understood. <em>This is a demo — in production I'd parse ` +
        `natural language here. For the interview, the pill buttons ` +
        `drive the actual interactions.</em>`,
      );
    }, 300);
  }

  return (
    <aside
      className="flex flex-col min-w-0 h-full"
      style={{
        background: "var(--theme-page-bg)",
        borderLeft: "1px solid var(--theme-border)",
      }}
    >
      {/* Panel header — Pac status */}
      <div
        className="px-4 py-3 flex items-center gap-3 shrink-0"
        style={{
          background: "var(--theme-card-bg)",
          borderBottom: "1px solid var(--theme-border)",
        }}
      >
        <PacAvatar size={32} state={pacTyping ? "speaking" : "idle"} />
        <div className="min-w-0">
          <div
            className="text-[13px] font-semibold leading-tight"
            style={{ color: "var(--theme-text-primary)" }}
          >
            Pac
          </div>
          <div className="flex items-center gap-1.5 text-[10px]">
            <span
              className="inline-block w-1.5 h-1.5"
              style={{
                background: "#2e7d32",
                borderRadius: "50%",
                animation: "pac-typing 1.4s ease-in-out infinite",
              }}
            />
            <span style={{ color: "var(--theme-text-secondary)" }}>
              Active · Westpac AI teammate
            </span>
          </div>
        </div>
      </div>

      {/* Scrollable chat */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 py-4 space-y-3"
      >
        {timeline.map((msg, i) => {
          const prev = timeline[i - 1];
          const sameSpeakerContinuation =
            prev &&
            prev.sender === msg.sender &&
            msg.createdAt - prev.createdAt < PAC_HUMAN_GAP_MS;
          return (
            <MessageBubble
              key={msg.id}
              message={msg}
              compactContinuation={sameSpeakerContinuation}
              firstName={firstName}
            />
          );
        })}
        {pacTyping ? <TypingIndicator /> : null}
      </div>

      {/* Input */}
      <form
        onSubmit={handleSendFreeText}
        className="shrink-0 p-3 flex items-center gap-2"
        style={{ borderTop: "1px solid var(--theme-border)" }}
      >
        <input
          type="text"
          value={freeText}
          onChange={(e) => setFreeText(e.target.value)}
          placeholder="Ask Pac anything about this deal…"
          className="flex-1 h-9 px-3 text-[12px] focus:outline-none focus-visible:ring-2 min-w-0"
          style={{
            background: "var(--theme-card-bg)",
            border: "1px solid var(--theme-border-strong)",
            borderRadius: "var(--theme-radius)",
            color: "var(--theme-text-primary)",
          }}
        />
        <button
          type="submit"
          disabled={!freeText.trim()}
          className="inline-flex items-center justify-center w-9 h-9 text-white disabled:opacity-40"
          style={{
            background: "var(--theme-primary)",
            borderRadius: "var(--theme-radius)",
          }}
          aria-label="Send"
        >
          <Send size={13} strokeWidth={2.5} />
        </button>
      </form>
    </aside>
  );
}

// ——— Message rendering ———
function MessageBubble({
  message,
  compactContinuation,
  firstName,
}: {
  message: TimelineMessage;
  compactContinuation: boolean;
  firstName: string;
}) {
  if (message.sender === "system") {
    return (
      <div
        className="text-center text-[10px] uppercase font-semibold py-1"
        style={{
          color: "var(--theme-text-tertiary)",
          letterSpacing: "0.5px",
        }}
      >
        {message.content}
      </div>
    );
  }

  if (message.sender === "banker") {
    return (
      <div className="flex items-start gap-2 justify-end">
        <div
          className="px-3 py-2 text-[12px] leading-[1.5] max-w-[260px]"
          style={{
            background: "var(--theme-primary)",
            color: "var(--theme-primary-fg)",
            borderRadius: "var(--theme-radius-lg)",
            borderTopRightRadius: "4px",
          }}
          dangerouslySetInnerHTML={{ __html: message.content }}
        />
        <div
          className="flex items-center justify-center w-6 h-6 shrink-0 text-[10px] font-bold text-white"
          style={{
            background: "var(--theme-text-primary)",
            borderRadius: "50%",
          }}
        >
          {firstName[0]?.toUpperCase() ?? "S"}
        </div>
      </div>
    );
  }

  // Pac message
  if (message.intro) {
    return (
      <div
        className="p-4 flex flex-col gap-2"
        style={{
          background: "var(--theme-card-bg)",
          border: "1px solid var(--theme-border)",
          borderRadius: "var(--theme-radius-lg)",
        }}
      >
        <div className="flex items-center gap-3">
          <PacAvatar size={42} state="idle" />
          <div className="leading-tight">
            <div
              className="text-[14px] font-semibold"
              style={{ color: "var(--theme-text-primary)" }}
            >
              Pac
            </div>
            <div
              className="text-[10px] uppercase font-medium mt-0.5"
              style={{
                color: "var(--theme-text-tertiary)",
                letterSpacing: "0.5px",
              }}
            >
              Westpac AI teammate
            </div>
          </div>
        </div>
        <div
          className="text-[12px] leading-[1.55] mt-1"
          style={{ color: "var(--theme-text-primary)" }}
          dangerouslySetInnerHTML={{ __html: message.content }}
        />
      </div>
    );
  }

  // Compact pac message
  return (
    <div className="flex items-start gap-2">
      {compactContinuation ? (
        <div className="w-7 shrink-0" aria-hidden="true" />
      ) : (
        <div className="shrink-0 pt-0.5">
          <PacAvatar size={26} state="idle" />
        </div>
      )}
      <div
        className="flex-1 min-w-0 px-3 py-2 text-[12px] leading-[1.55]"
        style={{
          background: "var(--theme-card-bg)",
          border: "1px solid var(--theme-border)",
          borderRadius: "var(--theme-radius-lg)",
          borderTopLeftRadius: compactContinuation ? "var(--theme-radius-lg)" : "4px",
          color: "var(--theme-text-primary)",
        }}
        dangerouslySetInnerHTML={{ __html: message.content }}
      />
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex items-start gap-2">
      <div className="shrink-0 pt-0.5">
        <PacAvatar size={26} state="speaking" />
      </div>
      <div
        className="inline-flex items-center gap-1 px-3 py-2.5"
        style={{
          background: "var(--theme-card-bg)",
          border: "1px solid var(--theme-border)",
          borderRadius: "var(--theme-radius-lg)",
          borderTopLeftRadius: "4px",
        }}
      >
        <Dot delay={0} />
        <Dot delay={150} />
        <Dot delay={300} />
      </div>
    </div>
  );
}

function Dot({ delay }: { delay: number }) {
  return (
    <span
      className="inline-block w-1.5 h-1.5"
      style={{
        background: "var(--theme-text-tertiary)",
        borderRadius: "50%",
        animation: `pac-typing 1.2s ease-in-out ${delay}ms infinite`,
      }}
    />
  );
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
