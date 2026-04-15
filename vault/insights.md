# Insights for Westpac Design Challenge
# Senior Experience Designer — Business Transaction Banking
# Last updated: 14 April 2026

> This document is the foundation for the design decisions (see decisions.md).
> Every design choice traces back to one or more insights here.

---

## The role itself

The posting is **Senior Experience Designer - Business Lending 
(Origination Platform)**. This is a platform-specific hire, not a 
generic product design role. The scope is explicitly the BizEdge 
origination platform — Westpac's business lending origination system 
from deal setup through approval and settlement.

Key implications for how I approach the challenge:

1. **Platform-specific, not conceptual.** I'm designing inside BizEdge, 
   not inventing a new banking product. Every design decision has to 
   fit the platform Westpac has already committed to and is actively 
   rolling out.

2. **Origination lifecycle, not transaction banking.** My scope is 
   "deal from lead to settlement." Post-settlement account operations 
   and transaction banking are a different role and a different team.

3. **Dual user reality.** BizEdge is primarily banker-facing, but 
   origination involves customer touchpoints (application forms, 
   document uploads, status). The deal home page I'm designing is 
   banker-facing, but it sits inside a larger journey where customer 
   actions feed state back into banker workspace.

4. **Senior-level expectation.** This role asks for design decisions 
   under complexity, not just craft execution. That's why my 
   presentation emphasizes the reasoning and trade-offs behind each 
   decision, not just the screens.

---

## Business context

### Westpac is chasing NAB and CBA in business lending
- **Business lending market share (July 2025, Reuters):** Westpac 16.1%, 
  CBA 18.85%, NAB 21.6%. Westpac is narrowing the gap but still trails.
- **Strategy:** Business lending is positioned as a core profit driver, 
  not a side portfolio. Paul Fowler (Chief Executive, Business & Wealth) 
  has publicly framed it as a "shift in emphasis" back to business banking.
- **FY25 results:** Australian business lending up 14% to $221.8bn. Net 
  profit down 1%. Margin pressure is real — Westpac can't just buy growth 
  through lower rates.

### Business & Wealth division is strategically critical
- **H1 FY25 profit contribution:** A$1,096M = approximately 33% of 
  Westpac Group's net profit attributable to owners (A$3,317M)
- **Loan growth:** Australian business lending +5% in H1 FY25, average 
  business loans +10% year-on-year
- Implication: design work on business lending origination is directly 
  connected to the profit engine of the bank.

### Hiring signal
- **November 2024 announcement (primary source, Westpac):** commitment 
  to 200 additional business bankers by end-2027 (a ~40% increase in 
  SME banker cohort).
- **September 2025 (Reuters, citing Paul Fowler briefing):** target 
  expanded to 350 bankers over two years, with 135 already hired in 2025.
- **Design implication:** hundreds of new bankers need to become 
  productive fast. Their learning curve is a business bottleneck, not 
  just a training concern.

### The 2020 AUSTRAC case — why compliance has outsized weight at Westpac
- **$1.3B civil penalty ordered 21 October 2020** by the Federal Court of 
  Australia (case: *Chief Executive Officer of AUSTRAC v Westpac Banking 
  Corporation* [2020] FCA 1538). Still the largest corporate fine in 
  Australian history.
- **23+ million admitted contraventions of the AML/CTF Act**, including:
  - 19.5M+ unreported International Funds Transfer Instructions (IFTIs) 
    worth over $11bn, across ~5 years
  - Failure to pass source-of-funds information to downstream banks in 
    the transfer chain
  - Failure to monitor transactions consistent with child exploitation — 
    AUSTRAC initially flagged 12 customers; a review identified 250 more 
    with suspicious transfers to the Philippines, SE Asia, and Mexico
  - ~76,000 additional contraventions, including correspondent-banking 
    ML/TF risk-assessment failures
- **Westpac response:** admitted the contraventions, agreed the proposed 
  penalty with AUSTRAC (September 2020), and publicly committed to 
  uplifting AML/CTF controls, data systems, policies, and processes.
- **Sources (primary):** AUSTRAC media releases (austrac.gov.au); Federal 
  Court judgment [2020] FCA 1538 (judgments.fedcourt.gov.au); Westpac 
  ASX Release 4 June 2020.

