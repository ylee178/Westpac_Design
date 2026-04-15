# Primer: Westpac Business Lending Design Challenge

This is a personal background document — not an interview deliverable. It exists so I can explain the domain in my own words before Thursday, without having to cram insights.md, decisions.md, and talking-points.md the night before. Each question stands alone; I can jump around. Written in plain language, as if to a smart friend over coffee.

Uncertainty flags at the end of the file list anything I should double-check.

---

## Chapter 1 — The Stage (Who / What / Where)

### Q1. Who is Westpac?

Westpac is one of Australia's "Big Four" banks — the four institutions that together dominate retail and commercial banking in Australia. It's also the country's oldest bank, founded in 1817 in Sydney. That's almost a century older than the country it operates in (Australia became a federation in 1901).

The Big Four are Westpac, CBA (Commonwealth Bank of Australia), NAB (National Australia Bank), and ANZ. Together they hold roughly 75–80% of Australian banking. Westpac isn't the biggest — in business lending specifically, as of July 2025, NAB leads with 21.6% market share, CBA sits at 18.85%, and Westpac trails at 16.1%. The gap is narrowing, but Westpac is still catching up.

Scale check: Westpac's Business & Wealth division delivered about A$1.1 billion in profit in the first half of FY25. That's roughly 33% of the whole group's profit. So business lending isn't a side bet — it's a large chunk of the engine, which is why "Senior Experience Designer — Business Lending Origination Platform" is a strategic role, not a cosmetic one.

The bank I'm designing for is a 200-year-old institution with real regulatory scars (see Q15 about the 2020 AUSTRAC case), actively trying to claw back share in a category it has publicly called its "shift in emphasis." That context shapes every decision in my design.

### Q2. What is "business lending" (vs personal lending)?

When most people think "loan," they picture a mortgage, a car loan, or a credit card. Those are all personal lending — the bank lends to an individual human based on that person's salary, credit history, and personal finances.

Business lending is a different animal. The bank lends to a business entity, which might be a sole trader (one person running a business in their own name), a company, a partnership, a trust, or a big corporation. The bank is betting on the business's ability to generate cash and repay — not on an individual's paycheck.

Why harder? Three reasons. First, business structures are legally complex. A "company owned by a family trust" is a very different legal animal than "John borrowing money for a car." Second, the amounts are bigger and more custom. A small-business loan might be $500K; a mid-market commercial loan can run into the tens of millions. Each deal is negotiated, not selected off a shelf. Third, the risk analysis is different. Instead of a single credit score, you're reading financial statements, industry conditions, collateral, guarantees, and sometimes the customer's board composition.

Business lending is also where banks compete hardest on relationships. Most business customers have a dedicated banker who knows their business. That relationship depth is what BizEdge is designed to support at scale.

### Q3. What is BizEdge?

BizEdge is Westpac's in-house software platform for business lending origination. "Origination" means the part of lending where you create a new loan — setup, credit analysis, approval, documentation, booking. BizEdge is the cockpit a Westpac banker uses to do all of that for business customers.

Publicly verified facts from Westpac's own disclosures: BizEdge has reduced the average time-to-decision by 45%. Over 75% of eligible deals are now automatically decisioned. Simple deals can go from application to settlement in under 4 hours. Westpac has extended $43 billion in "Conditional Limit Offers" (pre-approved credit limits for existing customers) through BizEdge. The SIMPLE+ credit pathway has processed over 7,000 applications since April 2023.

Features Westpac has confirmed: customer data pre-population, automated Company search (verifying customers against the Australian business register), automated PPSR search (checking pre-existing security interests on assets), streamlined document management, and a "real-time knowledge assistance" AI layer bankers can consult for policy questions.

Critical insight from my research: BizEdge is **two-sided**. It's not purely a banker tool. It also has a customer-facing side where business customers can pre-fill forms and track application status in real time. Rich Data Co describes its contribution as "a two-sided digital finance application form, which allows both customers and bankers to jointly work on an application." This is load-bearing for my Decision 7 (three-way task ownership).

### Q4. What is a LOS (Loan Origination System)?

LOS stands for Loan Origination System. It's a category of software, not a specific product. Think of it as "the operating system a banker uses to create a loan deal."

Before modern LOS platforms, bankers assembled loans using email, Word, spreadsheets, and multiple legacy systems. Customer ID was collected in one place. Credit analysis happened in another. Approval ran through email. The final loan was booked into yet another system. Bankers spent huge amounts of time copying information between systems — McKinsey calls this "swivel chair work," literally swiveling your chair to the next monitor to retype data. It's also exactly how mistakes happen: data gets transcribed wrong, steps get forgotten, context gets lost.

A modern LOS consolidates all of that into one platform. It holds the customer data, the credit checks, the approval workflow, the document handling, and the eventual loan booking — ideally in one coordinated workspace. The LOS is where the banker lives for most of their working day when they're creating new deals.

There are many LOS vendors globally. The market leader is nCino (see Q5). Other significant names include Moody's Lending Suite, Baker Hill (mid-market US), Hawthorn River (US community banks), and Backbase. Most LOS platforms are sold as SaaS. Westpac took a different route and built BizEdge in-house, though it partners with Rich Data Co for AI decisioning.

### Q5. What is nCino and why does it keep coming up?

