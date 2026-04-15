/**
 * Pac — scripted conversation flow for V2.
 *
 * Seven scenes, each a sequence of messages. Pills click through to
 * the next scene. No API calls. Typing delays simulate real AI.
 */

export type SceneId =
  | "opening"
  | "firstItem"
  | "knowledge"
  | "completion"
  | "skip"
  | "warning"
  | "wrapup";

export interface PillAction {
  label: string;
  next: SceneId;
}

export interface ScriptedMessage {
  id: string;
  sender: "pac" | "banker" | "system";
  /** HTML-ish content — the renderer escapes outer shell and honours a few tags. */
  content: string;
  /** ms to wait before this message appears (typing indicator shown during). */
  typingDelay: number;
  /** Optional actions rendered below this message. Only on the final pac message of a scene. */
  actions?: PillAction[];
  /** If set, running this message mutates checklist state (completes/skips an item). */
  sideEffect?:
    | { type: "complete"; itemId: string }
    | { type: "skip"; itemId: string; category: string };
}

export const SCENES: Record<SceneId, ScriptedMessage[]> = {
  // ═══════════════════════════════════════════════════════════════
  // Scene 1 — Opening (auto-plays on V2 mount)
  // ═══════════════════════════════════════════════════════════════
  opening: [
    {
      id: "opening-sys",
      sender: "system",
      content: "AI Teammate mode · All suggestions require banker review",
      typingDelay: 0,
    },
    {
      id: "opening-pac",
      sender: "pac",
      content:
        "Hi Sarah. I see you're working on the <strong>Meridian Logistics</strong> deal — bank guarantee, $850K performance bond.<br/><br/>You're in the <strong>Identification phase</strong> with 4 items remaining.<br/><br/>Want me to walk you through them?",
      typingDelay: 1500,
      actions: [
        { label: "Yes, guide me through", next: "firstItem" },
        { label: "Show me what's left", next: "firstItem" },
        { label: "I'll handle it myself", next: "firstItem" },
      ],
    },
  ],

  // ═══════════════════════════════════════════════════════════════
  // Scene 2 — First item guidance
  // ═══════════════════════════════════════════════════════════════
  firstItem: [
    {
      id: "fi-pac",
      sender: "pac",
      content:
        "Let's start with the most important one.<br/><br/><strong>Identify beneficial owners (≥25%)</strong><br/>🔒 Legally mandatory<br/><br/>I checked existing records — 2 of 3 owners are verified:<br/>• <strong>John Chen</strong> (Director, 40%) — ✓ verified<br/>• <strong>Lisa Chen</strong> (Director, 40%) — ✓ verified<br/><br/>The outstanding one:<br/>• <strong>Chen Family Trust</strong> (20%) — needs its beneficiary identified<br/><br/>The trust's adult beneficiary is <strong>Mr Wei Chen</strong>. Can you confirm his identity?",
      typingDelay: 2000,
      actions: [
        { label: "Upload Mr Wei Chen's ID", next: "completion" },
        { label: "Enter details manually", next: "completion" },
        { label: "I need more context on this", next: "knowledge" },
      ],
    },
  ],

  // ═══════════════════════════════════════════════════════════════
  // Scene 3 — Knowledge in conversation
  // ═══════════════════════════════════════════════════════════════
  knowledge: [
    {
      id: "kn-pac",
      sender: "pac",
      content:
        "Of course.<br/><br/>Under <strong>AUSTRAC's reform CDD</strong> (commenced 31 March 2026), banks must establish beneficial ownership on <em>'reasonable grounds.'</em> This replaced the old tick-box approach.<br/><br/>For corporate structures involving trusts, you need to identify the natural persons who ultimately control or benefit from the entity — not just the corporate trustees.<br/><br/>In this case: Chen Family Trust holds 20% of Meridian Logistics. Mr Wei Chen is the sole adult beneficiary of the trust, making him a beneficial owner of Meridian Logistics.<br/><br/>→ <em>AUSTRAC guidance: Beneficial ownership under reform CDD</em>",
      typingDelay: 1800,
      actions: [
        { label: "Got it — mark as complete ✓", next: "completion" },
        { label: "Upload Mr Wei Chen's ID", next: "completion" },
      ],
    },
  ],

  // ═══════════════════════════════════════════════════════════════
  // Scene 4 — Item completion + transition
  // ═══════════════════════════════════════════════════════════════
  completion: [
    {
      id: "cp-sys",
      sender: "system",
      content: "Beneficial owners — marked complete",
      typingDelay: 200,
      sideEffect: { type: "complete", itemId: "item-03" },
    },
    {
      id: "cp-pac",
      sender: "pac",
      content:
        "<strong>Beneficial owners</strong> — verified. ✓<br/><br/>Ready to Submit updated.<br/><br/>Next up: <strong>Source of funds declaration</strong><br/>🔒 Legally mandatory<br/><br/>This one needs the customer to provide. Want me to draft a request email to Meridian Logistics?",
      typingDelay: 1200,
      actions: [
        { label: "Draft request email", next: "warning" },
        { label: "Mark as waiting on customer", next: "warning" },
        { label: "Skip — already received outside BizEdge", next: "skip" },
      ],
    },
  ],

  // ═══════════════════════════════════════════════════════════════
  // Scene 5 — Skip via conversation
  // ═══════════════════════════════════════════════════════════════
  skip: [
    {
      id: "sk-pac",
      sender: "pac",
      content:
        "Understood. I'll log this as:<br/><br/>📋 Skip reason: <em>'Documentation provided outside BizEdge'</em><br/><br/>⚠ <strong>Note:</strong> this item is legally mandatory. The declaration must be uploaded before deal submission, even if received externally. I'll flag this for follow-up.<br/><br/>Ready to Submit reflects skip with documented reason.",
      typingDelay: 1500,
      sideEffect: {
        type: "skip",
        itemId: "item-07",
        category: "Documentation provided outside the platform",
      },
    },
    {
      id: "sk-sys",
      sender: "system",
      content: "Source of funds — skipped with reason (logged)",
      typingDelay: 200,
    },
    {
      id: "sk-pac2",
      sender: "pac",
      content: "Ready to move on?",
      typingDelay: 900,
      actions: [
        { label: "Yes, next item", next: "warning" },
        { label: "Show me the summary", next: "wrapup" },
      ],
    },
  ],

  // ═══════════════════════════════════════════════════════════════
  // Scene 6 — Proactive warning
  // ═══════════════════════════════════════════════════════════════
  warning: [
    {
      id: "wr-pac",
      sender: "pac",
      content:
        "Next: <strong>Upload performance guarantee template</strong><br/><br/>💡 <strong>Heads up</strong> — this is bank-guarantee specific. Your usual term loan flow doesn't include this step.<br/><br/>Current template version: <strong>BG-NSW-2026.01</strong> (revised January 2026). There have been 3 revisions in 2 years, so make sure you're using the latest.<br/><br/>For NSW construction contracts, use the standard performance bond wording. I can pull up the template for you.",
      typingDelay: 2000,
      actions: [
        { label: "Pull up template", next: "wrapup" },
        { label: "Upload my own", next: "wrapup" },
        { label: "Skip — customer's lawyer preparing", next: "wrapup" },
      ],
    },
  ],

  // ═══════════════════════════════════════════════════════════════
  // Scene 7 — Wrap-up
  // ═══════════════════════════════════════════════════════════════
  wrapup: [
    {
      id: "wu-pac",
      sender: "pac",
      content:
        "Good progress. Here's where we stand:<br/><br/><strong>Identification phase:</strong><br/>• 3 of 6 items complete<br/>• 1 skipped with logged reason<br/>• 2 remaining<br/><br/><strong>Typical at this stage: 50–65%</strong><br/><strong>Submit threshold: 90%+</strong><br/><br/>The remaining items are customer-dependent. Once they provide the documents, I'll auto-verify and update the score.<br/><br/>Anything else you want to work on, or should I prepare a summary for your records?",
      typingDelay: 1500,
      actions: [
        { label: "Prepare summary", next: "wrapup" },
        { label: "Continue to next item", next: "wrapup" },
        { label: "Switch to checklist view", next: "wrapup" },
      ],
    },
  ],
};

export const FALLBACK_MESSAGE: ScriptedMessage = {
  id: "fallback",
  sender: "pac",
  content:
    "I understand. Let me continue with the next item in your checklist.<br/><br/><em>This is a demo — in production, I'd understand natural language input.</em>",
  typingDelay: 1000,
};