**Design implication:** The 31 March 2026 AUSTRAC reform does not land 
at Westpac as a neutral regulatory update. It lands at a bank that has 
already paid the highest AML penalty in Australian history and spent 
five years rebuilding controls, data systems, and processes. The 2020 
case gives specific weight to design decisions that make banker-level 
evidence visible — like provenance indicators (D6) and the mode 
indicator (D8). These aren't generic UX decisions; they respond to a 
regulatory history Westpac knows intimately. If this case comes up in 
the interview, the framing is: "Westpac has a specific relationship 
with AUSTRAC compliance that makes banker-level evidence visibility 
more than a nice-to-have. My design treats it as foundational rather 
than additive."

### UNITE transformation context
- BizEdge sits inside the UNITE simplification program.
- **UNITE progress by March 2026:** 180+ applications decommissioned, 
  70%+ of products simplified, 700+ processes simplified. On scope, 
  on time, on budget.
- **Design implication:** BizEdge is not layered over a broken platform. 
  UNITE has delivered meaningful simplification underneath. My design 
  should ride that wave, not hide it.

---

## BizEdge — verified claims only

All metrics below are from Westpac's FY25 ASX Media Release or 
Business & Wealth Update September 2025. Exact wording preserved.

- **"BizEdge has reduced the average time to decision by 45%"** 
  (Westpac FY25 ASX Media Release)
- **"SIMPLE+ simplified credit pathway: >7k applications since launch 
  in Apr-23"** (Westpac B&W Update Sep 2025)
- **"Automated decisioning for >75% of customers"** (Westpac B&W 
  Update Sep 2025) — this refers to banker-approved deals processed 
  through automated pathways
- **"Application to settlement under 4hrs"** (Westpac B&W Update Sep 2025)
- "Conditional Limit Offers: $43bn in limits extended" (Westpac Business 
  & Wealth Update September 2025)
- **BizEdge features:** customer data pre-population, automated Company 
  search, automated PPSR search, streamlined document management, single 
  view of customer, real-time knowledge assistance
- **Current AI approach:** described as "real-time knowledge assistance" — 
  reactive, banker must ask for help
- **Dr Martin Anderson (Head of Technology & Business Lending):** team 
  won Westpac's Team of the Year 2025; publicly described BizEdge as 
  delivering a "world leading experience"

### Not verified (treat with care)
- The exact BizEdge platform launch date. April 2023 refers to the 
  SIMPLE+ pathway launch, not BizEdge itself. Westpac's January 2023 
  Rich Data Co. partnership announcement mentions AI in business lending 
  but does not name BizEdge.

### Key implication for design
BizEdge has already won on speed. 45% TTD reduction is significant. 
The next marginal improvement is NOT faster throughput — it's fewer 
errors, better judgment support, and reducing rework. This is my 
core design thesis.

### Additional verified BizEdge facts (April 2026 research)
- **~90 minutes saved per banker per deal** (secondary press citing 
  Westpac messaging — MPA / AINvest)
- **Eligibility threshold:** non-complex business customers, trading 
  >1 year, no losses, total committed exposure up to $20M
- **Two-sided platform:** BizEdge has both a customer-facing side 
  (pre-filled forms, secure login, real-time application tracking) 
  and a banker-facing workspace. Rich Data Co's contribution is a 
  *"two-sided digital finance application form, which allows both 
  customers and bankers to jointly work on an application."* 
  (Source: Westpac/RDC press, January 2023)
- **Three-way technology partnership:** Westpac + AWS + Rich Data Co 
  (RDC). RDC raised **US$17.5M Series B in November 2023, co-led by 
  Westpac and nCino** — the global LOS leader as co-investor is a 
  significant signal about where Westpac's LOS/AI strategy is pointing.
- **Process redesign, not feature addition.** At the AWS Financial 
  Services Symposium (Sydney, early 2026), Dr Martin Anderson said: 
  *"People are going to be surprised by how these sequences are going 
  to be reorganised, resequenced, rewired. It's not just going to be 
  a case of adding in AI-specific points; it's actually reimagining 
  the process so that you can actually optimise it to leverage AI 
  and all the various capabilities. Whether it's within documentation, 
  KYC, annual reviews, credit decisioning, the writing of credit 
  memos, even communications — the whole end-to-end sequence of 
  business lending can be optimised."* (Source: iTnews article 620401)
