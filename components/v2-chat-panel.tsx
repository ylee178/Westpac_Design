"use client";

/**
 * V2 — Pac AI teammate side panel.
 *
 * Three fixed zones:
 *   1. Header     — Pac avatar + status
 *   2. Briefing   — product+stage-aware context card (reactive, NOT chat)
 *   3. Chat area  — empty until the banker types or taps a suggestion
 *   4. Pills      — common questions that update with product / stage
 *   5. Input      — free text
 *
 * Pac no longer auto-announces every click. The briefing + pill
 * questions refresh silently when the product or the flow step
 * changes. A chat message is only appended when the banker actually
 * asks something (free text) or taps a suggested question pill.
 */
import { useEffect, useRef, useState } from "react";
import type { ChecklistItem as CI, Deal } from "@/lib/types";
import { PacAvatar } from "@/components/pac-avatar";
import { Send } from "lucide-react";
import { useFlowMode } from "@/lib/flow-mode-context";
import {
  getBriefing,
  getSuggestions,
  type Suggestion,
} from "@/data/pac-briefings";

// ——— Message types ———
type Sender = "pac" | "banker";

interface TimelineMessage {
  id: string;
  sender: Sender;
  /** HTML-ish content — string-based for speed */
  content: string;
  /** Milliseconds at which the message was created */
  createdAt: number;
}

interface Props {
  deal: Deal;
  currentFocusedItem: CI | null;
  readinessScore: number;
}

// Lending-themed "thinking" verbs for the shimmering status text.
const STATUS_VERBS = [
  "Underwriting",
  "Cross-checking AUSTRAC guidance",
  "Reviewing the deal profile",
  "Reconciling sources",
  "Crystallising a response",
  "Calibrating risk context",
];

const PAC_HUMAN_GAP_MS = 30_000;

