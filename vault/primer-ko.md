# Primer: Westpac Business Lending Design Challenge (한국어)

이 문서는 개인용 배경 문서입니다 — 인터뷰 딜리버러블이 아닙니다. 목요일 인터뷰 전에 도메인을 내 언어로 설명할 수 있도록 만들기 위한 것. 인터뷰 전날 밤에 insights.md, decisions.md, talking-points.md를 급하게 외우지 않아도 되도록. 각 질문은 독립적이라 원하는 곳으로 건너뛰어도 됨. 톤은 "커피 한잔 하면서 똑똑한 친구에게 설명하는" 느낌.

불확실한 항목들은 파일 맨 아래 "Uncertainty flags" 섹션에 정리.

---

## Chapter 1 — 무대 (Who / What / Where)

### Q1. Westpac은 누구인가?

Westpac은 호주의 "Big Four" 은행 중 하나다. Big Four는 호주 retail/commercial banking을 지배하는 네 개의 대형 은행 — Westpac, CBA (Commonwealth Bank), NAB (National Australia Bank), ANZ — 를 말한다. 이 네 곳이 합쳐서 호주 banking의 약 75-80%를 차지한다. Westpac은 1817년 시드니에서 설립된 호주에서 가장 오래된 은행이다. 호주라는 나라가 1901년 연방국가가 된 것보다 거의 100년이 앞선다.

**지금 이 순간의 경쟁 포지션이 중요하다.** Business lending 시장 점유율 기준, 2025년 7월 Reuters 기준으로 NAB 21.6%, CBA 18.85%, Westpac 16.1%. Westpac은 격차를 좁히고 있지만 여전히 3위. 그리고 business lending은 Westpac의 "side bet"이 아니다 — Business & Wealth division이 H1 FY25에서 A$1,096M의 이익을 냈고, 이는 Group 전체 이익(A$3,317M)의 약 33%다. 즉 내가 지원하는 역할은 "Westpac 수익 엔진의 핵심 부분"에 대한 디자인 역할이다.

내가 디자인하는 대상은 스타트업이나 소규모 핀테크가 아니다. 200년 된 거대 기관이고, 실제 규제 흉터(2020년 AUSTRAC 사건 — Q15 참조)가 있고, business lending 시장 점유율을 공개적으로 "shift in emphasis"라는 표현으로 되찾으려 하는 순간의 은행이다. 이 맥락이 내 모든 design 결정을 형성한다.

### Q2. "Business lending"이 "personal lending"과 뭐가 다른가?

일반적으로 "대출"이라고 하면 대부분의 사람은 주택담보대출, 자동차 할부, 신용카드를 떠올린다. 이건 모두 **personal lending**이다 — 은행이 개별 인간에게 대출해주며, 그 사람의 월급, 신용 이력, 개인 재정 상태를 기준으로 판단한다.

**Business lending은 완전히 다른 게임**이다. 은행이 "business entity" — 즉 sole trader(1인 사업자), 회사(company, Pty Ltd), 파트너십, 트러스트, 또는 대기업 — 에 대출해주는 것이다. 은행은 그 사업체가 현금을 창출하고 상환할 수 있는지에 베팅한다. 개인의 월급이 아니라.

왜 더 어려울까? 세 가지 이유.

**첫째, 법인 구조가 법적으로 복잡하다.** "가족 trust가 소유한 회사"는 "John이 차 사려고 대출받는 것"과 완전히 다른 법적 객체다. **둘째, 금액이 크고 deal이 커스텀이다.** 소기업 loan은 $500K 수준, mid-market commercial loan은 수천만 달러까지 간다. 각 deal이 협상되지, 진열대에서 선택하는 게 아니다. **셋째, risk analysis가 다르다.** 단일 credit score를 보는 게 아니라 재무제표, 산업 동향, 담보, 보증을 모두 분석해야 한다. 때로는 고객사의 이사회 구성까지 들여다봐야 한다.

Business lending은 또한 은행들이 **관계**로 가장 치열하게 경쟁하는 영역이다. 대부분의 business 고객은 자신의 사업을 잘 아는 전담 banker를 배정받는다. 그 관계의 깊이를 대규모로 지원하는 것 — 그게 BizEdge가 존재하는 이유다.

### Q3. BizEdge가 뭔가?

BizEdge는 Westpac의 in-house business lending origination 플랫폼이다. "Origination"이란 대출의 "생성" 단계 — 즉 신규 대출의 setup, credit 분석, 승인, 문서화, booking — 를 말한다. BizEdge는 Westpac banker가 business 고객을 위해 이 모든 작업을 수행하는 cockpit이다.

Westpac이 공개한 검증된 수치들:
- **45% TTD 단축** (Time to Decision — 신청에서 credit 결정까지의 시간)
- **75%+ 자동 decisioning**
- Simple deal의 경우 **신청에서 settlement까지 4시간 미만**
- **$43bn의 Conditional Limit Offer** (기존 고객에 대한 사전 승인 한도) 제공
- SIMPLE+ credit pathway: **2023년 4월 이후 7000+ application 처리**

Westpac이 공개적으로 언급한 기능들: customer data 사전 입력, 자동 Company search (호주 사업자 등록부에서 검증), 자동 PPSR search (기존 담보권 확인), 문서 관리 간소화, banker가 정책이나 상품 정보를 물어볼 수 있는 "real-time knowledge assistance" AI layer.

**리서치로 발견한 중요한 통찰: BizEdge는 two-sided 플랫폼이다.** 순수 banker 도구가 아니다. Business 고객이 사전 입력을 할 수 있고 신청 상태를 실시간으로 추적할 수 있는 customer-facing 면이 있다. Rich Data Co는 자신의 기여를 "a two-sided digital finance application form, which allows both customers and bankers to jointly work on an application" 이라고 기술한다. 이 사실이 내 Decision 7 (three-way task ownership)의 핵심 근거다 — "customer"가 추상적 actor가 아니라 실제 BizEdge 아키텍처 안에 존재하는 실제 surface다.

### Q4. LOS (Loan Origination System)가 뭔가?

LOS는 "Loan Origination System"의 약자. 특정 제품이 아니라 소프트웨어 카테고리다. **"Banker가 loan deal을 생성할 때 사용하는 운영 체제"** 정도로 생각하면 된다.

현대 LOS 플랫폼이 존재하기 전에는, banker들이 email, Word 문서, 스프레드시트, 여러 legacy 시스템을 오가며 loan을 조립했다. 고객 ID는 한 시스템에서 수집, credit analysis는 다른 시스템에서 수행, approval은 email로 처리, 최종 loan은 또 다른 시스템에 booking. Banker는 시스템 간에 정보를 복사하는 데 엄청난 시간을 썼다 — McKinsey는 이를 **"swivel chair work"**라고 부른다 (옆 모니터로 의자를 돌려서 데이터를 다시 입력하는 행위). 실수가 발생하는 정확한 지점이기도 하다: 데이터가 잘못 전사되고, step이 잊혀지고, context가 사라진다.

현대 LOS는 이 모든 것을 하나의 플랫폼에 통합한다. 고객 데이터, credit check, approval workflow, document handling, 최종 loan booking — 이상적으로는 한 coordinated workspace에서. LOS는 banker가 new deal을 만들 때 하루의 대부분을 보내는 곳이다.

전 세계적으로 여러 LOS vendor가 있다. 시장 선도자는 **nCino** (Q5 참조). 다른 주요 이름들: Moody's Lending Suite, Baker Hill (mid-market US), Hawthorn River (US community bank 중심), Backbase. 대부분의 LOS는 SaaS로 판매된다. Westpac은 다른 길을 선택해서 **BizEdge를 자체 구축(in-house)** 했지만, AI decisioning을 위해 Rich Data Co 같은 파트너를 활용한다.

### Q5. nCino가 뭐고 왜 계속 나오는가?

nCino는 commercial banking에서 전 세계적으로 지배적인 cloud-based LOS다. **"commercial lending의 Salesforce"** 정도로 생각하면 된다 — 실제로 Salesforce 인프라 위에 구축되어 있다. 2012년에 legacy LOS에 좌절한 전직 banker들이 설립했고, 2020년 NASDAQ에 상장했으며, 현재 전 세계 1,200개 이상의 금융 기관에 서비스를 제공한다.

