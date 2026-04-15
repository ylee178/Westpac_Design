# Miro Design Rules
# Referenced from CLAUDE.md whenever generating or modifying Miro artifacts

This document defines the visual language for all Miro artifacts in the Westpac_design vault. Every Miro-generation script should load these rules and apply them consistently. The goal is a professional analytical artifact that reads clearly cold — not a workshop capture.

## Primary use case

Sean should be able to open any Miro artifact in this vault days or weeks later and understand the full context without needing to reference insights.md, decisions.md, or talking-points.md. Each artifact is a self-contained visual knowledge base.

This means every text element must be substantive enough to stand alone. Compressed memory-trigger notes are not acceptable for this pipeline.

## Canvas strategy

- Miro free tier: 3 boards maximum
- Approach: single board, multiple frames, one frame per artifact (plus Korean twin)
- Frame sequence: 01_affinity → 02_personas → 03_journey → 04_blueprint (each with EN + KO twin)
- Frames laid out horizontally so Shift+1 reveals all artifacts at once
- Frame spacing: minimum 800px gap between frames (wide enough to hold a Korean twin without overlap)
- Each frame is self-contained and presentable individually

## Element types

### Rectangles (not sticky notes)
- Use Miro's shape tool to create rectangles, not sticky notes
- No rotation. No random offsets. Grid-aligned or soft-aligned only.
- Corner radius: 8px (slightly rounded, professional, not pill-shaped)
- Drop shadow: subtle (0 2px 6px rgba(0,0,0,0.10))
- Border: 1px solid in a slightly darker shade of the fill color
- Padding inside: 20px
- Default size: 320x240px (primary content), 280x200px (supporting), 400x280px (hero/pain statement)

### Text rules per rectangle
- Minimum 60 words, maximum 100 words per rectangle
- Structure: claim (1 sentence) → why it matters (1-2 sentences) → how it connects to thesis or a mapped design decision (1 sentence)
- Font: system-ui, 14-15px, line-height 1.4
- Text color: #1A1A1A (near-black)
- Alignment: left-aligned, top-anchored
- No bullet lists inside rectangles — use flowing prose
- Source reference at bottom in italic 10px gray: "insights.md → [section]"

### Connectors
- Dashed lines, #999, 1.5px weight
- No arrowheads (show relationship, not direction)
- Connect meta cluster to each dimension cluster
- Connect Anderson badge to the cluster it validates (diagnostic or meta)