nCino is the dominant cloud-based Loan Origination System in commercial banking worldwide. Think of it as "the Salesforce of commercial lending" — it's literally built on top of Salesforce's infrastructure. Founded in 2012 by former bankers frustrated with legacy LOS platforms, nCino went public on NASDAQ in 2020 and today serves over 1,200 financial institutions globally.

Why does it keep appearing in my research?

**First, it's the benchmark.** When the industry talks about "what a modern LOS workspace looks like," they often mean nCino. Its "single sheet method" (a structured dossier consolidating relationship context, proposal fields, and activity history into one workspace organized around lifecycle progression) is the industry pattern my progress spine borrows from.

**Second, Judo Bank uses it.** Judo is a newer Australian business-lending challenger with an excellent reputation in SME banking (NPS 70 publicly reported). They built their platform on nCino. They're often cited as "the human touch at scale" case study — a direct counter-example to the Big Four's process-heavy approach.

**Third — and this is the strategic signal — Westpac and nCino co-led Rich Data Co's US$17.5 million Series B in November 2023.** That means Westpac isn't watching nCino from afar. They've invested money alongside nCino into the same AI decisioning platform. When I design in the spirit of nCino's patterns, I'm designing in the direction Westpac is already moving.

### Q6. What is Rich Data Co and what does it do for BizEdge?

Rich Data Co (RDC) is an AI decisioning platform. Westpac partnered with them in January 2023 to embed AI into BizEdge — specifically into business lending decisioning. The goal was to speed up loan decisions by using pattern analysis of customer transaction data and financial signals to pre-score deals.

In November 2023, RDC raised a US$17.5 million Series B round, co-led by Westpac and nCino. That investment is a signal about Westpac's LOS-and-AI strategy: it points toward the same tools and techniques the global market leader is betting on.

The specific piece of RDC's contribution that matters for my design: RDC describes its BizEdge integration as "a two-sided digital finance application form, which allows both customers and bankers to jointly work on an application." That phrase tells me two things. First, BizEdge has a customer-facing side, not just a banker interface. Second, customer and banker share state on the same underlying application — when the customer uploads a document or answers a question, it updates on the banker's side.

This grounds my Decision 7 (three-way task ownership: Banker / System / Customer). The "customer" actor in my checklist isn't an abstract design construct — they're a real surface inside the actual BizEdge architecture today. The audit called Decision 7 my weakest decision; the RDC finding turned it around.

At the AWS Financial Services Symposium in Sydney earlier this year, RDC's Gordon Campbell also mentioned they're working on "how we can bring products to market that safely use agentic capability." That's relevant to my V2 AI teammate concept.

### Q7. What is UNITE and why does it matter for the design context?

UNITE is Westpac's name for its multi-year transformation program, launched in 2024. [uncertain — I don't have a public source confirming what the UNITE acronym stands for]. What it is in practice: the umbrella program under which Westpac is simplifying its products, processes, and systems across the bank.

Why does UNITE matter for my design? Three things.

**First, BizEdge sits inside UNITE.** Business lending origination is one of many UNITE workstreams. When I design for BizEdge, I'm designing into a platform that's actively being simplified underneath me.

**Second, UNITE is delivering measurable results.** By March 2026, Westpac publicly reports: 180+ applications decommissioned (legacy software retired), 70%+ of products simplified (fewer variations, cleaner offerings), 700+ processes streamlined. The program is reportedly on scope, on time, and on budget — a rare claim for a multi-year bank transformation. These aren't PowerPoint promises; they're measurable outcomes.

**Third, and this is the interview-day payoff:** in the presentation, I can honestly say "my design rides the UNITE wave, not fights it." If UNITE were failing, my design would fail too. Because UNITE is delivering, my design operationalizes that progress at the banker's workstation. The framing is defensible because it's specific — I can point to the 180/70/700 numbers — and it's humble, because it doesn't claim UX alone fixes Westpac.

---

## Chapter 2 — The Regulatory Backdrop

### Q8. What is AUSTRAC?

AUSTRAC is the Australian Transaction Reports and Analysis Centre — Australia's financial intelligence agency and anti-money-laundering regulator. In plain terms, AUSTRAC is the government body that tells Australian banks what they must do to prevent money laundering, terrorism financing, and other financial crimes.

Every Australian bank (and many other financial businesses) is a "reporting entity" under AUSTRAC's rules. Being a reporting entity means you have to identify your customers, monitor their transactions for suspicious activity, report suspicious matters to AUSTRAC, keep records, and maintain an AML/CTF compliance program. Banks don't negotiate with AUSTRAC; AUSTRAC sets the rules and banks comply.

Useful analogy: if the bank is a nightclub, AUSTRAC isn't the police arresting individual troublemakers. It's the regulator that tells the club what ID checks it has to do at the door, how to train its bouncers, what its incident reports have to look like, and which patterns of activity it must flag to authorities. AUSTRAC doesn't directly prosecute criminals — it supervises the *processes* banks use to prevent criminals from using the financial system.

When banks get it wrong, AUSTRAC can issue massive civil penalties. The largest in Australian history — $1.3 billion — was against Westpac in 2020 (see Q15). That history is why compliance has outsized weight at Westpac specifically, and why "banker-level evidence visibility" (my Decision 6 and Decision 8) isn't just good UX — it's a strategic requirement tied to Westpac's specific regulatory past.

### Q9. What is AML/CTF in plain terms?