- **Agentic AI explicitly on roadmap.** RDC's Gordon Campbell 
  described work on *"how we can bring products to market that safely 
  use agentic capability."* An "interaction bot" was proposed to 
  analyze portfolio governance and cashflow data currently stored in 
  Excel/PowerPoint. (Source: same iTnews article)
- **Side effect of AI integration:** Anderson noted that introducing 
  AI tools surfaced ambiguities and conflicts in Westpac's own 
  internal documents — the AI work is forcing upstream cleanup of 
  policy and process documentation.

### Visual / experiential evidence — explicitly limited
**No public screenshots, video walkthroughs, or detailed UI 
descriptions of BizEdge's banker workspace exist in publicly 
searchable sources.** Westpac's official Lending Pathways page 
describes BizEdge in marketing terms (pre-filled forms, real-time 
tracking, banker guidance) but does not show the interface. The 
Westpac Digital Connect Corporate Lending User Guide (2021 PDF) 
covers a different platform — the Corporate Lending Portal — not 
BizEdge.

**What this means for the design:**
- Every UX assumption about current BizEdge in this vault is 
  **inferred** from Westpac's published feature list, Anderson's 
  public commentary on the platform's intended evolution, and 
  industry LOS conventions — not from direct observation.
- In the interview, the honest framing is: *"BizEdge's internal 
  banker UI is not publicly documented. My current-state assumptions 
  are based on Westpac's published feature list and Dr Anderson's 
  public commentary about the platform's evolution toward AI-led 
  process redesign. On day one inside Westpac, I would prioritise 
  hands-on time with current BizEdge before refining any of these 
  proposals."*
- This gap is acceptable for a take-home challenge — the brief asks 
  for a *future* deal home page, not a critique of current state. 
  But it sets a clear discovery priority for month one in the role.