### Cluster labels
- Bold headings above each cluster group
- 28-32px, system-ui, dark (#1A1A1A)
- Two-line format: "CLUSTER NAME" on top, "framing question" below in regular weight
- Example: "SPATIAL" / "where am I?"

### Frame title
- Top of each frame: 40-48px, bold, dark
- Subtitle below: 16-20px, regular, medium gray (#666)
- Example: "01 — Affinity Diagram" / "Research synthesis: context scarcity across three dimensions"

## Color palette

### Cluster fills (use Miro's shape fill, not sticky note colors)
- Meta (Context Scarcity): #FFF4B8 (warm yellow, soft)
- Cluster 1 Spatial: #D8E9F7 (soft blue)
- Cluster 2 Procedural: #F8DDE7 (soft pink)
- Cluster 3 Diagnostic: #DDEDCF (soft green)
- Strategic context: #E8DFF5 (soft lavender)
- External validation (Anderson badge): #2D2D2D (dark) with white text

### Borders (slightly darker than fill)
- Meta: #E8D868
- Spatial: #A8C5E3
- Procedural: #E8B5C8
- Diagnostic: #B8D4A0
- Strategic: #C8B5E0

### Visual hierarchy (within a cluster)

#### Hero rectangles — Pain statement (400x280)
- Larger than standard (400x280)
- Thicker border (2px instead of 1px)
- Label "PAIN" in small caps at top in bold (#666)

#### Pivot rectangles — REFRAME moment (340x260)
- Slightly larger than standard
- Thicker border (2px)
- Label "REFRAME" in small caps at top in bold (#C44)
- This is the turning point of the cluster's story

#### Evidence rectangles — supporting research (320x240)
- Standard size
- Normal 1px border
- Label "EVIDENCE" in small caps at top in regular weight (#666)

#### Decision mapping rectangles — conclusion arrows (300x180)
- Smaller, shorter
- Normal 1px border
- Different fill tint (10% darker than cluster base color)
- Label "→ DECISION" in small caps at top in bold (#006)
- Content explicitly names which design decision and why

## Content rules

### Reading order within a cluster
Every cluster must follow this vertical flow, top to bottom:
1. PAIN statement (hero) — what the brief says
2. REFRAME (pivot) — what the research revealed about the real problem
3. EVIDENCE (2-4 rectangles) — sources supporting the reframe
4. → DECISION mapping (1-2 rectangles) — which design decisions this cluster produced

This creates a narrative arc the reader can follow top-to-bottom.

### Rectangle count per cluster
- Meta cluster: 2-3 rectangles (thesis, context dimensions, speed-to-judgment framing)
- Each dimension cluster: 6-8 rectangles total
  - 1 PAIN (hero)
  - 1 REFRAME (pivot)
  - 3-5 EVIDENCE
  - 1-2 → DECISION
- Strategic context strip: 5-6 rectangles
- Anderson badge: 1 element
- Glossary panel: 1 element (per frame)

### What to cut from the current board
When rewriting, cut or merge low-value items:
- JPMorgan Coach AI (tertiary source, weak signal)
- Generic "common junior errors" bullet (merge into McKinsey rectangle)
- Redundant "error ≠ rework" caveat sticky (merge into relevant pain)
- Any rectangle that only restates a claim without adding "why" or "how connected"

Total target: approximately 25-30 rectangles across the whole frame, down from the current 37+.

## Glossary and terminology rule

Sean must be able to read any frame cold without looking up abbreviations, institution names, or industry terms. Every frame must be self-explaining on terminology.

### When to expand terms inline
- On the first substantive use within a rectangle, expand the term in plain language alongside the abbreviation
  - Example: "AUSTRAC (Australia's anti-money-laundering regulator)" rather than bare "AUSTRAC"
  - Example: "CDD (Customer Due Diligence — the process to verify who a customer is and assess money-laundering risk)"
- Subsequent uses within the same rectangle: short form only
- Keep inline expansions to 5-12 extra words — don't bloat the rectangle past its 100-word budget
- When a rectangle is specifically ABOUT the term, the glossary handles the definition and the rectangle can use the bare term

### Glossary panel (one per frame)
Every frame must include a dedicated Glossary panel at the very bottom of the frame, below the strategic context strip.

**Purpose:** single source of truth for every abbreviation, institution, platform, product, and industry term used anywhere in the frame. When a reader sees an unfamiliar term, they glance at the glossary instead of opening insights.md or a browser.

**Panel structure:**
- Background: light gray (#F5F5F5)
- Border: 1px solid #D0D0D0, corner radius 8px
- Text: 11-12px, #4A4A4A
- Layout: 3 or 4 columns for space efficiency
- Width: spans most of the cluster area above
- Height: 200-500px as needed — expand to fit content
- Label at top: small caps, bold, 14px, "GLOSSARY" (#333)
- Grouped by category with sub-headings:
  - Regulation & Compliance
  - Technology & Platforms
  - Products
  - Industry Terms
  - Institutions & People

**Each entry format:** **Term** — contextual plain-language definition (see "Glossary content discipline" below), aligned with how the term is used in the frame's content and in insights.md.

### Dynamic glossary sizing
The glossary includes only terms actually used in the frame, not the entire vault vocabulary. For frames with high term density (25+ terms used), switch from 3-column to 4-column layout to keep vertical footprint under 600px. If glossary would exceed 600px height, split category headers into more compact pills rather than expanding vertically. The glossary supports the frame; it should never visually dominate it.

### Terms that must always be defined
Whenever any of the following terms appear anywhere in a frame, the frame's glossary must include them. This list is the Westpac_design vault's core vocabulary:

**Regulation & Compliance:** AUSTRAC, AML/CTF, CDD, ACIP, PPSR, KYC, PEP, FATF, reasonable grounds, beneficial owner, enhanced CDD, IFTI, initial CDD, ongoing CDD.

**Technology & Platforms:** LOS (Loan Origination System), BizEdge, SIMPLE+, CLO (Conditional Limit Offer), nCino, Moody's Lending Suite, Baker Hill, Hawthorn River, Backbase, Rich Data Co / RDC, AWS, agentic AI.

**Products:** Bank guarantee, business term loan, overdraft, trust lending, partnership lending, equipment finance, trade finance.

**Industry Terms:** TTD (time to decision), swivel chair work, credit memo, expertise reversal effect, progressive disclosure, psychological safety, assembly-line metaphor, two-sided platform.

**Institutions & People:** Westpac, NAB, CBA, ANZ, Judo Bank, RBC, B&W (Business & Wealth), UNITE (Westpac simplification program), Dr Martin Anderson, McKinsey, NN/g (Nielsen Norman Group), Cognitive Group, FirstAML, Hall & Wilcox, Chartered Banker Institute, Amy Edmondson.

### Glossary content discipline
- Every term in the glossary must also appear in at least one rectangle on the frame — don't include dead terms
- Definitions should include **contextual significance to this vault**, not just generic dictionary definitions. Each definition must answer two questions: *what is this term*, AND *why does it matter in the context of this research*. Include anchors like dates, amounts, or connections to other vault concepts when they aid recall.

  Example of generic (avoid):
  "AUSTRAC — Australia's financial intelligence agency responsible for AML/CTF regulation."

  Example of contextual (prefer):
  "AUSTRAC — Australia's AML/CTF regulator. Issued Westpac's $1.3B fine in 2020 and introduced the March 2026 reform that reframes the whole vault's thesis on senior banker skip urgency."

  The contextual version takes slightly more space but gives Sean instant recall of why the term matters when he returns weeks later.

- For terms not explicitly defined in insights.md (e.g., "LOS"), use plain professional knowledge with a neutral tone — but still anchor to vault context where possible. Example: "LOS — loan origination system category. nCino is the market leader Sean's thesis references; BizEdge is Westpac's in-house equivalent."
- Don't define common-knowledge terms that don't need explanation in a banking context (e.g., "loan", "bank", standalone "AI", "customer")
- Keep each definition to 2-3 lines (~25-40 words) to accommodate contextual significance. Trim if it runs longer — the rule is "what + why it matters here", not "every fact".

## Korean version support

Sean is bilingual Korean/English. For artifacts in this pipeline, each English frame has a Korean twin frame by default.

### When to create a Korean version
- Default: **ALWAYS create both English and Korean frames for every artifact in this pipeline**
- The Korean frame is generated in the same run as the English frame, positioned adjacent with minimum 800px gap
- Sean can explicitly say "English only" to skip Korean generation for a specific frame, but the default is always both
- This is because Sean is bilingual and uses the vault primarily for personal understanding and recall, not just for the interview. The interview is in English, but the recall happens in whichever language is cognitively easier at the moment of review.
- Korean version is always a separate frame — never bilingual rectangles mixing both languages on one surface

### Korean frame structure
- Same layout as the English frame: meta center, three dimension clusters radiating, strategic context strip, Anderson badge top-right, glossary panel at the very bottom
- Same rectangle count and visual hierarchy
- Positioned adjacent to the English frame with minimum 800px horizontal gap
- Frame title bilingual for traceability:
  - Main title in Korean: "01 — 어피니티 다이어그램"
  - Subtitle in English in medium gray: "Korean version of 01 — Affinity Diagram: Research synthesis — context scarcity across three dimensions"

### Korean content rules
Translate the claim → why-it-matters → how-it-connects structure faithfully, not literally. Use natural Korean at senior-designer tone.

**Always preserve original English for:**
- Direct AUSTRAC quotes (regulatory text stays in original language for accuracy)
- Dr Martin Anderson's direct quote (original speaker, original wording)
- Institution names: Westpac, NAB, CBA, ANZ, Judo Bank, AUSTRAC, APRA, ASIC
- Platform/product names: BizEdge, SIMPLE+, nCino, Moody's Lending Suite, Baker Hill, Hawthorn River, Backbase, Rich Data Co, AWS
- Industry term abbreviations: LOS, CDD, AML/CTF, PPSR, KYC, TTD, CLO, PEP (term stays English; Korean glossary explains)
- Numeric figures and currency: "$1.3 billion", "45%", "16.1%"
- Westpac-specific program names: UNITE, B&W, SIMPLE+
- Design decision labels: D1–D8

### Korean glossary
- Separate glossary panel per Korean frame (don't share with English frame)
- Term stays in English; definition is in Korean
- Contextual principle applies (same as English glossary): definitions answer "what + why it matters in this vault"
  - Example: "AUSTRAC — 호주의 AML/CTF 규제기관. 2020년 Westpac에 $1.3B 벌금을 부과했고, 2026년 3월 개혁으로 vault의 senior banker skip urgency 프레임을 다시 세움."
  - Example: "CDD (Customer Due Diligence) — 은행이 고객 신원을 확인하고 자금세탁 위험을 평가하는 절차. entity type별로 요구사항이 달라져서 D1 Dynamic checklist의 핵심 근거가 됨."
- Category headers in Korean with English in parentheses:
  - 규제 및 컴플라이언스 (Regulation & Compliance)
  - 기술 및 플랫폼 (Technology & Platforms)
  - 상품 (Products)
  - 업계 용어 (Industry Terms)
  - 기관 및 인물 (Institutions & People)

### Korean visual rules
- Same color palette, sizing, and hierarchy as English frame
- Font family with Korean fallback: `system-ui, -apple-system, "Apple SD Gothic Neo", "Noto Sans KR", sans-serif`
- Font size: same as English (14-15px body), but line-height 1.5 (slightly more breathing room for Korean characters)
- Rectangle sizes: same as English — Korean text may run slightly longer after translation; if it overflows, shrink body text 1px before resizing the rectangle
- Hero and pivot rectangles can use 15-16px body text for better Korean readability

## Layout

### Meta cluster placement
- Dead center of the frame
- 2-3 rectangles stacked vertically
- Core thesis rectangle at top, supporting thesis rectangles below

### Dimension cluster placement
- Spatial (Cluster 1): left of meta, reading order top-to-bottom
- Procedural (Cluster 2): right of meta, reading order top-to-bottom
- Diagnostic (Cluster 3): below meta, reading order top-to-bottom
- Each cluster connected to meta with a dashed line
- Minimum 250px between each cluster and meta cluster
- Minimum 200px between rectangles within a cluster (vertical), 100px (horizontal if 2-column within cluster)

### Strategic context strip
- Horizontal row below all three dimension clusters
- Lower visual weight: lighter fill, smaller text (13px)
- Label "STRATEGIC CONTEXT — why this matters now" above
- This is framing context, not a 4th dimension cluster

### Anderson badge
- Top-right corner of the frame
- Connected to the Meta cluster (or Diagnostic cluster) with a dashed line labeled "validates thesis"
- This makes the badge's relationship to the rest of the board explicit

### Glossary panel
- Very bottom of the frame, below the strategic context strip
- Spans most of the frame width
- Minimum 150px vertical gap between strategic strip and glossary panel
- Glossary must be the lowest element on the frame — nothing below it

### Whitespace and breathing room
- Frame must not feel crowded
- Total frame size should accommodate all elements with comfortable margins — expand frame bounds if needed
- When in doubt, add more space, not more content

## Don't

- Don't rotate elements. Everything orthogonal.
- Don't use sticky notes. Rectangles only.
- Don't write claims without context. Every rectangle must earn its space by adding "why it matters" and "how it connects."
- Don't use handwriting fonts or casual styling. Professional analytical artifact.
- Don't crowd the frame. Whitespace is part of the readability.
- Don't create new clusters or add items not in insights.md.
- Don't use an abbreviation without either inline expansion on first use OR inclusion in the glossary panel. Every term earns its way onto the frame.
- Don't mix English and Korean inside a single rectangle. Korean frames are separate, and terms that must stay English (quotes, institution names) are preserved as islands within Korean prose.
- Don't clear existing frames when rebuilding or iterating — create new frames next to existing ones so previous versions remain as backup until Sean explicitly approves deletion.

## See also
- CLAUDE.md — the map that references this file
- .claude/insight-protocol.md — protocol for adding new content to insights.md before Miro regeneration
- .claude/source-tiers.md — source tier definitions