AML/CTF stands for Anti-Money Laundering and Counter-Terrorism Financing. It's the regulatory framework that requires banks and other financial businesses to identify customers, monitor transactions, and report suspicious activity — so that the financial system isn't used to hide the proceeds of crime or fund terrorism.

"Money laundering" means taking money from illegal activity (drug trafficking, fraud, corruption) and making it look like legitimate money — passing it through accounts, businesses, and jurisdictions until its origin is obscured. "Terrorism financing" is moving money — often small amounts — to fund violent activity. These two problems share one characteristic: both depend on the financial system not noticing or not caring.

AML/CTF rules push back by forcing banks to notice. Every new customer must be identified. Every unusual transaction must trigger scrutiny. Every relationship must be monitored for risk over time. Every suspicious pattern must be reported. This is a big operational burden — not just paperwork, but real staff time, real training, real technology investment.

Here's the thing to remember: AML/CTF isn't about catching criminals directly. That's the police's job. It's about designing the banking system so criminals can't move money cleanly through it without being noticed. My design work on BizEdge contributes to this, because every deal-setup decision affects how evidence of customer identity is captured, verified, and made available for audit. In regulated banking, compliance and user experience are not separate concerns — they're the same concern at different layers.

### Q10. What is CDD and what does a banker actually do during CDD?

CDD stands for Customer Due Diligence. It's the process a bank must complete before providing a service to a new customer — or when a significant change happens to an existing customer. It answers two questions: "Do I really know who this customer is?" and "Do I understand the money-laundering risk of dealing with them?"