export function V2ChatPanel({ deal, currentFocusedItem }: Props) {
  const { step, draft } = useFlowMode();
  const firstName = deal.banker.name.split(" ")[0] || "there";

  const [timeline, setTimeline] = useState<TimelineMessage[]>([]);
  const [freeText, setFreeText] = useState("");
  const [pacTyping, setPacTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Briefing + pills are DERIVED directly from current product/step.
  // No effects, no auto-push, no side effects.
  const briefing = getBriefing(draft.product, step);
  const suggestions = getSuggestions(draft.product, step);

  function pushPac(content: string) {
    setPacTyping(true);
    // Long enough for the shimmer sweep to make at least one full
    // visible cycle before Pac's reply lands.
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
    }, 2000);
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

  function handlePillTap(s: Suggestion) {
    pushBanker(s.question);
    setTimeout(() => pushPac(s.answer), 200);
  }

  function handleSendFreeText(e: React.FormEvent) {
    e.preventDefault();
    const text = freeText.trim();
    if (!text) return;
    pushBanker(text);
    setFreeText("");
    setTimeout(() => {
      pushPac(
        `Understood. <em>Demo note — in production I'd parse natural ` +
          `language here. For this interview prototype the pill buttons ` +
          `drive the scripted flow.</em>`,
      );
    }, 300);
  }

  // Auto-scroll chat on new entries.
  useEffect(() => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [timeline, pacTyping]);

  return (
    <aside
      className="flex flex-col min-w-0 h-full"
      style={{
        background: "var(--theme-page-bg)",
        borderLeft: "1px solid var(--theme-border)",
      }}
    >
      {/* ——— Header: Pac status strip ——— */}
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
              style={{ background: "#2e7d32", borderRadius: "50%" }}
            />
            <span style={{ color: "var(--theme-text-secondary)" }}>
              Active · Westpac AI teammate
            </span>
          </div>
        </div>
      </div>

      {/* ——— Briefing card (reactive, not chat) ——— */}
      <BriefingCard briefing={briefing} firstName={firstName} />

      {/* ——— Chat thread ——— */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 py-3 space-y-3"
      >
        {timeline.length === 0 && !pacTyping ? (
          <div
            className="text-center text-[11px] py-4"
            style={{ color: "var(--theme-text-tertiary)" }}
          >
            Tap a question below, or ask me anything.
          </div>
        ) : (
          timeline.map((msg, i) => {
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
          })
        )}
        {pacTyping ? <TypingIndicator /> : null}
      </div>

      {/* ——— Suggestion pills (reactive) ——— */}
      <SuggestionPills
        suggestions={suggestions}
        onTap={handlePillTap}
      />

      {/* ——— Input ——— */}
      <form
        onSubmit={handleSendFreeText}
        className="shrink-0 p-3 flex items-center gap-2"
        style={{
          borderTop: "1px solid var(--theme-border)",
          background: "var(--theme-card-bg)",
        }}
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
          className="interactive-primary inline-flex items-center justify-center w-9 h-9 text-white disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
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

// ——— Briefing card ———
function BriefingCard({
  briefing,
  firstName,
}: {
  briefing: ReturnType<typeof getBriefing>;
  firstName: string;
}) {
  return (
    <section
      className="shrink-0 px-4 pt-3 pb-3"
      style={{
        background: "var(--theme-card-bg)",
        borderBottom: "1px solid var(--theme-border)",
      }}
    >
      <div
        className="flex items-start gap-3 p-3"
        style={{
          background: "var(--westpac-primary-soft)",
          border: "1px solid var(--westpac-primary-border)",
          borderRadius: "var(--theme-radius-lg)",
        }}
      >
        <PacAvatar size={28} state="idle" />
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline gap-2 flex-wrap">
            <span
              className="text-[13px] font-semibold"
              style={{ color: "var(--theme-text-primary)" }}
            >
              {briefing.title}
            </span>
            <span
              className="text-[11px]"
              style={{ color: "var(--theme-text-secondary)" }}
            >
              {briefing.subtitle}
            </span>
          </div>
          <ul className="mt-2 space-y-1.5">
            {briefing.bullets.map((b, i) => (
              <li
                key={i}
                className="flex items-start gap-2 text-[11px] leading-[1.45]"
                style={{ color: "var(--theme-text-primary)" }}
              >
                <span
                  className="inline-block w-1 h-1 mt-[6px] shrink-0"
                  style={{
                    background: "var(--theme-primary)",
                    borderRadius: "50%",
                  }}
                />
                <span
                  dangerouslySetInnerHTML={{
                    __html: b.replace(
                      /^(Hi)\b/,
                      `Hi ${escapeHtml(firstName)},`,
                    ),
                  }}
                />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

// ——— Suggestion pills ———
function SuggestionPills({
  suggestions,
  onTap,
}: {
  suggestions: Suggestion[];
  onTap: (s: Suggestion) => void;
}) {
  return (
    <div
      className="shrink-0 px-3 py-2.5"
      style={{
        background: "var(--theme-card-bg)",
        borderTop: "1px solid var(--theme-border)",
      }}
    >
      <div
        className="text-[9px] uppercase font-semibold mb-2 px-1"
        style={{
          color: "var(--theme-text-tertiary)",
          letterSpacing: "0.5px",
        }}
      >
        Common questions
      </div>
      <div className="flex flex-col gap-1.5">
        {suggestions.map((s, i) => (
          <button
            key={i}
            type="button"
            onClick={() => onTap(s)}
            className="interactive-pill text-left px-3 py-2 text-[11.5px] leading-[1.35] font-medium cursor-pointer"
            style={{
              background: "var(--theme-card-bg)",
              color: "var(--theme-text-primary)",
              border: "1px solid var(--theme-border-strong)",
              borderRadius: "var(--theme-radius)",
            }}
          >
            {s.question}
          </button>
        ))}
      </div>
    </div>
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
  if (message.sender === "banker") {
    return (
      <div className="flex items-start gap-2 justify-end">
        <div
          className="px-3 py-2 max-w-[260px]"
          style={{
            background: "var(--theme-primary)",
            borderRadius: "var(--theme-radius-lg)",
            borderTopRightRadius: "4px",
          }}
        >
          <span
            className="text-[12px] leading-[1.5] block"
            style={{ color: "#ffffff" }}
            dangerouslySetInnerHTML={{ __html: message.content }}
          />
        </div>
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

  // Compact Pac message
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
        className="flex-1 min-w-0 px-3 py-2"
        style={{
          background: "var(--theme-card-bg)",
          border: "1px solid var(--theme-border)",
          borderRadius: "var(--theme-radius-lg)",
          borderTopLeftRadius: compactContinuation
            ? "var(--theme-radius-lg)"
            : "4px",
        }}
      >
        <span
          className="text-[12px] leading-[1.55] block"
          style={{ color: "var(--theme-text-primary)" }}
          dangerouslySetInnerHTML={{ __html: message.content }}
        />
      </div>
    </div>
  );
}

function TypingIndicator() {
  const [verbIdx, setVerbIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(
      () => setVerbIdx((i) => (i + 1) % STATUS_VERBS.length),
      1600,
    );
    return () => clearInterval(t);
  }, []);
  // NOTE: no `key` on the span — if React re-mounts the element on
  // verb change, the shimmer-sweep animation restarts from zero and
  // the user never sees a full cycle. Keeping the same span keeps
  // the infinite animation running across verb swaps.
  return (
    <div className="flex items-start gap-2">
      <div className="shrink-0 pt-0.5">
        <PacAvatar size={26} state="speaking" />
      </div>
      <div
        className="inline-flex items-center px-3 py-2"
        style={{
          background: "var(--theme-card-bg)",
          border: "1px solid var(--theme-border)",
          borderRadius: "var(--theme-radius-lg)",
          borderTopLeftRadius: "4px",
          minHeight: "32px",
        }}
      >
        <span className="shimmer-text text-[12px] tracking-[0.16px]">
          {STATUS_VERBS[verbIdx]}…
        </span>
      </div>
    </div>
  );
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