왜 내 리서치에 계속 나오는가? 세 가지 이유.

**첫째, 이게 벤치마크다.** 업계가 "modern LOS workspace가 어떻게 생겼나"를 말할 때, 종종 nCino를 의미한다. nCino의 "single sheet method" (관계 맥락, 제안 필드, 활동 이력을 하나의 workspace에 lifecycle progression 중심으로 통합한 구조화된 dossier)가 내 progress spine이 차용한 industry 패턴이다.

**둘째, Judo Bank가 nCino를 사용한다.** Judo는 호주의 신생 business lending 도전자로 SME banking에서 매우 좋은 평판을 갖고 있다 (NPS 70 공개 보고). 그들은 nCino 위에 플랫폼을 구축했다. 종종 "the human touch at scale" 사례 연구로 인용된다 — Big Four의 process 중심 접근에 대한 직접적인 반례.

**셋째, 그리고 이게 전략적 시그널이다: Westpac과 nCino는 2023년 11월 Rich Data Co의 US$17.5M Series B를 공동 주도했다.** 이는 Westpac이 nCino를 멀리서 지켜보고 있는 것이 아니라는 뜻이다. 그들은 같은 AI decisioning 플랫폼에 nCino와 함께 돈을 넣었다. 내가 nCino의 패턴을 따라 디자인한다는 것은 Westpac이 이미 전략적으로 움직이고 있는 방향으로 디자인한다는 뜻이다.

### Q6. Rich Data Co는 뭐고 BizEdge에서 뭐를 하는가?

Rich Data Co (RDC)는 AI decisioning 플랫폼 회사다. Westpac이 2023년 1월 RDC와 파트너십을 맺고 BizEdge에 AI를 내장했다 — 구체적으로는 business lending decisioning에. 목표는 고객 거래 데이터와 재무 시그널을 패턴 분석해서 deal을 미리 평가함으로써 loan 결정을 가속화하는 것이었다.

2023년 11월, RDC는 US$17.5M Series B 라운드를 모금했다. Westpac과 nCino가 공동 주도했다. 그 투자가 Westpac의 LOS-and-AI 전략에 대한 시그널이다: 그것은 글로벌 시장 선도자가 베팅하는 같은 도구와 기술 방향을 가리킨다.

**내 디자인에 중요한 RDC의 기여 특정 부분:** RDC는 자신의 BizEdge 통합을 "a two-sided digital finance application form, which allows both customers and bankers to jointly work on an application" 이라고 기술한다. 이 문구가 두 가지를 알려준다. 첫째, BizEdge는 customer-facing 면을 가지고 있다 — 순수 banker 인터페이스가 아니다. 둘째, customer와 banker가 동일한 application 객체에 대해 상태를 공유한다 — 고객이 문서를 업로드하거나 질문에 답하면 banker 쪽에서 즉시 업데이트된다.

이것이 내 Decision 7 (three-way task ownership: Banker / System / Customer)의 근거가 된다. 내 checklist의 "customer" actor는 추상적 design construct가 아니다 — 실제 BizEdge 아키텍처 안의 실제 surface다. 감사 피드백(audit)에서 Decision 7이 내 가장 약한 decision이라고 flag 됐는데, RDC 발견이 이를 뒤집었다.

시드니 AWS Financial Services Symposium에서 RDC의 Gordon Campbell도 "how we can bring products to market that safely use agentic capability"를 작업 중이라고 언급했다. 이건 내 V2 AI teammate 개념과 관련이 있다.

### Q7. UNITE가 뭐고 왜 design context에 중요한가?

UNITE는 2024년 시작된 Westpac의 다년도 변혁 프로그램 이름이다. [uncertain — UNITE가 무엇의 약자인지에 대한 공개 출처를 찾지 못했다]. 실무적으로는, Westpac이 전 은행의 상품, 프로세스, 시스템을 단순화하는 우산 프로그램이다.

왜 내 design에 중요한가? 세 가지.

**첫째, BizEdge는 UNITE 내부에 있다.** Business lending origination은 많은 UNITE workstream 중 하나다. 내가 BizEdge를 위해 디자인할 때, 나는 아래에서 적극적으로 단순화되고 있는 플랫폼 위에 디자인하고 있다.

**둘째, UNITE는 측정 가능한 성과를 내고 있다.** 2026년 3월 기준 Westpac의 공개 보고: **180+ 애플리케이션 폐기(decommissioned)**, **70%+ 상품 단순화**, **700+ 프로세스 간소화**. 이 프로그램은 scope, 일정, 예산 모두 준수 중이라고 보고됨 — 다년도 bank transformation에서는 드문 주장. PowerPoint 약속이 아니라 측정 가능한 결과들이다.

**셋째, 그리고 이게 인터뷰 당일의 수사적 보상이다:** 프레젠테이션에서 나는 "내 design은 UNITE의 wave를 타고 간다, 그 wave와 싸우지 않는다"라고 정직하게 말할 수 있다. UNITE가 실패하고 있다면 내 design도 실패할 것이다. UNITE가 delivering 하고 있기 때문에, 내 design은 그 progress를 banker의 workstation에서 operationalize한다. 이 프레이밍은 방어 가능하다 — 구체적이기 때문에 (180/70/700 숫자를 지목할 수 있다), 그리고 겸손하기 때문에 (UX 혼자서 Westpac을 고친다고 주장하지 않는다).

---

## Chapter 2 — 규제 배경

### Q8. AUSTRAC이 뭔가?

AUSTRAC은 Australian Transaction Reports and Analysis Centre의 약자 — 호주의 금융정보분석원이자 자금세탁방지 규제기관. 쉬운 말로, AUSTRAC은 호주 은행들이 자금세탁, 테러자금조달, 기타 금융 범죄를 방지하기 위해 무엇을 해야 하는지를 말해주는 정부 기관이다.

모든 호주 은행(그리고 많은 다른 금융 사업체)은 AUSTRAC 규정 하에서 "reporting entity"이다. Reporting entity가 된다는 것은 고객을 식별하고, 거래를 의심 활동에 대해 모니터링하고, 의심 사항을 AUSTRAC에 보고하고, 기록을 보관하고, AML/CTF 컴플라이언스 프로그램을 유지해야 한다는 뜻이다. 은행은 AUSTRAC과 협상하지 않는다 — AUSTRAC이 규칙을 정하고 은행은 준수한다.

유용한 비유: 은행이 나이트클럽이라면, AUSTRAC은 개별 문제아를 체포하는 경찰이 아니다. AUSTRAC은 그 클럽에 "입구에서 어떤 ID 체크를 해야 하는지, 경비원을 어떻게 훈련시켜야 하는지, 사건 보고서가 어떤 모양이어야 하는지, 어떤 활동 패턴을 당국에 flag 해야 하는지"를 알려주는 규제기관이다. AUSTRAC은 범죄자를 직접 기소하지 않는다 — 은행이 범죄자가 금융 시스템을 이용하지 못하도록 막기 위해 사용하는 *프로세스*를 감독한다.

은행이 틀렸을 때 AUSTRAC은 막대한 민사 벌금을 부과할 수 있다. 호주 역사상 최대는 — **$1.3 billion** — 2020년 Westpac에 대한 것이었다 (Q15 참조). 그 역사가 Westpac에서 compliance가 특별히 큰 무게를 가지는 이유이고, "banker-level evidence visibility" (내 Decision 6과 Decision 8)가 단순한 좋은 UX가 아니라 전략적 요구사항인 이유다.

### Q9. AML/CTF란 쉽게 말하면 무엇인가?

AML/CTF는 Anti-Money Laundering / Counter-Terrorism Financing의 약자. 은행과 다른 금융 사업체가 고객을 식별하고, 거래를 모니터링하고, 의심 활동을 보고해야 하는 규제 프레임워크다 — 금융 시스템이 범죄 수익을 숨기거나 테러를 funding 하는 데 사용되지 않도록.