For an individual customer, CDD is relatively simple: collect ID (passport or driver's license), verify it's real, check against watchlists, assess risk, document everything. For a business customer, CDD is much more complex. The banker has to:

- **Identify the business entity itself** (company, sole trader, trust, partnership, etc.)
- **Identify the people acting on behalf of the business** (directors, authorized signatories)
- **Identify the "beneficial owners"** — real humans who ultimately own or control the business, even when hidden behind layers of corporate structure
- **Understand the nature and purpose of the business relationship** (why is this customer banking here?)
- **Assess the money-laundering risk** of the relationship
- **Document everything** — both the evidence and the banker's reasoning

A useful analogy: CDD for a business is like vetting a new roommate who claims to be representing a family — you need to verify the roommate, meet the family members, understand the household's income sources, and check that the whole arrangement isn't a cover for something else. Now imagine doing that in 30 minutes, five times a day, with AUSTRAC watching every call. That's a Westpac banker's CDD reality.

Under the 2026 reform, CDD is split into two phases — "initial CDD" (onboarding) and "ongoing CDD" (continuous monitoring). See Q13 and Q14 for the split and why the timing matters.

### Q11. What is a "beneficial owner" and why is this tricky?

A beneficial owner is the real human being who ultimately owns or controls a business entity — even when that ownership is hidden behind layers of companies, trusts, or other legal structures.

Here's why it gets tricky. Imagine a business customer called "Sunrise Holdings Pty Ltd." On paper, Sunrise Holdings is a company owned by another company called "Coastal Investments Ltd." Coastal Investments is owned by a trust called "Smith Family Trust." The Smith Family Trust is administered by a trustee (a law firm or accountant) on behalf of three beneficiaries — say, Mr Smith, his wife, and their adult daughter.

If you stopped at "Sunrise Holdings is owned by Coastal Investments," you'd never know who's really in charge. The beneficial ownership requirement forces the banker to "look through" the structure until they reach real humans. In this example, the beneficial owners are Mr Smith, his wife, and their daughter — and the banker must identify and verify all three under AUSTRAC's rules (ownership or control above 25% is the usual threshold).

Why is this important? Without a beneficial ownership obligation, criminals could hide behind corporate structures indefinitely. A money launderer could create shell companies owned by other shell companies owned by offshore entities, making it impossible to trace who actually controls the money. The beneficial ownership rule forces the "look-through."

For a senior banker who normally deals with simple sole traders, a trust with multiple beneficiaries is the kind of rare case where muscle memory fails. Missing or misidentifying a beneficial owner is one of the most common senior-banker errors in commercial lending CDD. That's exactly the Pain 2 scenario my design targets.

### Q12. What is an entity type and why does it matter?

"Entity type" is the legal form a business customer takes. Different legal forms have different ownership structures, different governance, different paperwork — and, critically for banking, different CDD requirements under AUSTRAC rules.

AUSTRAC's initial CDD guidance groups customers into roughly five categories:

1. **Individual** — a single natural person, no business entity involved
2. **Sole trader** — an individual doing business under their own name or a registered business name
3. **Body corporate / Partnership / Unincorporated association** — these three share one AUSTRAC guide but require entity-specific verification within it
4. **Trust** — a legal relationship where a trustee holds assets for beneficiaries
5. **Government body** — government departments and authorities

Each entity type fundamentally changes what the banker must verify. A sole trader has one identity to verify — fairly simple. A body corporate has directors, shareholders, and beneficial owners — multiple identities, multiple documents. A trust is the most complex: you need the trustee, the trust deed, the beneficiaries, sometimes the appointor, and you must understand the control structure. If you treat all business customers as if they were the same, you miss entity-specific mandatory steps and create compliance gaps.

This is exactly why my Decision 1 (dynamic checklist) reshapes by product × entity × jurisdiction. AUSTRAC itself structures its guidance this way; the regulator already models the problem as "entity type drives the required steps." A static checklist showing every possible step for every entity is overwhelming. A static checklist showing only common-case steps silently skips rare cases. A dynamic checklist that reshapes when the entity type changes is the only approach that matches the regulator's own model.

### Q13. What changed in the 2026 AUSTRAC reform? Plain language.

Until March 31, 2026, AUSTRAC's rules told banks exactly what documents to collect for each type of customer — a rigid prescriptive checklist. If a banker collected the specified documents in the specified way, they were compliant. It was a "tick-the-boxes" approach.

On March 31, 2026 — just over two weeks before this interview — that changed. AUSTRAC replaced the prescriptive rules with an outcomes-based, risk-driven framework. In AUSTRAC's own words, quoted verbatim, the reform is a shift **"from a compliance-based approach to a risk-based, outcomes-oriented approach."** Instead of telling banks exactly what to collect, the new rules require banks to assess each customer's risk and decide what evidence is sufficient "on reasonable grounds."

Useful analogy: imagine a driving test that used to score you on 20 specific mechanical actions — check mirror, signal, accelerate smoothly, come to a full stop. Now imagine the test says instead: "Drive from A to B safely. We'll decide at the end whether you drove safely, and we want you to document your judgment calls along the way." The second test is harder, not easier, because it requires actual thinking and defensible documentation, not just following a script.

For banks, this means every CDD decision is now a judgment call they have to defend. Banker muscle memory built under the old prescriptive rules may no longer be compliant. This is a big cognitive shift. And the timing could not be more sensitive — the reform is two weeks old, which means Westpac's senior bankers are right now operating under new rules that invalidate some of their instincts. That's the urgency underlying Pain 2 in my design thesis.

### Q14. What is the "transition trap" and why does it matter now?

The transition trap is a specific wrinkle in the 2026 reform that creates real compliance risk at Westpac right now.

Here's how it works. The reform split CDD into two phases: **"initial CDD"** (what you do when you first onboard a customer) and **"ongoing CDD"** (what you do to monitor the customer over time). For initial CDD, AUSTRAC allowed a transition period: existing reporting entities like Westpac can keep using the pre-reform procedure (called "legacy ACIP" — Applicable Customer Identification Procedure) until March 31, 2029. Three years of runway. Good news for operational continuity.

But — and this is the trap — ongoing CDD and risk monitoring apply under the new rules **immediately**. From March 31, 2026 onwards, every customer's ongoing monitoring must follow the new risk-based framework. No transition period for ongoing CDD.

The practical consequence: a single deal at Westpac today can be partially under old rules (legacy ACIP for initial CDD) and partially under new rules (risk-based ongoing monitoring). A senior banker who thinks "we have until 2029, I'll keep doing what I've always done" is partially right and partially wrong. Their initial CDD is fine. Their ongoing monitoring is not.

This is exactly the kind of situation where muscle memory becomes a liability. The banker assumes one framework applies uniformly, when actually the deal spans both. My Decision 8 (legacy ACIP vs reform mode indicator) addresses this directly: the UI explicitly shows which framework applies to which phase of the deal, so the banker doesn't silently apply the wrong rules. This is why Pain 2's urgency is specific and technical, not abstract.

### Q15. What is the Westpac 2020 AUSTRAC case and why does it give specific weight to this role?

In November 2019, AUSTRAC filed civil penalty proceedings against Westpac for what ended up being 23+ million admitted contraventions of Australia's AML/CTF Act. The specific violations were ugly.

The biggest failure: Westpac failed to report over 19.5 million International Funds Transfer Instructions (IFTIs) worth more than $11 billion, over roughly five years. They also failed to pass source-of-funds information to downstream banks in the transfer chain — meaning other banks couldn't manage their own ML/TF risks. There were 76,000+ additional contraventions across other categories. Most disturbing: Westpac failed to monitor customers for transactions consistent with child exploitation. AUSTRAC initially identified 12 specific customers making suspicious transfers to the Philippines, Southeast Asia, and Mexico; a further review found 250 more.

On **October 21, 2020**, the Federal Court of Australia ordered Westpac to pay **$1.3 billion**. That is still the largest corporate fine in Australian history. Westpac admitted the contraventions, agreed the proposed penalty with AUSTRAC, and publicly committed to rebuilding its AML/CTF controls, data systems, policies, and processes. They spent five years doing that work.

Why does this give specific weight to my role? Because the 2026 AUSTRAC reform does not land at Westpac as a neutral regulatory update. It lands at a bank that has already paid the highest AML penalty in Australian history and has spent five years rebuilding its compliance backbone. My design decisions around provenance indicators (D6) and the legacy/reform mode indicator (D8) are not generic UX choices — they respond to a regulatory history Westpac knows intimately and has publicly committed to learning from.

Interview framing: "Westpac has a specific relationship with AUSTRAC compliance that makes banker-level evidence visibility more than a nice-to-have. My design treats it as foundational rather than additive." This is defensible because it's specific to Westpac, not generic.

---

## Chapter 3 — The Three Pains in the Brief

### Q16. What does "new banker errors" actually look like in real work?

New bankers don't usually make dramatic mistakes. They make small process failures that cascade downstream into rework and compliance risk.

The most common patterns (drawn from McKinsey's commercial banking onboarding research, Cognitive Group's RBC study which identified 88 distinct error types costing approximately $30 million per year, and commercial lending literature):

**Entity misclassification.** A new banker classifies a "family business" as a sole trader when it's actually a discretionary trust with a corporate trustee. This single misclassification invalidates all downstream CDD steps because the required documents are completely different. The deal hits compliance, bounces back, and the banker re-does hours of work.

**Incomplete data capture.** The banker onboards a customer but misses one required field — a beneficial owner, a source-of-funds declaration, a specific document. The deal proceeds, hits credit review, and gets kicked back. The banker now has to contact the customer, re-request information, and re-submit — often days later.

**Skipped verification.** The banker captures the customer's driver's license but forgets the required second-form verification for a higher-risk customer type. Compliance catches it, the deal returns, the customer forms a poor first impression.

**Misjudged risk level.** The banker assesses a customer as "standard risk" when they should be "enhanced due diligence" — for example, missing a foreign-jurisdiction exposure or a politically exposed person (PEP) in the ownership chain. This is high-stakes because AUSTRAC penalties follow real-world.

None of these are catastrophic in isolation. They're "I forgot a field" mistakes. But in aggregate, across hundreds of new bankers and thousands of deals per month, they produce substantial rework and real compliance risk. That's what Pain 1 targets — not dramatic failure, but the slow accumulation of small process errors that drag the whole system down.

### Q17. What does "senior banker skip" actually look like?

Senior banker skip is counter-intuitive. Why would an experienced banker who's been doing this for 15 years skip a required step? Shouldn't experience prevent errors?

The answer is in cognitive psychology: the **expertise reversal effect**. Expert performance relies on mental shortcuts called schemas — encoded patterns that say "this is what a typical deal looks like and this is what I need to do for it." For common product types, these schemas are finely tuned and very efficient. For rare product types, the schemas are out of date or just don't fit.

Concrete example: a senior banker who has done thousands of business term loans opens a new deal where the customer asks for a bank guarantee (where the bank promises to pay a third party if the customer defaults on a contract). The banker thinks "OK, bank guarantee, basically the same process." They start the deal, fill out customer details, assess cashflow — the muscle memory from term loans kicks in.

But bank guarantees have specific requirements that term loans don't: **beneficiary legal name and address** (the third party receiving the guarantee), **expiry date alignment with the underlying contract**, **term deposit as security**, and **paper issuance from a physical branch**. The senior banker doesn't fill these in because their muscle memory doesn't prompt for them. The deal moves forward, hits documentation review, and gets kicked back with "missing beneficiary, missing expiry, missing security." Rework.

Another example: a trust-structured loan where the banker applies "company" mental model instead of "trust" mental model — missing trustee duties, incomplete beneficiary verification, incorrect control structure. Or a partnership where the banker applies company-style ownership logic, missing that partnership control semantics are different.

All share one characteristic: the banker *has* the knowledge, but the variation in this specific deal doesn't visually break through the default pattern. That's the "variation visibility gap" my design targets.

Australian context: three of four major Australian banks have stopped offering bank guarantees to retail customers due to risk and complexity. Westpac's remaining bank guarantee business is a "specialized offering," not ordinary product. That makes the rare-product skip problem especially acute at Westpac.

### Q18. What does "no single view" actually mean?

Imagine a Westpac banker named Priya. She's partway through a business loan deal for a manufacturing customer. She needs to check three things right now: Has the PPSR search come back with any prior security interests on the customer's equipment? Has the customer uploaded their latest financials to the application portal? Has the compliance team approved the customer's risk rating?

Without a "single view," Priya has to answer each question separately. For the PPSR search, she logs into the PPSR automation interface and checks the status. For the customer's financial documents, she opens a different screen or the customer portal. For the compliance approval, she checks email or a compliance ticketing system.

Each of those switches takes 10–30 seconds of cognitive load. Priya has to remember which system holds what, log in (sometimes reauthenticate), find the specific deal among many, read the status, and mentally carry it back into the deal context. McKinsey calls this "swivel chair work" and identifies it as a major driver of banker productivity loss in commercial lending. Do it 20 times per deal × 5 deals per day = a huge tax on Priya's attention.

Here's the subtle part that changed my design: **"no single view" does NOT mean Priya needs a dashboard that shows all information at once.** Research from modern LOS vendors (nCino, Moody's, Baker Hill, Hawthorn River) reframes this. What Priya actually needs is a single coordinated workspace where information is sequenced around her next action. Not "show me everything," but "show me what I need for this step, and tell me clearly what's next."

