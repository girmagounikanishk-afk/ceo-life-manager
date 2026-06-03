export const CEO_NAME = 'Tim';

export const stockData = {
  price: 213.45,
  change: +4.92,
  changePct: +2.35,
  preMarket: true,
  high52w: 237.23,
  low52w: 164.08,
  marketCap: '3.28T',
  peRatio: 34.2,
};

export const healthData = {
  energy: 7,
  sleep: 6.5,
  sleepQuality: 'Good',
  hrv: 62,
  restingHR: 52,
  steps: 4200,
  stepGoal: 10000,
  standHours: 5,
  mindfulMinutes: 10,
  cognitiveLoad: 68,
  recoveryScore: 74,
  stressLevel: 'Moderate',
};

export const calendarEvents = [
  { id: 1, time: '06:30', end: '07:15', title: 'Morning Workout', type: 'health', demand: 'low', priority: 'medium', location: 'Apple Park Gym', color: 'emerald' },
  { id: 2, time: '08:00', end: '08:30', title: 'Morning Brief + Email Triage', type: 'focus', demand: 'medium', priority: 'high', location: 'Office', color: 'blue' },
  { id: 3, time: '09:00', end: '10:00', title: 'Board Strategy Call', type: 'meeting', demand: 'high', priority: 'critical', attendees: ['Artemis Dow', 'James Bell', 'Monica Lozano', 'Arthur Levinson'], location: 'Boardroom A', color: 'red' },
  { id: 4, time: '10:30', end: '11:15', title: 'iPhone 17 Design Review', type: 'meeting', demand: 'high', priority: 'high', attendees: ['Jony Design Team', 'Greg Joswiak', 'Johny Srouji'], location: 'Design Studio', color: 'violet' },
  { id: 5, time: '11:30', end: '12:00', title: 'TSMC Supply Chain Update', type: 'meeting', demand: 'high', priority: 'high', attendees: ['Jeff Williams', 'TSMC Liaison'], location: 'Secure Conference Room', color: 'orange' },
  { id: 6, time: '12:00', end: '13:00', title: 'Lunch + Recovery Block', type: 'personal', demand: 'none', priority: 'low', location: 'Apple Park Café', color: 'gray' },
  { id: 7, time: '14:00', end: '16:00', title: '🛡️ DEEP WORK — Vision 2028 Strategy', type: 'focus', demand: 'high', priority: 'critical', location: 'Private Office', color: 'purple', protected: true },
  { id: 8, time: '16:30', end: '17:00', title: 'WSJ Interview Prep', type: 'meeting', demand: 'medium', priority: 'medium', attendees: ['PR Team', 'Communications Director'], location: 'Media Room', color: 'blue' },
  { id: 9, time: '17:00', end: '17:45', title: 'Wall Street Journal Interview', type: 'pr', demand: 'high', priority: 'high', location: 'Media Studio', color: 'amber' },
  { id: 10, time: '18:30', end: '19:00', title: 'Evening Walk + Decompression', type: 'health', demand: 'none', priority: 'medium', location: 'Apple Park Trail', color: 'emerald' },
];