**"자금세탁(money laundering)"**은 불법 활동(마약 거래, 사기, 부패)에서 나온 돈을 합법적인 돈처럼 보이게 만드는 것 — 계좌, 사업체, 관할권을 거치면서 그 기원을 모호하게 만드는 것이다. **"테러자금조달(terrorism financing)"**은 종종 적은 금액이라도, 폭력 활동을 funding 하기 위해 돈을 이동시키는 것이다. 이 두 문제는 한 가지 특성을 공유한다: 둘 다 금융 시스템이 알아차리지 못하거나 신경쓰지 않는 것에 의존한다.

AML/CTF 규칙은 은행에게 알아차리도록 강제한다. 모든 신규 고객은 식별되어야 한다. 모든 비정상 거래는 조사를 trigger 해야 한다. 모든 관계는 시간이 지나면서 위험에 대해 모니터링되어야 한다. 모든 의심 패턴은 보고되어야 한다. 이는 은행에게 큰 운영 부담이다 — 단순한 서류작업이 아니라 실제 staff 시간, 실제 training, 실제 기술 투자를 요구한다.

**기억할 것:** AML/CTF는 범죄자를 직접 잡는 것이 아니다. 그건 경찰의 일이다. 이것은 범죄자가 금융 시스템을 통해 깔끔하게 이동하지 못하도록 은행 시스템을 설계하는 것이다. BizEdge에 대한 내 디자인 작업은 이에 기여한다 — 모든 deal setup 결정이 고객 신원의 증거가 어떻게 포착되고, 검증되고, 감사에 사용 가능한지에 영향을 주기 때문이다. 규제된 banking에서 compliance와 UX는 별개의 관심사가 아니다 — 같은 관심사의 다른 layer들이다.

### Q10. CDD가 뭐고 banker가 실제로 CDD 동안 뭘 하는가?

CDD는 Customer Due Diligence의 약자. 은행이 신규 고객에게 서비스를 제공하기 전 — 또는 기존 고객에게 중요한 변화가 생겼을 때 — 완료해야 하는 공식 절차. **"내가 이 고객이 누구인지 정말로 아는가?"** 그리고 **"이 고객과 거래할 때의 자금세탁 위험을 이해하는가?"** 이 두 질문에 답하는 것이 목적이다.

개인 고객의 경우 CDD는 상대적으로 간단하다: ID(여권, 운전면허증) 수집, 진위 확인, 워치리스트 대조, 위험 평가, 모든 것 기록. **Business 고객의 경우 CDD는 훨씬 복잡하다.** Banker는 이걸 해야 한다:

- **Business entity 자체 식별** (회사, sole trader, trust, partnership 등)
- **Business를 대행하는 사람들 식별** (이사, 서명권자)
- **"Beneficial owners" 식별** — corporate structure 층 뒤에 숨어 있어도 최종적으로 business를 소유하거나 통제하는 실제 인간
- **Business 관계의 성격과 목적 이해** (이 고객이 왜 여기서 banking을 하는가?)
- **관계의 자금세탁 위험 평가**
- **모든 것을 기록** — 증거와 banker의 reasoning 둘 다

유용한 비유: Business CDD는 가족을 대표한다고 주장하는 새 룸메이트를 검증하는 것과 같다 — 룸메이트를 검증하고, 가족 구성원을 만나고, 가족의 소득 원천을 이해하고, 이 전체 arrangement가 다른 것의 cover가 아닌지 확인해야 한다. 이제 이걸 30분 안에, 하루에 5번, AUSTRAC이 모든 판단을 지켜보는 상황에서 해야 한다고 상상해 보라. 그게 Westpac banker의 CDD 현실이다.

2026년 reform 하에서 CDD는 두 phase로 나뉜다 — "initial CDD"(onboarding)와 "ongoing CDD"(지속적 모니터링). 왜 이 분리가 중요한지는 Q13, Q14 참조.

### Q11. "Beneficial owner"가 뭐고 왜 까다로운가?

Beneficial owner는 business entity를 최종적으로 소유하거나 통제하는 실제 인간이다 — 그 소유권이 여러 층의 회사, trust, 또는 다른 법적 구조 뒤에 숨어 있어도.

**왜 까다로운가.** "Sunrise Holdings Pty Ltd"라는 business 고객을 상상해 보자. 서류상 Sunrise Holdings는 "Coastal Investments Ltd"라는 다른 회사가 소유한다. Coastal Investments는 "Smith Family Trust"라는 trust가 소유한다. Smith Family Trust는 trustee(법무법인이나 회계사)가 3명의 beneficiary — 예를 들어 Smith 씨, 그의 아내, 그들의 성인 딸 — 를 대신해 관리한다.

"Sunrise Holdings는 Coastal Investments가 소유한다"에서 멈추면, 누가 실제로 주도하고 있는지 결코 알지 못한다. Beneficial ownership 요구사항은 banker에게 구조를 **"뚫고 들여다보도록(look through)"** 강제한다 — 실제 인간에 도달할 때까지. 이 예에서 beneficial owners는 Smith 씨, 그의 아내, 그의 딸이다 — banker는 AUSTRAC 규정 하에 세 명 모두를 식별하고 검증해야 한다 (25% 이상의 소유 또는 통제가 보통의 기준).

**왜 중요한가?** Beneficial ownership 의무가 없다면, 범죄자들은 영원히 corporate structure 뒤에 숨을 수 있다. 자금세탁자가 다른 shell company가 소유한 shell company가 off-shore entity가 소유한... 이렇게 쌓아서, 누가 실제로 돈을 통제하는지 추적 불가능하게 만들 수 있다. Beneficial ownership 규칙이 그 "look-through"를 강제한다.

단순한 sole trader만 주로 다루는 senior banker에게, 여러 beneficiary가 있는 trust는 정확히 muscle memory가 실패하는 rare case다. Beneficial owner를 놓치거나 잘못 식별하는 것은 commercial lending CDD에서 가장 흔한 senior banker 오류 중 하나다. 그게 내 design이 targeting 하는 Pain 2 시나리오다.

### Q12. Entity type이 뭐고 왜 중요한가?

"Entity type"은 business 고객이 취하는 법적 형태다. 서로 다른 법적 형태는 서로 다른 소유 구조, 서로 다른 governance, 서로 다른 서류작업을 가진다 — 그리고 banking에 critical하게, AUSTRAC 규정 하에 서로 다른 CDD 요구사항을 가진다.

AUSTRAC의 initial CDD 가이던스는 고객을 대략 다섯 카테고리로 묶는다:

1. **Individual** — 단일 자연인, business entity 없음
2. **Sole trader** — 자신의 이름이나 등록된 사업명으로 사업하는 개인
3. **Body corporate / Partnership / Unincorporated association** — 이 세 가지는 하나의 AUSTRAC 가이드를 공유하지만 그 안에서 entity별 검증이 필요함
4. **Trust** — trustee가 beneficiary를 대신해 자산을 보유하는 법적 관계
5. **Government body** — 정부 부처와 당국

각 entity type은 banker가 무엇을 검증해야 하는지를 근본적으로 바꾼다. **Sole trader**는 검증할 identity가 하나 — 상대적으로 간단. **Body corporate**는 이사, 주주, beneficial owner — 여러 identity, 여러 문서. **Trust**는 가장 복잡하다: trustee, trust deed, beneficiary, 때로는 appointor가 필요하고, control 구조를 이해해야 한다. 만약 모든 business 고객을 같은 것처럼 다루면, entity별 필수 step을 놓치고 compliance gap을 만든다.

이게 정확히 내 Decision 1 (dynamic checklist)이 product × entity × jurisdiction 으로 reshape 되는 이유다. AUSTRAC 자체가 entity type 중심으로 가이던스를 구조화한다 — 규제 당국이 이미 "entity type이 필수 step을 결정한다"라고 문제를 모델링한다. 모든 entity에 대해 모든 가능한 step을 보여주는 정적 checklist는 압도적이다. 공통 케이스 step만 보여주는 정적 checklist는 rare case를 조용히 skip한다. Entity type이 바뀔 때 reshape 되는 dynamic checklist는 규제 당국 자신의 모델과 일치하는 유일한 접근이다.