That reframing is the biggest single move in my design direction. I initially assumed "single view" meant "unified dashboard." Industry research taught me it means "single guided workflow surface." That's why my Decision 5 is a progress spine with stage-specific checklist — not a parallel information display.

---

## Chapter 4 — The Design Decisions (plain-language rationale)

### D1. Dynamic checklist (reshapes by product × entity × jurisdiction)

**What:** When the banker selects product type, customer entity type, and any jurisdictional factors, the checklist automatically reshapes to show the specific mandatory steps for that combination.

**Problem it solves:** Every business lending deal is a different combination of product, entity, and geography, and each combination has different mandatory steps. Static checklists can't handle this. New bankers don't know which steps matter for their specific deal; senior bankers' muscle memory skips steps that only apply in rare combinations. A dynamic checklist makes variation visible instead of hiding it.

**Why it makes sense:** AUSTRAC itself structures its guidance by entity type — the regulator already models the problem this way. Hawthorn River, a US LOS vendor, publicly states "validation rules will vary based on the structure of the loan, borrowers, and collateral." This isn't a Westpac-specific bet; it's how the LOS industry has learned to design origination workflows.

**One-breath:** "Every business loan is a different combination of product, entity type, and geography, so the checklist rearranges itself to show you only the steps that matter for the deal you're working on — instead of making you wade through a generic list of every possible step."

