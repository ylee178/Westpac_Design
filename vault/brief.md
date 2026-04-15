Design Challenge — Senior Experience Designer (~3 hours)
Format: Take-home challenge
Time allowance: 2–3 hours
Presentation: 20 min walkthrough during your interview
Scenario
You're designing for a new business lending originations platform used by bankers to create and submit deals. The platform supports multiple product types (e.g., business loans, overdrafts, guarantees) — each with different data requirements and compliance checks.
Through research, you've discovered:
•	New bankers are prone to errors in deal setup and tend to learn through trial and error
•	Experienced bankers often have to resubmit deals because they skip key steps for less common product types
•	There is currently no single view that shows a banker where they are in the deal lifecycle or what's outstanding
Your Task
Design a checklist-style home page for a single deal that helps bankers navigate deal origination with confidence.
What to Deliver
1.	Design Thinking — Outline your approach to the problem. What activities you would undertake to approach the challenge, how you understand the problem and your key assumptions.
2.	UI Design — Produce low-to-mid fidelity screens or wireframes that illustrate key interaction patterns.
3.	Rationale — Provide the reasons behind your design decisions and any trade-offs made.
Deliverable Format
•	Submit as a PDF, Figma link, or slide deck
•	We value clarity of thinking over visual polish — annotated wireframes and written rationale are more valuable than high-fidelity mockups
•	Be prepared to walk us through your submission during the interview and discuss trade-offs, alternative approaches, and how you'd iterate with feedback

---

## Reframed Three Pains

### #new-banker-errors

**Brief wording:** "New bankers are prone to errors in deal setup and tend to learn through trial and error"

**Reframe:** Not a knowledge gap, but a *when and why* gap. New bankers know tasks exist but don't know when each is needed or why it matters for this specific deal.

### #senior-skip

**Brief wording:** "Experienced bankers often have to resubmit deals because they skip key steps for less common product types"

**Reframe:** Not a knowledge gap, but a *variation visibility* gap. Senior bankers' muscle memory is optimized for common products; rare-product variations don't visually break through that default pattern.

### #no-single-view

**Brief wording:** "There is currently no single view that shows a banker where they are in the deal lifecycle or what's outstanding"

**Reframe:** Not a dashboard gap, but a *guided workflow* gap. The industry standard "single view" in modern LOS (nCino, Moody's, Baker Hill) means "single guided workflow surface," not "all information visible at once." The real need is: next unresolved action always surfaced, with context.

### Common root

All three pains share one underlying cause: **context scarcity**. Context is missing across three dimensions:

- **Spatial context** (where am I in the deal lifecycle) → addressed by progress spine
- **Procedural context** (what do I do next) → addressed by dynamic checklist
- **Diagnostic context** (why this is needed, what's different here) → addressed by inline guidance and LLM wiki layer