### Q13. 2026년 AUSTRAC reform에서 뭐가 바뀌었나? 쉬운 말로.

2026년 3월 31일까지, AUSTRAC 규정은 은행에게 각 고객 유형에 대해 정확히 어떤 문서를 수집해야 하는지를 말해줬다 — 엄격한 prescriptive checklist. Banker가 정해진 방식으로 정해진 문서를 수집하면 compliant 였다. "체크박스에 틱을 치는" 접근이었다.

2026년 3월 31일 — 이 인터뷰 2주 조금 전 — 에 그것이 바뀌었다. AUSTRAC은 prescriptive 규정을 **outcomes-based, risk-driven framework**로 대체했다. AUSTRAC 자신의 언어로, 직접 인용하면, 이 reform은 **"from a compliance-based approach to a risk-based, outcomes-oriented approach"** (compliance 기반 접근에서 risk 기반, outcomes 지향 접근으로)의 전환이다. 은행에게 정확히 무엇을 수집하라고 말하는 대신, 새 규정은 은행이 각 고객의 위험을 평가하고 무엇이 충분한 증거인지를 "reasonable grounds" 기반으로 결정하도록 요구한다.

유용한 비유: 옛 운전 시험이 20개의 구체적 기계적 행동 — 백미러 확인, 깜빡이, 부드럽게 가속, 완전 정지 — 에 대해 점수를 매겼다고 상상해 보자. 이제 시험이 이렇게 바뀐다고 상상해 보라: "A에서 B까지 안전하게 운전하세요. 끝에서 당신이 안전하게 운전했는지 우리가 결정할 것이고, 그 과정에서 당신의 판단들을 문서화하기 바랍니다." 두 번째 시험이 더 어렵다. 더 쉽지 않다. 스크립트를 따르는 게 아니라 실제로 생각하고 방어 가능하게 문서화해야 하기 때문이다.

은행에게 이것은 모든 CDD 결정이 이제 **방어해야 하는 판단**이 되었다는 뜻이다. 옛 prescriptive 규정 하에 구축된 banker의 muscle memory는 더 이상 compliant 하지 않을 수 있다. 이것은 큰 인지적 전환이다. 그리고 타이밍이 이보다 더 민감할 수 없다 — reform은 2주 되었고, 이는 Westpac의 senior banker들이 지금 이 순간 그들의 본능 일부를 무효화하는 새 규정 하에서 작동하고 있다는 뜻이다. 이게 내 design thesis에서 Pain 2의 긴급성의 기반이다.

### Q14. "Transition trap"이 뭐고 왜 지금 중요한가?

Transition trap은 2026 reform의 구체적인 기술적 구멍으로, Westpac에서 지금 당장 실제 compliance 위험을 만든다.

어떻게 작동하는지. Reform은 CDD를 두 phase로 분리했다: **"initial CDD"**(신규 고객 onboarding 시) 그리고 **"ongoing CDD"**(시간이 지나면서 고객을 모니터링). Initial CDD에 대해, AUSTRAC은 transition 기간을 허용했다: Westpac 같은 기존 reporting entity는 2029년 3월 31일까지 pre-reform 절차(legacy ACIP — Applicable Customer Identification Procedure)를 계속 사용할 수 있다. 3년의 runway. 운영 연속성에 좋은 소식.

**그런데 — 이게 trap이다 — ongoing CDD와 risk monitoring은 새 규정 하에 즉시 적용된다.** 2026년 3월 31일부터, 모든 고객의 ongoing 모니터링은 새 risk-based framework를 따라야 한다. Ongoing CDD에는 transition 기간이 없다.

실질적 결과: Westpac의 하나의 deal이 오늘, 부분적으로 옛 규정 하에 (initial CDD에 대한 legacy ACIP) 그리고 부분적으로 새 규정 하에 (risk-based ongoing 모니터링) 있을 수 있다. "2029년까지 시간이 있으니 지금까지 해온 대로 하면 된다"라고 생각하는 senior banker는 부분적으로 맞고 부분적으로 틀렸다. 그들의 initial CDD는 괜찮다. 그들의 ongoing 모니터링은 그렇지 않다.

이게 정확히 muscle memory가 liability가 되는 상황이다. Banker는 하나의 framework가 균일하게 적용된다고 가정하지만, 실제로는 deal이 두 framework를 걸친다. 내 Decision 8 (legacy ACIP vs reform mode indicator)이 이를 직접 다룬다: UI가 deal의 어느 phase에 어느 framework가 적용되는지를 명시적으로 보여주어서 banker가 조용히 틀린 규정을 적용하지 않도록 한다. 이게 Pain 2의 긴급성이 추상적이지 않고 구체적이고 기술적인 이유다.

### Q15. Westpac 2020 AUSTRAC 사건은 뭐고 왜 이 role에 특별한 무게를 주는가?

2019년 11월, AUSTRAC은 호주의 AML/CTF Act에 대한 23백만 건 이상의 시인된 위반에 대해 Westpac에 대한 민사 벌금 소송을 제기했다. 구체적인 위반 사항들은 추하다.

가장 큰 실패: Westpac은 약 5년에 걸쳐 **$11 billion 이상 가치의 International Funds Transfer Instructions (IFTIs) 19.5M+ 건을 보고하지 못했다**. 그들은 또한 transfer chain의 downstream 은행들에게 source-of-funds 정보를 전달하지 못했다 — 이는 다른 은행들이 자신의 ML/TF 위험을 관리할 수 없었다는 뜻이다. 다른 카테고리에서 76,000+ 추가 위반이 있었다. **가장 우려스럽게**: Westpac은 child exploitation과 일치하는 거래에 대해 고객을 모니터링하지 못했다. AUSTRAC은 처음에 필리핀, 동남아시아, 멕시코로 의심스러운 transfer를 하는 12명의 특정 고객을 식별했고, 추가 검토에서 250명을 더 발견했다.

**2020년 10월 21일**, 호주 연방법원은 Westpac에게 **$1.3 billion**을 지불하라고 명령했다. 이는 여전히 호주 역사상 **최대 기업 벌금**이다. Westpac은 위반을 시인했고, AUSTRAC과 제안된 벌금에 동의했으며, AML/CTF 통제, 데이터 시스템, 정책, 프로세스를 재구축할 것을 공개적으로 약속했다. 그들은 그 작업에 5년을 보냈다.

왜 이것이 내 role에 특별한 무게를 주는가? 2026 AUSTRAC reform이 Westpac에 중립적인 규제 업데이트로 착륙하지 않기 때문이다. 이것은 이미 호주 역사상 최대 AML 벌금을 지불했고 compliance backbone을 재구축하는 데 5년을 보낸 은행에 착륙한다. 내 provenance indicator (D6)와 legacy/reform mode indicator (D8) 관련 design 결정은 일반적인 UX 선택이 아니다 — Westpac이 이미 친밀하게 알고 있고 공개적으로 배우기로 약속한 규제 역사에 응답하는 것이다.

**인터뷰 프레이밍:** "Westpac has a specific relationship with AUSTRAC compliance that makes banker-level evidence visibility more than a nice-to-have. My design treats it as foundational rather than additive." 이것이 방어 가능한 이유는 Westpac에 구체적이기 때문이다 — 일반적이지 않기 때문이다.

---

## Chapter 3 — 브리프의 Three Pains

### Q16. "New banker errors"는 실제 업무에서 실제로 어떻게 생겼는가?

신입 banker는 보통 극적인 실수를 하지 않는다. 그들은 작은 프로세스 실패를 한다 — 이것이 downstream으로 연쇄해서 rework와 compliance 위험이 된다.

가장 흔한 패턴들 (McKinsey commercial banking onboarding 리서치, 88개의 distinct 오류 유형과 연간 약 $30M 비용을 식별한 Cognitive Group의 RBC 연구, commercial lending 문헌에서 추출):