### D2. Skip as friction, not hard block, with logged reason

**What:** When a banker tries to proceed past an incomplete checklist item, the system doesn't hard-block. It shows a lightweight dialog asking for a one-line reason, then lets the deal continue. The skip and its reason are logged for audit.

**Problem it solves:** Hard blocks create workaround behavior — bankers document things outside the system, escalate unnecessarily, or pressure compliance to approve exceptions. Silent skips create audit gaps where nobody knows why something was bypassed. Friction-with-reason is the middle path: it respects banker judgment, creates visibility, and produces data over time that makes skip patterns analyzable.

**Why it makes sense:** AUSTRAC's post-reform guidance explicitly says: *"Some initial CDD steps can be delayed where essential to avoid interrupting ordinary business."* That's a direct departure from the old "all boxes ticked before anything happens" mentality. My design operationalizes the regulator's own reform intent — it's not just a UX preference, it's AUSTRAC-aligned.

**One-breath:** "Instead of blocking the banker when they try to skip a step, the system asks for a one-line reason and records it — respecting banker judgment while creating an audit trail that compliance and the regulator can both read."

### D3. Inline expandable knowledge, not a separate chatbot

**What:** Each checklist item has a small "i" affordance that expands inline within the checklist row, revealing why this step is required, common mistakes for this specific product × entity combination, and links to the relevant policy or AUSTRAC guidance. Default state is collapsed.

**Problem it solves:** A separate chatbot fails new bankers because it forces them to leave the workflow, re-explain context, and formulate a question they don't yet know how to ask. Psychological safety research (Amy Edmondson, applied to banking by the Chartered Banker Institute) shows juniors delay asking questions due to reputation risk. An inline expansion removes the social cost of asking — but only when the banker chooses to engage with it.

**Why it makes sense:** NN/g (Nielsen Norman Group) research on progressive disclosure shows user-triggered revelation outperforms system-pushed help. It avoids banner blindness because users only open what they actively chose to open. And the knowledge is attached to the specific checklist item — context is always correct because the row knows what it's about.

**One-breath:** "Each checklist item has a small expandable help button built right into it, so a banker can see why something's required without leaving the workflow or having to type a question into a chatbot that doesn't know the deal context."

### D4. Progressive disclosure instead of Learning/Expert mode toggle

**What:** There is no mode toggle. Every banker sees the same checklist, the same expansion affordances, the same progress spine. Experience-level adaptation happens through contextual expansion — not by the banker declaring their experience level.

**Problem it solves:** Mode toggles create four bad outcomes: stigma (new bankers feel marked as beginners), false confidence (senior bankers claim "expert mode" on deal types they haven't seen recently), decision paralysis (users don't know which mode fits them), and discoverability problems (mode state can be hidden). Progressive disclosure avoids all four.

**Why it makes sense:** NN/g research explicitly recommends progressive disclosure over explicit toggles. And there's a deeper insight: expertise is actually product-specific, not banker-general. A senior banker may be expert on term loans and novice on trust lending. A binary toggle can't capture that granularity; contextual expansion can, because it responds to the deal profile rather than the banker profile.

**One-breath:** "Instead of asking the banker to declare 'I'm a beginner' or 'I'm an expert,' the same interface just lets anyone expand help on any step — so seniors stay compact on common products and expand only on the rare ones where they actually need it."

### D5. Progress spine as guided workflow surface, not a dashboard

**What:** The top of the deal home page is a horizontal progress spine showing lifecycle stages — Setup → Identification → Credit → Approval → Settlement — with the banker's current position visually emphasized. Below the spine sits the dynamic checklist for the *current* stage only, with next-action emphasis.

**Problem it solves:** A dashboard approach to "single view" tries to show all deal data at once, which increases cognitive load and creates banner blindness for non-critical information. The spine answers one question: "where am I, and what's next?" It doesn't try to be a data repository.

**Why it makes sense:** This is the biggest reframing in my design. Initially I assumed "single view" meant a unified dashboard. Industry research from nCino, Moody's Lending Suite, Baker Hill, and Hawthorn River all converges on the same pattern: "single view" in modern LOS means "single guided workflow surface," not "all information visible at once." Information is sequenced around the next unresolved action, not displayed in parallel. Four major industry references, one convergent answer.

**One-breath:** "Instead of a dashboard with every piece of deal data on one screen, it's a horizontal progress bar showing the stages of the deal with the current stage highlighted — and below it you only see what you need to do right now for this stage."

### D6. Provenance indicators for auto-filled data

**What:** Any field in BizEdge that is auto-populated from external systems (Company search, PPSR search, customer portal, previous records) shows a small provenance indicator: source + timestamp + confidence. Hover reveals details; banker can always override, and the override is logged alongside the original.