### Important reframing — BizEdge is two-sided, not banker-only
Earlier framing implicitly treated BizEdge as a purely banker-facing 
tool. The two-sided digital application form (RDC's contribution) 
means BizEdge has a **customer-facing side and a banker-facing side, 
with shared application state.** Customer actions (document uploads, 
query responses, application form fields) feed directly into the 
banker's workspace.

**Implications for my design:**
- The "deal home page" the brief asks for is the **banker-facing 
  surface** of a two-sided system. The customer side exists and is 
  materially relevant.
- This **strengthens Decision 7** (three-way task ownership: Banker / 
  System / Customer). "Customer-owned" items are not abstract — they 
  are real interactions on a real customer surface the banker can 
  already see in BizEdge today.
- It opens a V3-level talking point: *"If I were extending this 
  further, I'd design the customer-side state mirror — same lifecycle 
  stages, different role lens — so the customer experiences progress 
  in the same shape the banker does."*

---

## Competitors — what Westpac is chasing

### NAB QuickBiz (and broader platform)
- Expanded in 2025 to more customers, products, channels
- NAB also launched DigiDocs (broader eligibility) and a new lending 
  platform
- NAB also introduced a Lending Portfolio Tracker
- Historical benchmark: NAB QuickBiz accounted for ~45% of NAB's small 
  business loan openings and ~1 in 3 of NAB's small business lending 
  decisions (figures from earlier reporting — may be dated)

### CBA Stream Working Capital
- 24/7 self-service, accounting-software connectivity, invoice-backed 
  cash-flow lending
- Strong benchmark for digital working-capital lending

### ANZ GoBiz
- Online business loans/overdrafts up to $500k
- Eligibility tied to reconciled accounting data
- Clear digital pathways

### Judo Bank (not a direct competitor but important benchmark)
- Uses nCino as core platform (with Backbase for customer digital)
- Relationship-led model, dedicated bankers, NPS 70 publicly reported
- Character-first lending, $250k+ segment
- The "human touch at scale" case study

### Strategic read
Westpac's "high-tech + high-touch" positioning tries to do both at 
once. My design operationalizes that positioning at the banker's 
workstation: digital speed with human judgment support, not one 
replacing the other.

---

## The three pains, reframed

### Pain 1: New banker errors
**Brief wording:** "New bankers are prone to errors in deal setup and 
tend to learn through trial and error"

**Not a knowledge gap — a *when and why* gap.** New bankers know tasks 
exist but don't know the sequence or why each matters for this specific 
deal. Training tells them *what*. The system must tell them *when* and 
*why*.

**Evidence:**
- **McKinsey (commercial onboarding research):** 30-100 days to 
  productivity, primarily due to fragmented systems and manual workflows, 
  not just curriculum quality
- **Psychological safety (Amy Edmondson framework, applied to banking):** 
  juniors in finance often delay questions due to reputation risk, 
  especially in hierarchical cultures. Confirmed in Chartered Banker 
  Institute and investment banking commentary.
- **JPMorgan Coach AI (industry benchmark):** AI companions for junior 
  bankers/engineers reported to boost efficiency 10-20% (exact figures 
  from trade press — verify before citing in detail)
- **Common junior errors in commercial lending:** KYC/AML failings, 
  onboarding high-risk customers, incomplete data, inadequate risk 
  assessments, entity classification mistakes
- **RBC ethnographic study (Cognitive Group):** field observation of 
  20 account managers, risk managers, back-office employees uncovered 
  **88 error types** costing approximately **$30M per year** in lost 
  productivity and delays. Source: cognitivegroup.com/portfolio/loan-origination-rbc/

**Two-layer root cause (important nuance):**
1. **Primary:** tooling fragmentation and swivel chair work (McKinsey)
2. **Secondary:** psychological safety (Edmondson)

Order matters: my V1 addresses primary (unified guided workspace), V2 
layers AI guidance to cover secondary.

**Note: error ≠ rework.** Not all rework stems from banker error. 
Policy changes, credit team requests, and customer-side issues also 
drive resubmissions. My design addresses the banker-error subset 
specifically. Quantifying that subset is an open question for 
internal data validation.

---

### Pain 2: Senior banker skip
**Brief wording:** "Experienced bankers often have to resubmit deals 
because they skip key steps for less common product types"

**Not a knowledge gap — a *variation visibility* gap.** Senior bankers' 
muscle memory is optimized for common products. Rare-product variations 
don't visually break through that default pattern.

**Academic grounding: expertise reversal effect.** Well-documented 
cognitive phenomenon: instructional designs effective for novices become 
ineffective or harmful for experts because experts over-rely on 
schema-based processing and ignore redundant guidance. Studied in 
aviation and medicine. Applied to banking: senior bankers run automated 
pattern-matching that fails on atypical cases unless variation is made 
visually unmissable.

**Urgent regulatory timing:**
- **AUSTRAC AML/CTF reform commenced 31 March 2026** for existing 
  reporting entities (Westpac included)
- AUSTRAC describes the shift as **"from a compliance-based approach 
  to a risk-based, outcomes-oriented approach"** (direct AUSTRAC quote)
- New structure: CDD is now divided into **initial CDD** and **ongoing CDD**
- Program no longer has to be separated into Part A and Part B
- **The transition trap:** AUSTRAC allows existing reporting entities 
  to keep using pre-reform ACIP for initial CDD until 31 March 2029, 
  BUT ongoing CDD and risk monitoring apply under the new rules 
  **immediately**. A single deal can be partially under old rules 
  and partially under new rules.
- Legacy ACIP transition until 31 March 2029 analyzed by compliance 
  commentators including FirstAML 
  (firstaml.com/au/resources/austrac-updates-transitional-rules...) 
  and Hall & Wilcox 
  (hallandwilcox.com.au/news/transitional-rules-update-announced...).
- **Design implication:** Senior muscle memory built under the old 
  compliance-based framing may now create compliance risk. The platform 
  must make the mode (legacy ACIP vs reform CDD) visually obvious so 
  bankers don't assume one framework applies when it doesn't.

**What AUSTRAC explicitly allows (design justification):**
> "Some initial CDD steps can be delayed where essential to avoid 
> interrupting ordinary business."

This is a direct departure from the old "all boxes must be ticked before 
anything happens" mentality. **My design decision to treat skip as 
friction rather than hard block is aligned with the regulator's own 
intent**, not just a UX preference.

**Common senior errors by product type:**
- **Bank guarantee:** misunderstanding collateral terms, beneficiary 
  details, expiry alignment with contract
- **Trust lending:** missing trustee duties, incomplete beneficiary 
  verification, incorrect control structure identification
- **Startup lending:** over-optimistic projections, ignoring cash burn
- **Partnerships:** applying company-style ownership logic when the 
  customer is actually a partnership with different control semantics

**Australian rare-product signal:** three of four major Australian banks 
have stopped offering bank guarantees to retail customers due to 
risk/complexity. The ones Westpac still writes are a "specialized offering" 
more than an ordinary product — which makes the rare-product skip problem 
especially acute at Westpac.

**Note: error ≠ rework (continued).** The same caveat on error vs 
rework applies here. Senior banker skip produces rework, but not 
all rework is skip-caused.

---

### Pain 3: No single view
**Brief wording:** "There is currently no single view that shows a banker 
where they are in the deal lifecycle or what's outstanding"

**Not a dashboard gap — a *guided workflow* gap.** This is the biggest 
reframe in this document, and it changed my design direction.

**Industry research finding:** In modern LOS platforms like nCino, Moody's 
Lending Suite, and Baker Hill, the term "single view" actually means 
**"single guided workflow surface,"** not **"all information visible at 
once."** Information is sequenced around the next unresolved action, 
not displayed in parallel.

- **nCino's "Deal Proposal" uses a "single sheet method"** — a structured 
  dossier with relationship context, proposal fields, and activity history 
  consolidated into one workspace. Organized around lifecycle progression 
  and task completion, not monolithic information display.
- **Moody's Lending Suite front-office brochure** describes "dynamic 
  applications, guided workflows, AI-led prioritization, prepopulated 
  data, secure document collection, transparent application/document 
  status."
- **Baker Hill** emphasizes pipeline-led banker lens, dynamic credit memo, 
  and streamlined renewals — not a static file cabinet.

**Where the framing came from:** initially I assumed "single view" meant 
a unified dashboard where every piece of deal context is simultaneously 
visible. Industry research reframed that assumption. My progress spine 
and checklist architecture both changed as a result.

**Context scarcity — the common root across all three pains:**
- **Spatial context** (where am I in the deal lifecycle) → progress spine
- **Procedural context** (what do I do next) → dynamic checklist
- **Diagnostic context** (why this matters, what's different here) → 
  inline guidance and explanation layer

All three pains share one root cause: context is missing across these 
three dimensions.

---

## Industry research — how tooling handles this

### Validation rules must be dynamic (industry-validated pattern)
**Hawthorn River** (US community bank LOS vendor, acquired by CSI Dec 2023) 
explicitly articulates the design principle in their public materials:

> "Field & Document Validations are leveraged to help bankers know when 
> specific information is a 'nice to have' or a 'need to have'. These 
> validation rules will also vary based on the structure of the loan, 
> borrowers, and collateral."

This matters because it confirms my dynamic checklist approach is not 
a bespoke Westpac bet — it's how the LOS industry already thinks about 
this problem.

### Banking as an "assembly line"
Hawthorn River also uses a helpful metaphor: "Banks produce services by 
moving information through a series of processing steps — this is a 
bank's assembly line." This framing shapes how I think about the deal 
home page: it's a station in a larger assembly line, and the banker 
needs station-specific context (what to do here, what's coming next, 
what the last station handed me).

### Checklist UX conventions from design systems
- States: **not started** (gray), **in progress** (yellow/spinner), 
  **blocked** (red flag), **complete** (green check), **needs review** 
  (orange warning)
- Sourced from Shopify Polaris, IBM Carbon, Salesforce Lightning 
  convention
- Adaptive cards that expand on interaction (Lightning pattern) 
  informs my inline expansion approach

### Progressive disclosure over toggles
**NN/g (Nielsen Norman Group)** research strongly recommends progressive 
disclosure over explicit mode toggles:
- Manual toggles create decision paralysis and stigma
- Auto-detection risks misclassification
- Better: contextual expansion (hover/click reveals help), avoiding 
  toggles entirely

**This changed my design.** I initially had a Learning/Expert mode 
toggle. Research refuted it. My final approach uses progressive 
disclosure: every banker sees the same checklist; expansions are 
banker-initiated, not system-pushed.

### Fintech guided workflows (DBS, Monzo, ProCredit Bank)
- ProCredit Bank unified dashboard with customizable navigation and 
  plain-language guidance — balanced novice/expert needs without 
  explicit modes
- DBS/Monzo layered AI guidance progressively, reducing cognitive load
- Pattern: contextual help expansion > mode switching

---

## AUSTRAC entity type structure

AUSTRAC publishes five initial CDD guide paths (not six — a correction 
from my earlier working assumption):

1. **Individual**
2. **Sole trader**
3. **Body corporate / Partnership / Unincorporated association** 
   (grouped in one AUSTRAC guide, but entity-specific verification 
   still required within)
4. **Trust**
5. **Government body**

**Critical nuance:** AUSTRAC groups the middle three in one guide, but 
their guidance explicitly warns that "collapsing these into one generic 
business customer flow will miss entity-specific questions and create 
compliance gaps." Body corporate, partnership, and unincorporated 
association share a guide but are NOT interchangeable in workflow.

**Design implication:** My dynamic checklist mirrors AUSTRAC's own 
guide architecture — shared core path with branching controls for 
entity-specific questions. The regulator itself has acknowledged this 
tension in their guide structure. My design operationalizes it at the 
UI layer.

**Enhanced CDD triggers (new from reform):**
- Higher risk profile
- Foreign jurisdiction exposure
- PEP (politically exposed person) status
- Unusual customer structures

These must be first-class decision factors in the checklist, not 
buried notes. A "standard" deal can become higher-risk purely because 
of structure or geography.

---

## Counter-evidence and limitations (devil's advocate)

These are honest challenges to my thesis. I want them in writing so I 
can defend against them in the interview rather than being blindsided.

### "Context scarcity is not the root cause"
A reasonable critique: the deeper issue may be capability (training 
depth), incentives (KPIs rewarding throughput over completeness), or 
process ownership (fragmented accountability). Westpac's own risk and 
governance history has been publicly criticized for exactly these 
issues. **Rebuttal:** my design addresses the interface layer, not the 
full organizational problem. It's one of three levers — UX, policy, 
and incentives. I own one.

### "Inline help becomes banner blindness"
Industry research shows inline help is often ignored in high-pressure 
workflows. **Rebuttal:** my inline help is *expandable*, not persistent. 
The default state is compact; expansion is banker-initiated. NN/g 
research on progressive disclosure confirms user-triggered reveal 
avoids banner blindness.

### "Self-toggle is vulnerable"
Users don't know which mode they should be in. **Already addressed:** 
I explicitly moved away from self-toggle after research. Current design 
uses progressive disclosure, no mode choice required.

### "New banker errors is really a training problem"
Fair in part. **Rebuttal:** McKinsey finds commercial onboarding takes 
30-100 days primarily because of tooling fragmentation, not curriculum 
quality. My design addresses the tooling half. Training remains a 
parallel workstream.

### "Senior skip is really an incentive problem"
Also fair in part. **Rebuttal:** incentive fixes are outside my scope, 
but my friction-based skip creates measurement data (skip reasons) 
that make incentive problems visible. UI can contribute to the 
governance cycle even if it doesn't fix incentives directly.

### "Single view may be vanity"
Metric-free single views are just aesthetics. **Rebuttal:** my 
validation plan measures rework reduction, escalation frequency, and 
approval delay compression — not "does the view exist." If those 
metrics don't move, the design fails.

### "Westpac has cultural/complexity issues UX can't fix"
The hardest one. **Rebuttal:** I'm not claiming UI fixes culture. 
UNITE is delivering real simplification — 180+ apps decommissioned, 
70%+ products simplified. My design rides that wave. If UNITE fails, 
my design fails too. Because UNITE is delivering, my design 
operationalizes that progress.

---

## Open questions (would validate if hired)

1. **What are BizEdge's internal resubmission rates broken down by 
   product type and banker tenure?** Would confirm or refute the 
   "rare product causes senior skip" hypothesis with bank-specific 
   data.

2. **Has Westpac internally transitioned bankers to post-reform CDD 
   before 31 March 2026, or are they in active transition?** 
   Changes the urgency framing.

3. **Does BizEdge expose deal state via API to a customer portal, 
   or is it purely banker-facing?** Shapes whether the "shareable 
   state" ambition (for future customer-facing use) is technically 
   feasible.

4. **What is the actual hierarchy of error causes by banker experience 
   level at Westpac specifically?** General industry patterns may 
   not match Westpac's specific error profile.

5. **Is the 'real-time knowledge assistance' AI already deployed, or 
   is it in design phase?** Determines whether my V2 teammate 
   concept is a build or an extension.

6. **What are the actual time-to-productivity curves for Westpac's 
   new business bankers?** Would quantify the learning curve 
   bottleneck my V2 addresses.