**Entity 오분류.** 신입 banker가 "가족 사업"을 sole trader로 분류하지만 실제로는 corporate trustee가 있는 discretionary trust인 경우. 이 단일 오분류는 모든 downstream CDD step을 무효화한다 — 필요 문서가 완전히 다르기 때문이다. Deal이 compliance에 들어가고, 튕겨 나오고, banker는 몇 시간의 작업을 다시 해야 한다.

**불완전한 데이터 포착.** Banker가 고객을 onboard 하지만 필수 필드 하나를 놓친다 — beneficial owner, 자금 출처 신고, 특정 문서. Deal이 진행되고, credit 검토에 도달하고, 튕겨 나온다. Banker는 이제 고객에게 연락해서 정보를 다시 요청하고 다시 제출해야 한다 — 종종 며칠 후에.

**Verification step skip.** Banker가 고객의 운전면허증은 포착했지만 higher-risk 고객 유형에 대한 필수 second-form verification을 잊었다. Compliance가 잡아내고, deal이 반환되고, 고객은 Westpac에 대해 나쁜 첫인상을 받는다.

**위험 수준 오판.** Banker가 고객을 "standard risk"로 평가하지만 실제로는 "enhanced due diligence"여야 한다 — 예를 들어 foreign-jurisdiction 노출이나 소유 체인의 politically exposed person (PEP)을 놓친다. 이것은 고위험이다 — AUSTRAC 벌금이 실제로 뒤따르기 때문이다.

이 중 어떤 것도 개별적으로는 치명적이지 않다. "필드 하나 잊었다" 식의 실수들이다. 하지만 수백 명의 신입 banker와 월 수천 건의 deal에 걸쳐 모두 합쳐지면 상당한 rework와 실제 compliance 위험을 만든다. 그것이 Pain 1이 targeting 하는 것이다 — 극적인 실패가 아니라 전체 시스템을 끌어내리는 작은 프로세스 오류의 느린 축적.

### Q17. "Senior banker skip"는 실제로 어떻게 생겼는가?

Senior banker skip은 표면적으로 직관에 반한다. 15년 경력의 숙련된 banker가 왜 필수 step을 skip 하겠는가? 경험이 오류를 방지해야 하지 않나?

답은 인지심리학에 있다: **expertise reversal effect** (전문성 역전 효과). 전문가 수행은 mental shortcut — "schema" — 에 의존한다. Schema는 "전형적인 deal은 이렇게 생겼고, 이 경우 이것을 해야 한다"를 인코딩한다. 흔한 product type에 대해 이 schema는 정교하게 tuning 되어 있고 매우 효율적이다. Rare product type에 대해 schema는 outdated 되어 있거나 그냥 맞지 않는다.

**구체적 예:** 수천 개의 business term loan을 해본 senior banker가 신규 deal을 열고, 고객이 bank guarantee(은행이 고객이 계약을 어길 경우 제3자에게 지불하겠다고 약속하는 것)를 요청한다. Banker는 "OK, bank guarantee, 기본적으로 같은 프로세스"라고 생각한다. Deal을 시작하고, 고객 세부사항을 기입하고, 현금흐름을 평가한다 — term loan의 muscle memory가 발동한다.

하지만 bank guarantee는 term loan이 가지지 않는 구체적 요구사항이 있다: **beneficiary 법적 이름과 주소**(guarantee를 받는 제3자), **만기일과 기저 계약의 정렬**, **담보로서의 term deposit**, 그리고 **물리적 지점에서의 paper 발행**. Senior banker는 이들을 기입하지 않는다 — 그의 muscle memory가 이를 prompt 하지 않기 때문이다. Deal이 진행되고, 문서 검토에 도달하고, "missing beneficiary, missing expiry, missing security"라고 튕겨 나온다. Rework.

또 다른 예: trust 구조 loan에서 banker가 "trust" 멘탈 모델 대신 "company" 멘탈 모델을 적용 — trustee 의무 누락, 불완전한 beneficiary 검증, 부정확한 control 구조. 또는 partnership에서 banker가 회사 스타일 소유권 logic을 적용 — partnership의 control 의미가 다르다는 것을 놓침.

이 모두가 한 가지 특성을 공유한다: banker는 지식을 *가지고 있지만* 이 특정 deal의 variation이 default pattern을 시각적으로 돌파하지 못한다. 그것이 내 design이 targeting 하는 "variation visibility gap"이다.

**호주 맥락:** 호주 4대 주요 은행 중 3곳이 위험과 복잡성 때문에 retail 고객에게 bank guarantee 제공을 중단했다. Westpac의 남은 bank guarantee 비즈니스는 "specialized offering"이지 ordinary product가 아니다. 이것이 Westpac에서 rare-product skip 문제를 특히 acute 하게 만든다.

### Q18. "No single view"는 실제로 뭘 의미하는가 — banker가 현재 어떻게 작업하는가?

Priya라는 Westpac banker를 상상해 보자. 그녀는 제조업 고객을 위한 business loan deal을 부분적으로 진행 중이다. 그녀는 지금 당장 세 가지를 확인해야 한다: PPSR search가 고객의 장비에 대한 기존 담보권을 반환했는가? 고객이 application portal에 최신 재무제표를 업로드했는가? Compliance team이 고객의 위험 등급을 승인했는가?

"Single view"가 없으면, Priya는 각 질문에 별도로 답해야 한다. PPSR search의 경우 PPSR 자동화 인터페이스에 로그인해서 상태를 확인한다. 고객 재무 문서의 경우 다른 화면이나 customer portal을 연다. Compliance 승인의 경우 email이나 compliance ticketing 시스템을 확인한다.

이 각 전환은 10-30초의 인지 부하를 취한다. Priya는 어느 시스템이 무엇을 가지고 있는지 기억해야 하고, 로그인하고(때로는 재인증), 많은 것 중에서 특정 deal을 찾고, 상태를 읽고, 그것을 deal context로 mental하게 다시 가져와야 한다. McKinsey는 이를 **"swivel chair work"**라고 부르고 commercial lending에서 banker 생산성 손실의 주요 요인으로 식별한다. 이걸 deal 당 20번 × 하루 5 deals = Priya의 주의력에 대한 엄청난 세금.