**Problem it solves:** BizEdge does automated Company search and PPSR search. These are sources of data the banker didn't personally verify. Without provenance, the banker is implicitly trusting the system without being able to defend that trust in an audit. Under the 2026 reform, banker decisions must be established on "reasonable grounds" — and "the system told me" is not reasonable grounds.

**Why it makes sense:** AUSTRAC's post-reform framework requires bankers to establish matters "on reasonable grounds," which means they need to justify each piece of evidence. Provenance indicators make that justification possible at the field level. Westpac's 2020 case is also a reminder of what happens when evidence visibility is weak at scale — decisions get made without a clear audit trail, and five years later you're paying a $1.3 billion penalty.

**One-breath:** "When the system auto-fills a field from an external source, a tiny indicator shows where it came from and when — so the banker can see at a glance whether to trust it or override, and auditors can see exactly how each decision was made."

### D7. Three-way task ownership — Banker / System / Customer

**What:** Every outstanding item in the checklist shows an owner indicator: Banker (action needed from me), System (automated processing in progress), or Customer (waiting on customer action). The banker can filter the checklist to "my actions only" to focus on their own queue.

**Problem it solves:** The brief says bankers don't know "what's outstanding." But there are different kinds of outstanding — some items are waiting on the banker, some on the system, some on the customer. Collapsing these into one "outstanding" bucket makes the banker chase items they cannot personally act on. That's wasted effort, lost focus, and mental noise.

**Why it makes sense:** The most important piece of evidence: BizEdge is a two-sided platform, not banker-only. Rich Data Co describes its contribution as *"a two-sided digital finance application form, which allows both customers and bankers to jointly work on an application."* That means "customer" in my design is not an abstract third actor — they're a real surface in the actual BizEdge architecture today. Three-way ownership mirrors the real shape of the platform, not an invented model.

**One-breath:** "Every task shows who owns it — banker, system, or customer — so the banker can filter to just their own actions instead of chasing items they're waiting on other people or the system for."

### D8. Legacy ACIP vs reform CDD mode indicator

**What:** The deal home page shows a persistent indicator at the top-right: "Initial CDD: Legacy ACIP (transition)" or "Initial CDD: Reform framework." Ongoing CDD is always under the reform framework, noted separately. The indicator is clickable, revealing why this framework applies and when the deal must transition.

**Problem it solves:** The AUSTRAC transition trap (Q14) means a single deal can be partially under old rules and partially under new rules. Senior bankers may assume one framework applies uniformly because "I heard we have until 2029." But ongoing CDD changed two weeks ago and applies immediately. Making the mode explicit prevents the banker from silently applying the wrong rules.

**Why it makes sense:** This is a temporary design artifact (relevant only until March 2029), but during the three-year transition it's a critical safeguard. The reform requires bankers to document their reasoning; an explicit mode indicator means framework-selection reasoning is built into the UI and available for audit rather than living only in the banker's head.

**One-breath:** "A small persistent label shows which AUSTRAC framework applies to this deal's initial CDD — legacy or reform — so senior bankers don't silently apply their old mental models during the three-year transition window when some deals span both frameworks."

---

## Chapter 5 — The Strategic Story

### Q19. Why is Westpac hiring so many business bankers right now?

Westpac is at a specific competitive moment. They trail NAB and CBA in Australian business lending market share — as of July 2025, Westpac sits at 16.1%, CBA at 18.85%, NAB at 21.6%. The gap is narrowing but not yet closed. Westpac wants to recover share, and they've publicly framed business lending as their strategic "shift in emphasis" — not a side portfolio, but a core profit driver. Paul Fowler, Chief Executive Business & Wealth, has used exactly that phrase publicly.

They're attacking the gap from two sides. **On the technology side**, they're investing in BizEdge — speeding up deal decisions, automating searches and document handling, reducing banker time-per-deal by approximately 90 minutes. That's the "technology half."

**On the people side**, they're scaling up the banker workforce. In November 2024, Westpac committed to hiring 200 additional business bankers by end of 2027 — roughly a 40% increase on the existing SME banker cohort. In September 2025, the target was publicly expanded to 350 new bankers over two years, with 135 already hired at that point (per Reuters citing a Paul Fowler briefing).