export const meetings = [
  {
    id: 1,
    title: 'Board Strategy Call',
    time: '09:00',
    duration: 60,
    attendees: [
      { name: 'Artemis Dow', role: 'Lead Independent Director', reliability: 94 },
      { name: 'James Bell', role: 'Audit Committee Chair', reliability: 88 },
      { name: 'Monica Lozano', role: 'Board Director', reliability: 96 },
      { name: 'Arthur Levinson', role: 'Chairman', reliability: 99 },
    ],
    agenda: ['Q3 2026 performance vs guidance', 'India market $2B expansion approval', 'AI strategy & OpenAI competitive response', 'Capital return program update'],
    aiPrep: "James Bell raised margin compression concerns last session — come armed with Q3 gross margin actuals (43.8% vs 42.1% expected). Arthur wants to see the India store rollout timeline with revised projections. Monica asked about AI product differentiation vs OpenAI's ChatGPT Phone announcement this morning — this will dominate the agenda. Suggest opening with the OpenAI news before they bring it up.",
    riskFlags: ['James historically blocks capex >$1B without CFO stress test — have Luca join remotely', 'Arthur mentioned succession planning to a reporter last week — expect board governance questions', 'OpenAI ChatGPT Phone news broke at 5:45am — all board members will have seen it'],
    lastMemo: 'Board approved $10B India investment in principle. James requested revised margin impact model by this call. Monica asked for consumer AI roadmap comparing Siri vs ChatGPT. Action items: (1) CFO to model India margins, (2) Tim to present AI differentiation strategy, (3) Legal to review India regulatory requirements.',
    lastDate: '2026-05-15',
    status: 'upcoming',
    sentiment: 'high-stakes',
  },
  {
    id: 2,
    title: 'iPhone 17 Design Review',
    time: '10:30',
    duration: 45,
    attendees: [
      { name: 'Greg Joswiak', role: 'SVP Worldwide Marketing', reliability: 97 },
      { name: 'Johny Srouji', role: 'SVP Hardware Technologies', reliability: 99 },
      { name: 'Design Team Lead', role: 'Industrial Design', reliability: 92 },
    ],
    agenda: ['Titanium chassis final approval', 'Camera module design sign-off', 'Color palette for launch', 'Packaging sustainability review'],
    aiPrep: "Last review flagged the camera bump as 'too prominent' — the team has revised it by 0.8mm reduction. Johny confirmed A19 chip thermal performance meets requirements. Greg wants to discuss the 'Sky Blue' colorway — market research shows 34% preference vs 'Desert Titanium'. Key decision needed: final color palette approval for manufacturing.",
    riskFlags: ['Camera design approval is on critical path — delay = 3 week production impact', 'Sky Blue requires new anodizing process not yet validated at scale'],
    lastMemo: 'Camera bump reduced. A19 thermal approved. Color vote split: Sky Blue (Greg) vs Desert Titanium (Design Team). Tim to decide by today. Packaging uses 94% recycled materials — approved. Next step: final Tim sign-off on colors.',
    lastDate: '2026-05-28',
    status: 'upcoming',
    sentiment: 'normal',
  },
  {
    id: 3,
    title: 'TSMC Supply Chain Update',
    time: '11:30',
    duration: 30,
    attendees: [
      { name: 'Jeff Williams', role: 'COO', reliability: 98 },
      { name: 'TSMC Liaison', role: 'Supply Chain Partner', reliability: 85 },
    ],
    agenda: ['A19 chip yield rates', 'Q4 allocation confirmation', 'Geopolitical risk assessment'],
    aiPrep: "Yield rates on A19 3nm process dropped to 71% last week (target: 78%). Jeff believes process adjustments will recover yields by July 15 — two weeks before lock-in. TSMC liaison mentioned a competing order from Samsung that could affect Q4 allocation. This is the critical ask: confirm our 180M unit allocation for Q4 iPhone launch.",
    riskFlags: ['TSMC yield below target — may need backup allocation plan', 'Samsung competing for same fab capacity — leverage our prepayment terms', 'Taiwan weather disruptions forecasted for next 3 weeks'],
    lastMemo: 'A19 yield at 68% — below 78% target. TSMC committed to recovery by July 1. Q4 allocation verbally confirmed at 180M units but not yet in writing. Jeff to follow up with formal contract. Geopolitical risk level: Yellow.',
    lastDate: '2026-05-20',
    status: 'upcoming',
    sentiment: 'high-stakes',
  },
  {
    id: 4,
    title: 'Q1 2026 Earnings Call Debrief',
    time: 'Yesterday 4:00pm',
    duration: 90,
    attendees: [{ name: 'Luca Maestri', role: 'CFO', reliability: 99 }, { name: 'Investor Relations', role: 'Team', reliability: 96 }],
    agenda: [],
    aiPrep: '',
    riskFlags: [],
    lastMemo: 'Q1 revenue $124.3B (+6% YoY). Services hit record $26.6B. iPhone revenue $69.1B (+2%). Analysts focused on China weakness (-8%) and AI monetization timeline. Three analyst upgrades post-call. Morgan Stanley raised PT to $240. Main concern flagged: AI features not yet driving ASP uplift. Action: Tim to address AI roadmap publicly at WWDC.',
    lastDate: '2026-06-02',
    status: 'past',
    sentiment: 'positive',
  },
];