**하지만 여기 내 design을 바꾼 미묘한 부분이 있다: "no single view"가 Priya에게 모든 정보를 한 번에 보여주는 dashboard가 필요하다는 뜻은 *아니다*.** 현대 LOS vendor(nCino, Moody's, Baker Hill, Hawthorn River)의 리서치가 이를 재정의한다. Priya가 실제로 필요한 것은 **정보가 그녀의 다음 action 중심으로 순차화된 단일 coordinated workspace**다. "모든 것을 보여주세요"가 아니라, "이 step에 필요한 것을 보여주고, 다음이 무엇인지 명확히 알려주세요."

그 재정의가 내 design 방향의 가장 큰 단일 움직임이다. 나는 처음에 "single view"가 "unified dashboard"를 의미한다고 가정했다. 산업 리서치가 나에게 이것이 "single guided workflow surface"를 의미한다고 가르쳤다. 그게 내 Decision 5가 stage별 checklist와 함께 progress spine인 이유다 — 병렬 정보 표시가 아니다.

---

## Chapter 4 — 디자인 결정들 (쉬운 말 rationale)

### D1. Dynamic checklist (product × entity × jurisdiction 으로 reshape)

**What:** Banker가 product type, customer entity type, jurisdiction 요소를 선택하면 checklist가 그 조합의 특정 필수 step을 보여주도록 자동으로 reshape 한다.

**해결하는 문제:** 모든 business lending deal은 product, entity, geography의 다른 조합이고, 각 조합은 다른 필수 step을 가진다. 정적 checklist는 이를 처리할 수 없다. 신입 banker는 어떤 step이 그들의 특정 deal에 중요한지 모른다; senior banker의 muscle memory는 rare 조합에서만 적용되는 step을 skip 한다. Dynamic checklist는 variation을 숨기는 대신 visible 하게 만든다.

**왜 합리적인가:** AUSTRAC 자체가 entity type 중심으로 가이던스를 구조화한다 — 규제 당국이 이미 이 방식으로 문제를 모델링한다. Hawthorn River는 "validation rules will vary based on the structure of the loan, borrowers, and collateral"이라고 공개적으로 명시한다. 이는 Westpac 특정 bet이 아니라 LOS 업계가 origination workflow를 설계하기 위해 배운 방식이다.

**One-breath:** "모든 business loan은 product, entity type, geography의 서로 다른 조합이라서, checklist가 자동으로 재배치되어 지금 작업 중인 deal에 해당하는 step만 보여준다 — 모든 가능한 step의 generic 리스트를 헤매지 않아도 되게."

### D2. Skip은 friction, hard block 아님, logged reason 포함

**What:** Banker가 미완료 checklist 항목을 지나 진행하려 할 때, 시스템은 hard-block 하지 않는다. 한 줄 이유를 요구하는 가벼운 dialog를 보여준 다음 deal을 계속하게 한다. Skip과 그 이유는 audit 용으로 logged 된다.

**해결하는 문제:** Hard block은 workaround 행동을 만든다 — banker가 시스템 밖에서 문서화하고, 불필요하게 escalate 하고, compliance에 예외를 승인하라고 압박한다. 조용한 skip은 "왜 우회되었는지 아무도 모르는" audit gap을 만든다. Friction-with-reason은 중간 길이다: banker 판단을 존중하고, visibility를 만들고, 시간이 지나면서 skip pattern을 분석 가능하게 만드는 데이터를 생성한다.

**왜 합리적인가:** AUSTRAC의 post-reform 가이던스가 명시적으로 말한다: *"Some initial CDD steps can be delayed where essential to avoid interrupting ordinary business."* 이는 옛 "모든 박스가 체크되어야 어떤 것도 일어나지 않는다" 멘탈리티에서의 직접적 이탈이다. 내 design은 규제 당국 자신의 reform 의도를 operationalize 한다 — 단순한 UX 선호가 아니라 AUSTRAC-aligned.

**One-breath:** "Banker가 step을 skip 하려 할 때 막는 대신, 시스템이 한 줄 이유를 요청하고 기록한다 — banker 판단을 존중하면서 compliance와 규제 당국이 모두 읽을 수 있는 audit trail을 만든다."

### D3. Inline expandable knowledge, 별도 chatbot 아님

**What:** 각 checklist 항목에 작은 "i" affordance가 있다 — checklist row 내부에서 inline으로 확장되어, 왜 이 step이 필요한지, 이 특정 product × entity 조합에 대한 common mistake, 관련 정책이나 AUSTRAC 가이던스에 대한 링크를 보여준다. 기본 상태는 collapsed.

**해결하는 문제:** 별도 chatbot은 신입 banker에게 실패한다 — workflow를 떠나, context를 다시 설명하고, 아직 어떻게 물어봐야 할지 모르는 질문을 formulate 하도록 강요하기 때문이다. Psychological safety 리서치(Amy Edmondson, Chartered Banker Institute가 banking에 적용)는 금융의 junior가 평판 위험 때문에 질문을 지연한다는 것을 보여준다. Inline 확장은 묻는 것의 사회적 비용을 제거한다 — 단, banker가 engage 하기로 선택했을 때만.

**왜 합리적인가:** NN/g (Nielsen Norman Group)의 progressive disclosure 리서치는 사용자 trigger 계시가 시스템 push help 보다 우월하다는 것을 보여준다. 사용자가 적극적으로 열기로 선택한 것만 열기 때문에 banner blindness를 피한다. 그리고 지식이 특정 checklist 항목에 부착되어 있다 — context는 항상 정확하다. Row가 자신이 무엇에 관한 것인지 알고 있기 때문이다.

**One-breath:** "각 checklist 항목에 작은 expandable help 버튼이 내장되어 있어서, banker가 뭔가 왜 필요한지 알고 싶을 때 workflow를 떠나거나 deal context를 모르는 chatbot에 질문을 타이핑하지 않고도 답을 볼 수 있다."

### D4. Progressive disclosure (Learning/Expert mode toggle 대신)

**What:** Mode toggle이 없다. 모든 banker가 동일한 checklist, 동일한 확장 affordance, 동일한 progress spine을 본다. 경험 수준 적응은 contextual 확장을 통해 일어난다 — banker가 자신의 경험 수준을 선언하지 않는다.

**해결하는 문제:** Mode toggle은 네 가지 나쁜 결과를 만든다: stigma(신입 banker가 초보자로 낙인찍힘을 느낌), false confidence(senior banker가 최근에 안 해본 deal type에 대해 "expert mode"를 주장), decision paralysis(사용자가 어느 모드가 맞는지 모름), discoverability 문제(mode 상태가 숨겨질 수 있음). Progressive disclosure는 네 가지 모두를 피한다.

**왜 합리적인가:** NN/g 리서치는 명시적으로 progressive disclosure를 explicit toggle보다 권장한다. 그리고 더 깊은 통찰이 있다: **전문성은 실제로는 product별이지 banker별이 아니다.** Senior banker는 term loan에서는 전문가지만 trust lending에서는 초보자일 수 있다. 이진 toggle은 그 granularity를 포착할 수 없다; contextual 확장은 할 수 있다 — banker profile이 아니라 deal profile에 응답하기 때문이다.

**One-breath:** "Banker에게 '나는 초보자야' 또는 '나는 전문가야'를 선언하라고 요구하는 대신, 동일한 인터페이스가 누구든 어느 step에서든 help를 확장할 수 있게 한다 — senior는 흔한 product에서는 compact 하게 유지하고 실제로 필요한 rare 경우에만 확장한다."

### D5. Progress spine = guided workflow surface, dashboard 아님

**What:** Deal home page 상단은 lifecycle stage — Setup → Identification → Credit → Approval → Settlement — 를 보여주는 수평 progress spine이고, banker의 현재 위치가 시각적으로 강조된다. Spine 아래에는 **현재 stage만의** dynamic checklist가 next-action 강조와 함께 앉는다.

**해결하는 문제:** "Single view"에 대한 dashboard 접근은 모든 deal 데이터를 한 번에 보여주려 하는데, 이는 인지 부하를 증가시키고 non-critical 정보에 대한 banner blindness를 만든다. Spine은 한 가지 질문에 답한다: "나는 어디 있고 다음은 무엇인가?" 데이터 저장소가 되려고 하지 않는다.

**왜 합리적인가:** 이것이 내 design에서 가장 큰 reframing이다. 나는 처음에 "single view"가 unified dashboard를 의미한다고 가정했다. nCino, Moody's Lending Suite, Baker Hill, Hawthorn River에서의 산업 리서치가 모두 같은 패턴으로 수렴한다: 현대 LOS에서 "single view"는 "single guided workflow surface"를 의미하지 "모든 정보가 동시에 보이는 것"이 아니다. 정보는 다음 미해결 action 중심으로 순차화되지, 병렬로 표시되지 않는다. 4개의 주요 산업 참조, 하나의 수렴된 답.

**One-breath:** "한 화면에 모든 deal 데이터가 있는 dashboard 대신, deal의 단계들을 보여주는 수평 progress bar에서 현재 단계가 강조되고 — 그 아래에는 지금 이 단계에서 해야 할 것만 보인다."

### D6. Auto-fill 데이터의 Provenance indicator

**What:** 외부 시스템(Company search, PPSR search, customer portal, previous records)에서 auto-populated 된 BizEdge의 모든 필드는 작은 provenance indicator를 보여준다: 출처 + 타임스탬프 + confidence. Hover로 세부사항이 드러나고; banker는 항상 override 할 수 있으며, override는 원본과 함께 logged 된다.

**해결하는 문제:** BizEdge는 자동 Company search와 PPSR search를 수행한다. 이들은 banker가 개인적으로 검증하지 않은 데이터의 출처다. Provenance 없이는 banker가 시스템을 암묵적으로 신뢰하면서 그 신뢰를 audit에서 방어할 수 없다. 2026 reform 하에서 banker 결정은 "reasonable grounds"로 확립되어야 한다 — 그리고 "시스템이 그렇게 말했다"는 reasonable grounds가 아니다.

**왜 합리적인가:** AUSTRAC의 post-reform framework는 banker에게 "reasonable grounds"로 사항을 확립하도록 요구한다. 이는 각 증거를 정당화해야 한다는 뜻이다. Provenance indicator가 필드 수준에서 그 정당화를 가능하게 한다. Westpac의 2020 사건도 증거 가시성이 scale에서 약할 때 무슨 일이 일어나는지에 대한 reminder다 — 명확한 audit trail 없이 결정이 내려지고, 5년 후 $1.3B 벌금을 지불하고 있다.

**One-breath:** "시스템이 외부 소스에서 필드를 auto-fill 할 때, 작은 indicator가 그것이 어디서 언제 왔는지 보여준다 — banker가 한눈에 신뢰할지 override 할지 볼 수 있고, auditor가 각 결정이 어떻게 만들어졌는지 정확히 볼 수 있다."

### D7. Three-way task ownership — Banker / System / Customer

**What:** Checklist의 모든 미해결 항목은 owner indicator를 보여준다: Banker (나의 action 필요), System (자동 처리 진행 중), Customer (customer action 대기 중). Banker는 "나의 action만"으로 checklist를 필터링해서 자신의 큐에 집중할 수 있다.

**해결하는 문제:** 브리프는 banker가 "무엇이 outstanding 한지" 모른다고 말한다. 하지만 outstanding에는 다른 종류가 있다 — 어떤 항목은 banker를 기다리고, 어떤 것은 시스템을, 어떤 것은 고객을 기다린다. 이들을 하나의 "outstanding" 버킷으로 collapse 하는 것은 banker가 개인적으로 action 할 수 없는 항목을 쫓게 만든다. 이는 낭비된 노력, 집중력 손실, 정신적 소음이다.

**왜 합리적인가:** 가장 중요한 증거: **BizEdge는 two-sided 플랫폼이다, banker 전용이 아니다.** Rich Data Co는 자신의 기여를 *"a two-sided digital finance application form, which allows both customers and bankers to jointly work on an application"* 이라고 기술한다. 이는 내 design에서 "customer"가 추상적 세 번째 actor가 아니라 — 실제 BizEdge 아키텍처 안의 실제 surface라는 뜻이다. Three-way ownership은 발명된 모델이 아니라 플랫폼의 실제 형태를 반영한다.

**One-breath:** "모든 task가 누가 소유하는지 보여준다 — banker, system, 또는 customer — banker가 다른 사람이나 시스템을 기다리는 항목을 쫓는 대신 자신의 action만 필터링할 수 있게."

### D8. Legacy ACIP vs reform CDD mode indicator

**What:** Deal home page가 top-right에 지속적인 indicator를 보여준다: "Initial CDD: Legacy ACIP (transition)" 또는 "Initial CDD: Reform framework." Ongoing CDD는 항상 reform framework 하에 있으며 별도로 표시된다. Indicator는 클릭 가능하며, 왜 이 framework가 적용되는지와 언제 deal이 transition 해야 하는지를 드러낸다.

**해결하는 문제:** AUSTRAC transition trap (Q14)은 하나의 deal이 부분적으로 옛 규정 하에 그리고 부분적으로 새 규정 하에 있을 수 있다는 뜻이다. Senior banker는 "2029년까지 시간이 있다"라고 들었기 때문에 하나의 framework가 균일하게 적용된다고 가정할 수 있다. 하지만 ongoing CDD는 2주 전에 바뀌었고 즉시 적용된다. Mode를 명시적으로 만드는 것은 banker가 조용히 틀린 규정을 적용하지 않게 막는다.

**왜 합리적인가:** 이것은 일시적 design artifact다 (2029년 3월까지만 관련). 하지만 3년 transition 기간 동안 이는 critical safeguard다. Reform은 banker에게 reasoning을 문서화하라고 요구한다; 명시적 mode indicator는 framework-selection reasoning이 banker의 머릿속에만 살지 않고 UI에 내장되어 audit 용으로 사용 가능하다는 뜻이다.

**One-breath:** "작은 지속적 label이 이 deal의 initial CDD에 어느 AUSTRAC framework — legacy 또는 reform — 가 적용되는지 보여준다. 그래서 senior banker가 일부 deal이 두 framework를 걸치는 3년 transition 창 동안 옛 멘탈 모델을 조용히 적용하지 않도록."

---

## Chapter 5 — 전략적 스토리

### Q19. Westpac이 왜 지금 business banker를 이렇게 많이 채용하고 있는가?

Westpac은 특정한 경쟁의 순간에 있다. 그들은 호주 business lending 시장 점유율에서 NAB와 CBA에 뒤처져 있다 — 2025년 7월 기준 Westpac 16.1%, CBA 18.85%, NAB 21.6%. 격차는 좁아지고 있지만 아직 닫히지 않았다. Westpac은 점유율을 회복하고 싶어 하고, 이를 전략적 "shift in emphasis"로 — 부수 포트폴리오가 아니라 핵심 수익 엔진으로 — 공개적으로 프레임했다. Paul Fowler (Chief Executive Business & Wealth)가 정확히 그 표현을 공개적으로 사용했다.

그들은 격차를 양쪽에서 공격하고 있다. **기술 쪽에서**, BizEdge에 투자하고 있다 — deal 결정 가속화, search와 문서 처리 자동화, banker의 deal당 시간을 약 90분 단축. 이게 "기술 절반"이다.

**사람 쪽에서**, banker workforce를 확장하고 있다. 2024년 11월, Westpac은 2027년 말까지 200명의 추가 business banker 채용을 약속했다 — 기존 SME banker 코호트의 약 40% 증가. 2025년 9월, 목표가 공개적으로 2년 동안 350명 신규 banker로 확대되었고, 그 시점에 135명이 이미 채용된 상태였다 (Reuters가 Paul Fowler briefing을 인용).

두 절반은 연결되어 있다 — 그리고 이것이 내 design의 business case다. 350명의 신입 banker를 채용했는데 각각 생산성에 도달하는 데 30-100일이 걸린다면 (McKinsey의 commercial onboarding 리서치에 따르면 주로 tooling fragmentation 때문), 거대한 learning-curve 병목을 만든 것이다. 신입 banker가 compliant deal을 더 빨리 만들 수 있는 날은 Westpac에게 실제 수익이다. 내 V1 checklist design은 이 curve를 직접 targeting 한다 — training을 개선해서가 아니라, training이 해결할 수 없는 "when and why" 작업을 도구가 더 많이 하게 만들어서.

### Q20. UNITE는 무엇을 달성하고 있고 내 role에 무엇을 의미하는가?

UNITE는 Westpac의 상품, 프로세스, 시스템 전반에 걸쳐 측정 가능한 단순화를 delivering 하고 있다. 2026년 3월 기준 공개 보고 수치: **180+ 애플리케이션 폐기**(legacy 소프트웨어 은퇴), **70%+ 상품 단순화**(variation 감소, 더 깨끗한 offering), **700+ 프로세스 간소화**. 프로그램은 scope, 일정, 예산 모두 준수 중이라고 보고됨 — 다년도 bank transformation에서는 드문 주장.

내 role에 대한 세 가지 함의:

**첫째, 나는 legacy mess 위에 디자인하는 게 아니다.** BizEdge는 깨진 플랫폼 위에 layered 되는 게 아니라 — 적극적으로 더 단순해지고 있는 플랫폼 위에 layered 된다. 폐기된 180+ 애플리케이션 하나하나가 banker가 이전에 swivel chair로 오가야 했던 시스템이다. 각 은퇴는 내 design이 그렇지 않으면 보상해야 했을 friction을 제거한다.

**둘째, UNITE 프레이밍은 가장 어려운 devil's advocate 공격에 대한 방어 가능한 답을 준다.** 만약 인터뷰어가 "Westpac은 문화적·복잡성 이슈가 있고 UX로 고칠 수 없다. 더 예쁜 checklist가 은행을 고치지 못한다"라고 한다면, 내 답은: "저는 UX가 문화를 고친다고 주장하지 않습니다. 저는 제 design이 UNITE의 wave를 탄다고 주장합니다. UNITE는 delivering 하고 있어요 — 180+ 애플리케이션 폐기, 70%+ 상품 단순화. UNITE가 실패하면 제 design도 실패합니다. UNITE가 delivering 하고 있기 때문에 제 design은 그 진전을 banker의 workstation에서 operationalize 합니다." 이 프레이밍은 구체적이고(숫자로) 겸손하다(UX 영향을 과대 주장하지 않음).

**셋째, 이것은 전략적 정렬을 시그널링한다.** 내 design 선택 — dynamic checklist, progress spine, three-way task ownership — 은 모두 단순화된 플랫폼을 scale에서 사용 가능하게 만드는 것에 관한 것이다. UNITE가 back-end 단순화라면, 내 design은 그 단순화를 일상 banker 경험으로 번역하는 front-end다. 두 layer는 coherent 해야 하고, 내 design은 그 coherence에 대해 명시적이다.

### Q21. Dr Martin Anderson이 BizEdge의 AI에 대해 뭐라고 말했고, 내가 왜 신경써야 하는가?

Dr Martin Anderson은 Westpac의 Head of Technology for Business Lending and B&W UNITE이다. 그의 팀은 BizEdge 작업으로 Westpac Team of the Year 2025를 수상했다. 그는 senior technology 임원이고 BizEdge가 어디로 가는지에 대해 공개적으로 말한다.

2026년 초 시드니 AWS Financial Services Symposium에서, Anderson은 iTnews 보고서에서 직접 인용하면 다음과 같이 말했다:

> *"People are going to be surprised by how these sequences are going to be reorganised, resequenced, rewired. It's not just going to be a case of adding in AI-specific points; it's actually reimagining the process so that you can actually optimise it to leverage AI and all the various capabilities. Whether it's within documentation, KYC, annual reviews, credit decisioning, the writing of credit memos, even communications — the whole end-to-end sequence of business lending can be optimised."*

**왜 신경써야 하는가?** 이 인용이 내 V2 design thesis에 대한 직접적인 임원 지지이기 때문이다.

내 V2는 BizEdge가 기존 workflow 위에 단순히 AI 기능을 추가하는 게 아니라 — deal state를 관찰하고 context를 proactively 표면화하는 ambient teammate로서 AI를 중심으로 재구상되어야 한다고 주장한다. 나는 그 결론에 독립적으로 도달했다 — 인지심리학(expertise reversal effect)과 Slack 기반 AI companion을 구축한 내 자신의 경험에서. 그 다음, 이 challenge를 리서치하던 중 Anderson의 인용을 발견했는데 — Westpac 자신의 목소리로 같은 것을 말한다.

그것은 borrowed authority가 아니라 — **convergent evidence**다. 인터뷰에서 나는 말할 수 있다: "V2 방향은 추측이 아닙니다. Westpac의 Head of Technology for Business Lending이 플랫폼의 진화가 어떻게 보일지에 대해 공개적으로 말한 것과 정렬됩니다. 저는 그 reimagining이 banker의 workstation에서 무엇을 의미할지에 대한 하나의 구체적인 버전을 제안하고 있습니다."

이 프레이밍은 V2를 "이것은 take-home에 너무 speculative 하다" 푸시백으로부터 보호한다. 방향은 임원 지지를 받고 있다; 위험은 구체적 실행에 있으며, 이는 실제 사용자 테스트가 필요한 부분이다.

### Q22. 인터뷰어가 "why this role, why now?"를 물으면?

두 문장:

**Sentence 1 (영어):** *"Westpac is at the convergence of three forces — a competitive push to regain business lending market share, the AUSTRAC reform that commenced two weeks ago and invalidates some senior banker muscle memory, and a massive banker hiring push that creates a learning-curve bottleneck — and all three pressures land at the banker's workstation inside BizEdge."*

**Sentence 2 (영어):** *"That makes the Senior Experience Designer role for BizEdge the single highest-leverage design role in Australian business banking right now, because the interface layer is where those three pressures become actionable — or become failure modes."*

**왜 이 프레이밍이 작동하는가?**

- **구체적**이다, 모호하지 않다. 세 개의 named force, 각각 숫자에 연결됨(시장 점유율 격차, 채용 목표, reform 날짜).
- **role을 전략에 묶는다**, 내 선호에 묶지 않는다. 나는 "Westpac을 사랑해요" 또는 "이것은 제 꿈의 직장이에요"라고 하지 않는다. 나는 "여기 구체적 전략의 순간이 있습니다; 여기 왜 interface layer가 이 순간에 중요한지 있습니다"라고 말한다.
- 내 기여를 **leverage로 포지셔닝한다, 장식이 아니라**. "Single highest-leverage design role"은 참이거나 거짓인 주장이고, 내 나머지 프레젠테이션이 그것을 정당화하거나 못한다.
- Generic 문구를 피한다. "Exciting opportunity" 없음, "mission-driven" 없음, "fintech에 대한 열정" 없음. 오직 force, framing, leverage만.

두 문장의 **모양**을 외워라, 정확한 단어가 아니라. 당일 자연스럽게 느껴지는 표현으로 말해라. 중요한 것은 구조다: (1) 세 개의 구체적인 수렴하는 force, (2) interface layer가 그들이 actionable 해지는 곳.

한국어로 번역해야 하면 [단, 인터뷰는 영어이므로 이건 내 자신의 recall용 note]:

> "Westpac은 지금 세 가지 force — business lending 시장 점유율 회복을 위한 경쟁적 push, 2주 전 시행되어 senior banker의 muscle memory 일부를 무효화하는 AUSTRAC reform, learning-curve 병목을 만드는 대규모 banker 채용 push — 의 수렴에 있고, 세 압력 모두가 BizEdge의 banker workstation에 착륙합니다. 그게 BizEdge Senior Experience Designer role을 지금 호주 business banking에서 가장 leverage가 높은 design role로 만들고 — interface layer가 바로 그 세 압력이 actionable 해지거나 실패 모드가 되는 곳이기 때문입니다."

---

## Uncertainty flags — 인터뷰 전 검토할 것

- **Q3 / BizEdge 출시 날짜.** insights.md가 명시적으로 flag 함: BizEdge 플랫폼의 정확한 출시 날짜는 검증되지 않음. "April 2023"은 SIMPLE+ credit pathway 출시를 가리키지 BizEdge 자체가 아님. Westpac의 2023년 1월 Rich Data Co 파트너십 발표는 business lending에서 AI를 언급하지만 BizEdge를 이름으로 부르지 않음. 인터뷰어가 BizEdge가 언제 출시되었는지 물으면, 정직한 답은 "Westpac은 SIMPLE+의 2023년 4월 출시를 공개적으로 공개했지만, 정확한 BizEdge 플랫폼 출시 날짜는 제가 찾은 공개 자료에 없습니다."
- **Q7 / UNITE 약자.** UNITE가 약자로 무엇을 의미하는지 확인하는 공개 출처를 찾지 못함. 프로그램 이름으로 다루자. 질문받으면: "Westpac의 FY25와 1Q26 공개에서 UNITE를 다년도 단순화 프로그램으로 참조한 것을 봤지만, 문자들이 무엇을 의미하는지에 대한 공개 출처는 찾지 못했습니다."
- **Q19 / 채용 숫자 출처.** 2024년 11월에서 2025년 9월로의 200 → 350 progression은 Paul Fowler의 briefing을 인용하는 Reuters를 통해 문서화됨. "이미 135명 채용" 수치는 2025년 9월 Reuters 보고서에서 나옴. 둘 다 인용해도 안전할 것이지만, 1차 출처를 물으면 인터뷰 전에 재확인.
- **JPMorgan Coach AI 참조 (이 primer에는 없지만 insights.md에는 있음).** "10-20% 효율 증가" 수치는 insights.md에서 tertiary trade press로 flag 됨; 인터뷰에서 구체적 퍼센트를 인용하지 말 것. "JPMorgan은 junior banker를 위해 Coach라는 AI companion 도구를 사용한다고 보고됨"으로 프레임하고 숫자는 빼둘 것.

---

*Primer 끝. 한 번 처음부터 끝까지 읽은 다음, 인터뷰 당일 아침에 흔들리게 느껴지는 질문들만 skim 해라.*