The two halves are linked — and this is the business case for my design. If you hire 350 new bankers but each one takes 30–100 days to become productive (per McKinsey's commercial onboarding research, primarily due to tooling fragmentation), you've created a massive learning-curve bottleneck. Every day a new banker is faster at producing compliant deals is real revenue for Westpac. My V1 checklist design targets that curve directly — not by improving the training, but by making the tool do more of the "when and why" work that training can't solve.

### Q20. What is UNITE achieving and what does it mean for my role?

UNITE is delivering measurable simplification across Westpac's products, processes, and systems. By March 2026, the publicly reported numbers are: 180+ applications decommissioned (legacy software retired), 70%+ of products simplified (fewer variations, cleaner offerings), 700+ processes streamlined. The program is reportedly on scope, on time, and on budget — a rare claim for multi-year bank transformation.

Three implications for my role:

**First, I'm not designing into a legacy mess.** BizEdge isn't layered over a broken platform — it's layered over a platform that's actively getting simpler. Every one of those 180+ retired applications is a system bankers used to have to swivel-chair between. Each retirement removes friction that my design would otherwise need to compensate for.

**Second, UNITE framing gives me a defensible answer to the hardest devil's-advocate attack.** If an interviewer says "Westpac has cultural and complexity issues UX can't fix. A prettier checklist won't fix the bank," my answer is: "I'm not claiming UX fixes culture. I'm claiming my design rides the UNITE wave. UNITE is delivering — 180+ applications decommissioned, 70%+ products simplified. If UNITE were failing, my design would fail too. Because UNITE is delivering, my design operationalizes that progress at the banker's workstation." The framing is specific (with numbers) and humble (doesn't over-claim UX impact).

**Third, it signals strategic alignment.** My design choices — dynamic checklist, progress spine, three-way task ownership — are all about making the simplified platform usable at scale. UNITE is the back-end simplification; my design is the front-end translation of that simplification into daily banker experience. The two layers need to be coherent, and my design is explicit about that coherence.

### Q21. What did Dr Martin Anderson say about AI in BizEdge, and why should I care?

Dr Martin Anderson is Westpac's Head of Technology for Business Lending and B&W UNITE. His team won Westpac's Team of the Year 2025 for their BizEdge work. He's a senior technology executive and he speaks publicly about where BizEdge is going.

At the AWS Financial Services Symposium in Sydney earlier this year (early 2026), Anderson said, verbatim from the iTnews report:

> *"People are going to be surprised by how these sequences are going to be reorganised, resequenced, rewired. It's not just going to be a case of adding in AI-specific points; it's actually reimagining the process so that you can actually optimise it to leverage AI and all the various capabilities. Whether it's within documentation, KYC, annual reviews, credit decisioning, the writing of credit memos, even communications — the whole end-to-end sequence of business lending can be optimised."*

Why should I care? Because this quote is direct executive backing for my V2 design thesis.

My V2 argues that BizEdge shouldn't just add AI features on top of the existing workflow — it should be reimagined around AI as an ambient teammate that watches deal state and surfaces context proactively. I arrived at that conclusion independently, from cognitive psychology (expertise reversal effect) and my own experience building a Slack-based AI companion. Then, while researching this challenge, I found Anderson's quote, which says the same thing in Westpac's own voice.

That's not borrowed authority — it's **convergent evidence**. In the interview, I can say: "The V2 direction isn't speculation. It's aligned with what your Head of Technology for Business Lending publicly said the platform's evolution looks like. I'm proposing one specific version of what that reimagining could mean at the banker's workstation."

The framing protects V2 from the "this is too speculative for a take-home" pushback. The direction has executive backing; the risk is in the specific execution, which is where I'd want real user testing.

### Q22. If an interviewer asks "why this role, why now?"

Two sentences:

**Sentence 1:** *"Westpac is at the convergence of three forces — a competitive push to regain business lending market share, the AUSTRAC reform that commenced two weeks ago and invalidates some senior banker muscle memory, and a massive banker hiring push that creates a learning-curve bottleneck — and all three pressures land at the banker's workstation inside BizEdge."*

**Sentence 2:** *"That makes the Senior Experience Designer role for BizEdge the single highest-leverage design role in Australian business banking right now, because the interface layer is where those three pressures become actionable — or become failure modes."*

Why does this framing work?

- It's **specific**, not vague. Three named forces, each tied to numbers (market share gap, hiring targets, reform date).
- It **ties the role to strategy**, not to my preferences. I don't say "I love Westpac" or "this is my dream job." I say "here is the specific strategic moment; here is why the interface layer is the one that matters at this moment."
- It positions my contribution as **leverage, not decoration**. "Single highest-leverage design role" is a claim that's either true or not, and the rest of my presentation either justifies it or doesn't.
- It avoids generic phrases. No "exciting opportunity," no "mission-driven," no "passion for fintech." Just forces, framing, and leverage.

Memorize the *shape* of the two sentences, not the exact words. On the day, say it in phrasing that feels natural. The thing that matters is the structure: (1) three specific converging forces, (2) the interface layer is where they become actionable.

---

## Uncertainty flags — review before interview

- **Q3 / BizEdge launch date.** insights.md explicitly flags that the exact BizEdge platform launch date is not verified. "April 2023" refers to the SIMPLE+ credit pathway launch, not BizEdge itself. Westpac's January 2023 Rich Data Co partnership announcement mentions AI in business lending but does not name BizEdge. If the interviewer asks when BizEdge launched, the honest answer is "Westpac has publicly disclosed SIMPLE+ launching in April 2023, but the exact BizEdge platform launch date isn't in the public materials I found."
- **Q7 / UNITE acronym.** I couldn't find a public source confirming what UNITE stands for as an acronym. Treat it as a program name. If asked, say "I saw UNITE referenced in Westpac's FY25 and 1Q26 disclosures as the multi-year simplification program, but I couldn't find a public source for what the letters stand for."
- **Q19 / Hiring numbers source.** The 200 → 350 progression from November 2024 to September 2025 is documented via Reuters citing Paul Fowler's briefings. The 135 already hired figure is from the September 2025 Reuters report. Both should be safe to cite but double-check before the interview if asked for a primary source.
- **JPMorgan Coach AI reference (not in this primer, but in insights.md).** The "10–20% efficiency lift" figure is flagged in insights.md as tertiary trade press; do not cite a specific percentage in the interview. Frame as "JPMorgan reportedly uses an AI companion tool called Coach for junior bankers" and leave the numbers out.

---

*End of primer. Read cover-to-cover once; then skim the questions that feel shaky the morning of the interview.*