export const appleNews = [
  { id: 1, headline: 'AAPL surges 2.3% pre-market after strong iPhone 17 supply chain reports emerge from Asia', source: 'Bloomberg', sentiment: 'positive', time: '6:12am', priority: 'high', category: 'Stock', read: false },
  { id: 2, headline: '🚨 OpenAI announces "ChatGPT Phone" Samsung partnership — direct threat to iPhone AI differentiation', source: 'TechCrunch', sentiment: 'negative', time: '5:45am', priority: 'critical', category: 'Competitor', read: false },
  { id: 3, headline: 'Apple Vision Pro Q2 shipments beat consensus by 40% — spatial computing momentum builds', source: 'WSJ', sentiment: 'positive', time: '4:30am', priority: 'medium', category: 'Product', read: false },
  { id: 4, headline: 'Morgan Stanley raises AAPL price target to $240, cites services growth acceleration', source: 'CNBC', sentiment: 'positive', time: '3:15am', priority: 'medium', category: 'Analyst', read: true },
  { id: 5, headline: 'EU opens formal investigation into App Store compliance under Digital Markets Act', source: 'Reuters', sentiment: 'negative', time: '2:00am', priority: 'high', category: 'Regulatory', read: false },
  { id: 6, headline: 'Apple suppliers confirm 15% increase in iPhone 17 component orders vs iPhone 16 cycle', source: 'Nikkei Asia', sentiment: 'positive', time: '1:20am', priority: 'medium', category: 'Supply Chain', read: true },
  { id: 7, headline: 'Google Gemini Ultra 3 benchmarks show 23% performance lead over Apple Intelligence — analysts warn', source: 'The Verge', sentiment: 'negative', time: '12:45am', priority: 'high', category: 'Competitor', read: false },
  { id: 8, headline: 'India iPhone manufacturing hits 20% of global production — Make in India strategy paying off', source: 'Economic Times', sentiment: 'positive', time: 'Yesterday 11pm', priority: 'medium', category: 'Operations', read: true },
];

export const priorityInbox = [
  { id: 1, from: 'Arthur Levinson', role: 'Chairman, Apple Board', subject: 'Re: ChatGPT Phone — Need your read before 9am call', preview: "Tim, saw the TechCrunch piece at 5am. Board is going to ask about our AI differentiation story. Need your talking points before the call. What's our move?", time: '6:02am', priority: 'critical', read: false, tag: 'Board' },
  { id: 2, from: 'Jeff Williams', role: 'COO', subject: 'TSMC Yield Update — Action Required', preview: 'Yield dropped to 69% overnight. Still above abort threshold but we need to decide on backup allocation strategy by end of day. Calling you at 11:30 to discuss.', time: '5:58am', priority: 'critical', read: false, tag: 'Operations' },
  { id: 3, from: 'Katherine Adams', role: 'General Counsel', subject: 'EU DMA Investigation — Media Statement Needed', preview: 'EU formally opened investigation this morning. We have a 48-hour window before it becomes front-page news. Recommend proactive statement. Can you review by noon?', time: '5:30am', priority: 'high', read: false, tag: 'Legal' },
  { id: 4, from: 'Greg Joswiak', role: 'SVP Marketing', subject: 'WWDC AI Keynote — Final Approval Needed Today', preview: 'Demo reel is locked. Script is 94% done. Need your final sign-off on the Apple Intelligence comparison segment before we go to rehearsal tomorrow morning.', time: '4:45am', priority: 'high', read: false, tag: 'Product' },
  { id: 5, from: 'Luca Maestri', role: 'CFO', subject: 'India Investment Model — Board Ready', preview: 'Attached the revised India margin model. Gross margin impact: -40bps in year 1, +120bps by year 3 at scale. James Bell will find this compelling. Ready for 9am.', time: '4:12am', priority: 'high', read: true, tag: 'Finance' },
  { id: 6, from: 'Eddy Cue', role: 'SVP Services', subject: 'Services Revenue on Track for Record Q3', preview: 'App Store, Apple TV+, and iCloud all trending ahead of guidance. Projecting $27.8B for Q3 — would set new record. Thought you should know before the board call.', time: '3:30am', priority: 'medium', read: true, tag: 'Services' },
  { id: 7, from: 'WSJ Reporter', role: 'Wall Street Journal', subject: 'Interview Prep — Questions Submitted', preview: 'Here are my planned questions for the 5pm interview: (1) Apple AI vs ChatGPT, (2) China revenue outlook, (3) Tim Cook succession. Please review and flag any concerns.', time: '2:15am', priority: 'medium', read: false, tag: 'PR' },
  { id: 8, from: 'Investor Relations', role: 'Apple IR', subject: 'Post-Earnings Analyst Tracker', preview: '12 upgrades, 2 downgrades since yesterday earnings call. Avg PT now $231 vs $218 before. Top concern: China and AI monetization timeline. Detailed report attached.', time: '1:00am', priority: 'medium', read: true, tag: 'Investor' },
];

export const decisionScenarios = [
  'OpenAI just announced a ChatGPT Phone with Samsung. Do we accelerate Siri or make an AI acquisition?',
  'TSMC yield rates are 7% below target. Do we delay iPhone 17 launch or source backup chips?',
  'EU DMA investigation opens. Do we fight it publicly or make preemptive App Store concessions?',
  'China revenue down 8% — do we cut prices, increase marketing, or accept the loss and focus on India?',
];
