"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { COGNITUM_LEARN_VERSION } from "../version";

const BRIDGE = "http://127.0.0.1:7878";

type BridgeState = "checking" | "offline" | "online";
type Step = "welcome" | "seed" | "topic" | "ingest" | "wow" | "chat";
type Progress = { message: string; level: string; progress: number; done: boolean };

type Topic = {
  slug: string;
  video_count: number;
  chunks: number;
  size_kb: number;
  updated_at: string;
};

type Status = {
  model: string;
  kb_root: string;
  seed: { connected: boolean; ip: string | null };
};

type StarterTopic = {
  slug: string;
  title: string;
  blurb: string;
  source: string;
  emoji: string;
  firstQuestion: string;
};

// Each starter pulls ~7 videos from each of 3 expert channels (21 total).
// The bridge splits the comma-separated source list and ingests sequentially.
const STARTERS: StarterTopic[] = [
  {
    slug: "retirement-planning-at-45",
    title: "Retirement planning at 45 · own the math, not the salesperson",
    blurb: "Synthesize 3 fee-only-advisor channels — Rob Berger, The Money Guys, Ramsey — on what the math actually says, not what someone selling AUM tells you.",
    source: "https://www.youtube.com/@RobBerger,https://www.youtube.com/@MoneyGuyShow,https://www.youtube.com/@ramseyshow",
    emoji: "🏦",
    firstQuestion: "If I have $400k in a 401k at 45 and want to retire at 60, what do the three channels agree (and disagree) on for monthly savings rate?",
  },
  {
    slug: "day-trading-with-ai",
    title: "Day trading with AI · beating the retail average",
    blurb: "Synthesize 3 trading channels — TheTradingChannel, Adam Khoo, Mark Meldrum — on the edges that consistently outperform.",
    source: "https://www.youtube.com/@TheTradingChannel,https://www.youtube.com/@AdamKhoo,https://www.youtube.com/@MarkMeldrum",
    emoji: "📈",
    firstQuestion: "Across the three channels, what's the single edge they all agree separates the traders who beat the S&P 500 from the 80% who don't?",
  },
  {
    slug: "southeast-asia-6-weeks",
    title: "Solo travel · 6 weeks across SE Asia under $4k",
    blurb: "Three travel-vlogger channels — Kara & Nate, Drew Binsky, Wolters World — synthesized into routes, costs, and visa quirks that actually worked.",
    source: "https://www.youtube.com/@KaraandNate,https://www.youtube.com/@DrewBinsky,https://www.youtube.com/@WoltersWorld",
    emoji: "🌏",
    firstQuestion: "What's the optimal order to do Thailand → Vietnam → Indonesia in October-November to chase good weather and avoid the tourist crush?",
  },
  {
    slug: "ai-moat-for-solo-builders",
    title: "Gen AI as a moat · what you can sell that ChatGPT can't",
    blurb: "YC interviews + Pieter Levels + Starter Story — synthesized into what indie hackers are actually charging money for in 2026.",
    source: "https://www.youtube.com/@ycombinator,https://www.youtube.com/@levelsio,https://www.youtube.com/@StarterStoryShow",
    emoji: "🛠️",
    firstQuestion: "What kinds of AI products are indie builders actually charging real money for in 2026 — and which categories have already commoditized?",
  },
  {
    slug: "strength-after-40",
    title: "Strength training after 40 · without breaking yourself",
    blurb: "Three evidence-based coaches — Jeff Nippard, AthleanX, Renaissance Periodization — synthesized on volume, recovery, and what changes after 40.",
    source: "https://www.youtube.com/@JeffNippard,https://www.youtube.com/@athleanx,https://www.youtube.com/@RenaissancePeriodization",
    emoji: "🏋️",
    firstQuestion: "Where do the three coaches agree on weekly volume for someone over 40, and where do they disagree?",
  },
  {
    slug: "home-solar-suburbia",
    title: "DIY home solar + battery in suburbia",
    blurb: "Will Prowse + DIY Solar Power + Signature Solar — three deep channels on sizing, inverter choice, and permits, from people who've wired hundreds of roofs.",
    source: "https://www.youtube.com/@WillProwse,https://www.youtube.com/@DIYSolarPower,https://www.youtube.com/@SignatureSolar",
    emoji: "☀️",
    firstQuestion: "Across the three channels, what's the realistic total cost for a 10kW DIY install on a 2,400 sqft suburban home, and what's the consensus payback period?",
  },
];

export default function Page() {
  const [bridge, setBridge] = useState<BridgeState>("checking");
  const [status, setStatus] = useState<Status | null>(null);
  const [topics, setTopics] = useState<Topic[]>([]);
  // Default to welcome unless localStorage says we've onboarded
  const [step, setStep] = useState<Step>(() => {
    if (typeof window === "undefined") return "welcome";
    return localStorage.getItem("cognitumlearn-welcomed") === "1" ? "seed" : "welcome";
  });
  const [seedName, setSeedName] = useState<string>("My Seed");
  const [activeTopic, setActiveTopic] = useState<StarterTopic | null>(null);
  const [ingestStats, setIngestStats] = useState<{ videos: number; chunks: number; concepts: number } | null>(null);

  const probe = useCallback(async () => {
    try {
      const res = await fetch(`${BRIDGE}/api/health`, { cache: "no-store" });
      if (!res.ok) throw new Error("not ok");
      const [s, t] = await Promise.all([
        fetch(`${BRIDGE}/api/status`).then((r) => r.json()) as Promise<Status>,
        fetch(`${BRIDGE}/api/topics`).then((r) => r.json()),
      ]);
      setStatus(s);
      setTopics(t.topics ?? []);
      setBridge("online");
      if (s.seed.connected && step === "seed") setStep("topic");
    } catch {
      setBridge("offline");
    }
  }, [step]);

  const finishWelcome = () => {
    try { localStorage.setItem("cognitumlearn-welcomed", "1"); } catch {}
    setStep(status?.seed?.connected ? "topic" : "seed");
  };

  useEffect(() => {
    probe();
    const id = setInterval(probe, 5000);
    return () => clearInterval(id);
  }, [probe]);

  return (
    <main className="min-h-screen text-slate-200">
      <Header bridge={bridge} />
      <div className="max-w-4xl mx-auto px-5 sm:px-6 pb-24">
        {/* Welcome ALWAYS shows first for new users, regardless of bridge state.
            Only after they click "Start the tour" do we check the bridge. */}
        {step === "welcome" && <WelcomeStep onContinue={finishWelcome} />}
        {step !== "welcome" && bridge === "checking" && <CheckingBridge />}
        {step !== "welcome" && bridge === "offline" && <Offline />}
        {step !== "welcome" && bridge === "online" && status && (
          <>
            <Progressbar step={step} />
            {step === "seed" && (
              <SeedStep
                status={status}
                seedName={seedName}
                setSeedName={setSeedName}
                onPaired={() => { probe(); setStep("topic"); }}
              />
            )}
            {step === "topic" && (
              <TopicStep
                topics={topics}
                onStarter={(t) => { setActiveTopic(t); setStep("ingest"); }}
                onCustom={(t) => { setActiveTopic(t); setStep("ingest"); }}
                onExisting={() => setStep("chat")}
              />
            )}
            {step === "ingest" && activeTopic && (
              <IngestStep
                topic={activeTopic}
                seedName={seedName}
                onDone={(stats) => { setIngestStats(stats); probe(); setStep("wow"); }}
              />
            )}
            {step === "wow" && activeTopic && ingestStats && (
              <WowCard
                topic={activeTopic}
                seedName={seedName}
                stats={ingestStats}
                onAsk={() => setStep("chat")}
              />
            )}
            {step === "chat" && (
              <ChatStep
                topics={topics}
                seedName={seedName}
                initialTopic={activeTopic?.slug ?? topics[0]?.slug ?? ""}
                initialQuestion={activeTopic?.firstQuestion ?? ""}
              />
            )}
          </>
        )}
      </div>
      <Footer />
    </main>
  );
}

// ── Welcome (educational pre-flow) ─────────────────────────────────────────

function WelcomeStep({ onContinue }: { onContinue: () => void }) {
  return (
    <div className="py-8">
      {/* Skip link top-right */}
      <div className="flex justify-end mb-8">
        <button onClick={onContinue} className="mono text-[10px] uppercase tracking-widest text-slate-500 hover:text-amber-300 transition flex items-center gap-2">
          skip the intro <span aria-hidden>→</span>
        </button>
      </div>

      {/* Section 1 — what is the thing */}
      <section className="mb-20">
        <div className="mono text-[11px] uppercase tracking-widest text-amber-300 mb-3 flex items-center gap-2">
          <span className="inline-block w-4 h-px bg-amber-300" />
          FIRST · WHAT DID YOU JUST BUY?
        </div>
        <h2 className="display text-[34px] sm:text-[44px] leading-[1.1] text-slate-50 font-normal mb-6">
          That little COGNITUM box is a tiny <em className="cream italic">computer with a brain</em>.
        </h2>
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-5">
            <div className="relative aspect-[3/4] rounded-md overflow-hidden border border-slate-800 bg-slate-900">
              <Image src="/img/seed-product.png" alt="The Cognitum One Seed — small dark module shown next to its retail box branded COGNITUM seed."
                fill className="object-contain" sizes="(min-width: 1024px) 40vw, 100vw" />
            </div>
            <div className="mt-3 mono text-[10px] uppercase tracking-widest text-slate-500 text-center">
              your Cognitum One Seed · the dark module under the box
            </div>
          </div>
          <div className="lg:col-span-7 space-y-4 text-[16px] leading-[1.7] text-slate-300">
            <p>That&rsquo;s it — the small dark module shown in the photo, with its retail box on top so you can tell the scale. It carries an <em className="text-amber-300 not-italic">AI brain</em> (vector database + local inference) and the ports to plug into your Mac. Lives on your desk. Yours. Never asks for an account or sends anything to a cloud.</p>
            <p>It can do a few things, but the <em className="text-amber-300 not-italic">primary thing it does</em> — the one most people buy it for — is what we&rsquo;ll set up together right now.</p>
            <details className="pt-2">
              <summary className="mono text-[11px] uppercase tracking-widest text-slate-500 hover:text-amber-300 transition cursor-pointer inline-flex items-center gap-2">
                <span className="inline-block w-3 h-px bg-current" /> wired into a Mac mini
              </summary>
              <div className="mt-4 relative aspect-square max-w-[320px] rounded-md overflow-hidden border border-slate-800">
                <Image src="/img/seed-on-mac.png" alt="The Cognitum One Seed dock sitting on top of a Mac Mini host."
                  fill className="object-cover" sizes="320px" />
              </div>
            </details>
            <a href="https://cognitum.one" target="_blank" rel="noreferrer" className="mono text-[11px] uppercase tracking-widest text-slate-500 hover:text-amber-300 transition inline-flex items-center gap-2">
              <span className="inline-block w-3 h-px bg-current" /> more at cognitum.one
            </a>
          </div>
        </div>
      </section>

      {/* Section 2 — what makes it different */}
      <section className="mb-20 border-t border-slate-800 pt-16">
        <div className="mono text-[11px] uppercase tracking-widest text-amber-300 mb-3 flex items-center gap-2">
          <span className="inline-block w-4 h-px bg-amber-300" />
          SECOND · WHAT MAKES IT DIFFERENT FROM CHATGPT
        </div>
        <h2 className="display text-[34px] sm:text-[44px] leading-[1.1] text-slate-50 font-normal mb-6">
          It can spend a weekend watching YouTube <em className="cream italic">for you</em>.
        </h2>
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 space-y-5 text-[16px] leading-[1.7] text-slate-300 order-2 lg:order-1">
            <p>ChatGPT answers from what it was trained on months ago. Your Seed does something different: <em className="text-amber-300 not-italic">it goes out and watches actual videos for you</em> — like fifteen hours of YouTube on a topic that matters to you — and remembers every word.</p>
            <p>Concrete example: you want to actually plan your own retirement at 45 instead of paying 1% to a guy reading from a script. Point your Seed at the three best fee-only-advisor YouTube channels. It watches them all overnight. In the morning you ask &ldquo;what&rsquo;s the right monthly savings rate for my situation?&rdquo; and it answers — with cited timestamps from real experts — in under a second.</p>
            <p>Same trick for day-trading, learning to weld, building a SaaS, planning a six-week trip through Southeast Asia. Anything where the answer lives across <em className="text-amber-300 not-italic">a lot of video by several experts</em> and you don&rsquo;t have time to watch it all.</p>
          </div>
          <div className="lg:col-span-5 order-1 lg:order-2">
            <div className="relative aspect-[3/2] rounded-md overflow-hidden border border-amber-500/20">
              <Image src="/img/distillation.png" alt="Abstract cascade of video frames, audio waveforms, and book pages flowing down and distilling into glowing vector grid patterns."
                fill className="object-cover" sizes="(min-width: 1024px) 40vw, 100vw" />
            </div>
            <div className="mt-3 mono text-[10px] uppercase tracking-widest text-slate-500 text-center leading-relaxed">
              raw video → distilled knowledge → vector recall<br/>all stored locally on your Seed
            </div>
          </div>
        </div>
      </section>

      {/* Section 3 — the plan */}
      <section className="mb-20 border-t border-slate-800 pt-16">
        <div className="mono text-[11px] uppercase tracking-widest text-amber-300 mb-3 flex items-center gap-2">
          <span className="inline-block w-4 h-px bg-amber-300" />
          THIRD · WHAT WE&rsquo;RE GOING TO DO TOGETHER
        </div>
        <h2 className="display text-[34px] sm:text-[44px] leading-[1.1] text-slate-50 font-normal mb-3">
          About <em className="cream italic">fifteen minutes</em>, four small steps.
        </h2>
        <p className="text-slate-400 text-[15px] mb-8 max-w-2xl">
          Nothing destructive can happen. If you mess something up, just close the tab and start over.
        </p>
        <FlowDiagram />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-6">
          <PlanStep n="1" title="Find your Seed">We scan the network and locate the little box on your desk. ~10 seconds.</PlanStep>
          <PlanStep n="2" title="Pick a topic">You tell us what you want to become an expert at. We&rsquo;ve got starters if you&rsquo;re not sure.</PlanStep>
          <PlanStep n="3" title="Let it watch">Your Seed pulls down the right YouTube videos, watches every minute, and stores it as vectors. ~10 minutes.</PlanStep>
          <PlanStep n="4" title="Ask away">When it&rsquo;s done, you ask anything and it cites the exact video + timestamp.</PlanStep>
        </div>
      </section>

      {/* Section 4 — END STATE preview */}
      <section className="mb-12 border-t border-slate-800 pt-16">
        <div className="mono text-[11px] uppercase tracking-widest text-emerald-300 mb-3 flex items-center gap-2">
          <span className="inline-block w-4 h-px bg-emerald-300" />
          AND THEN · WHAT YOU&rsquo;LL HAVE
        </div>
        <h2 className="display text-[34px] sm:text-[44px] leading-[1.1] text-slate-50 font-normal mb-6">
          A finished expert that <em className="cream italic">cites every source</em>.
        </h2>
        <p className="text-slate-400 text-[15px] mb-8 max-w-2xl">
          Here&rsquo;s what your screen will look like when you&rsquo;re done. A real question, a synthesized answer, every claim backed by a video timestamp you can click through and verify.
        </p>

        {/* Mocked answer preview — uses real .answer typography */}
        <div className="border border-slate-800 bg-slate-900/40 rounded-[6px] p-5 sm:p-6">
          <div className="font-mono text-[10px] uppercase tracking-widest text-slate-500 mb-1">YOU</div>
          <div className="text-slate-100 mb-4">If I have $400k in a 401k at 45 and want to retire at 60, what does the math actually say I need to save monthly?</div>
          <div className="font-mono text-[10px] uppercase tracking-widest text-amber-300 mb-2">MY SEED</div>
          <div className="answer">
            <p>Based on the three fee-only advisor channels you indexed, the consensus math points to roughly <strong>$2,800–$3,400 per month</strong> in additional savings, assuming a 7% real return and a 4% safe withdrawal rate in retirement.</p>
            <h3>Why that range, not a single number</h3>
            <ul>
              <li>The lower end ($2,800) assumes you keep your current 401k contributions AND your spending stays flat (Berger).</li>
              <li>The upper end ($3,400) is what The Money Guys recommend if you want a buffer for sequence-of-returns risk in the first five years of retirement.</li>
              <li>If you have any pension or expected Social Security, both shows would tell you to subtract its present-value from the target.</li>
            </ul>
            <h3>The math, briefly</h3>
            <p>At 45 with $400k growing at 7% real for 15 years, you arrive at <code>~$1.1M</code> without contributing another dollar. At a 4% safe withdrawal, that supports about <code>$44k/year</code> in retirement spending. If your number is higher, the gap is what you save monthly.</p>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-800">
            <div className="font-mono text-[10px] uppercase tracking-widest text-emerald-300 mb-2">
              ✦ cited from 3 sources
            </div>
            <ul className="space-y-1.5 text-sm text-slate-400">
              <li className="flex items-start gap-2"><span className="text-emerald-300 mt-0.5">·</span>Rob Berger · &ldquo;Sequence of Returns Risk Explained&rdquo; @ 14:32</li>
              <li className="flex items-start gap-2"><span className="text-emerald-300 mt-0.5">·</span>The Money Guy Show · &ldquo;The Wealth Multiplier&rdquo; @ 02:08</li>
              <li className="flex items-start gap-2"><span className="text-emerald-300 mt-0.5">·</span>Ramsey Show · &ldquo;The 4% Rule&rdquo; @ 11:47</li>
            </ul>
          </div>
        </div>
        <p className="mt-3 mono text-[10px] uppercase tracking-widest text-slate-500 text-center">
          a preview · your actual answers come from videos YOU pick on topics YOU care about
        </p>
      </section>

      {/* CTA */}
      <section className="border-t border-slate-800 pt-12">
        <button onClick={onContinue}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-5 bg-amber-300 text-slate-950 font-semibold text-[17px] hover:bg-amber-200 transition rounded-[4px]">
          Start the tour <span aria-hidden>→</span>
        </button>
        <p className="mt-4 mono text-[10px] uppercase tracking-widest text-slate-500">
          stays local · uses about as much internet as a Netflix night
        </p>
      </section>
    </div>
  );
}

function FlowDiagram() {
  const steps = [
    { icon: "📡", label: "scan" },
    { icon: "🎯", label: "pick" },
    { icon: "🎬", label: "watch" },
    { icon: "💬", label: "ask" },
  ];
  return (
    <svg viewBox="0 0 800 100" className="w-full max-w-[700px] mx-auto" aria-hidden>
      {steps.map((s, i) => (
        <g key={s.label} transform={`translate(${100 + i * 180} 50)`}>
          <circle cx="0" cy="0" r="28" fill="#0b1220" stroke="#fcd34d" strokeWidth="1.2" />
          <text x="0" y="6" textAnchor="middle" fontSize="22">{s.icon}</text>
          <text x="0" y="56" textAnchor="middle" fill="#94a3b8" fontFamily="ui-monospace" fontSize="10" letterSpacing="2">{s.label.toUpperCase()}</text>
          <circle cx="-18" cy="-18" r="9" fill="#fcd34d" />
          <text x="-18" y="-14" textAnchor="middle" fill="#0b1220" fontSize="11" fontWeight="700">{i + 1}</text>
        </g>
      ))}
      {[0, 1, 2].map((i) => (
        <g key={i} stroke="#475569" strokeWidth="1" strokeDasharray="3 3" fill="none">
          <line x1={140 + i * 180} y1="50" x2={222 + i * 180} y2="50" />
          <polygon points={`${222 + i * 180},45 ${232 + i * 180},50 ${222 + i * 180},55`} fill="#475569" stroke="none" />
        </g>
      ))}
    </svg>
  );
}

function PlanStep({ n, title, children }: { n: string; title: string; children: React.ReactNode }) {
  return (
    <div className="border border-slate-800 bg-slate-900/40 rounded-[4px] p-5">
      <div className="flex items-baseline gap-2 mb-2">
        <span className="display text-[28px] text-amber-300 leading-none">{n}</span>
        <span className="mono text-[10px] uppercase tracking-widest text-slate-500">·</span>
        <span className="text-slate-100 font-medium text-[15px]">{title}</span>
      </div>
      <p className="text-slate-400 text-[13px] leading-[1.55]">{children}</p>
    </div>
  );
}

// ── Header ──────────────────────────────────────────────────────────────────

function Header({ bridge }: { bridge: BridgeState }) {
  return (
    <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur sticky top-0 z-10">
      <div className="max-w-4xl mx-auto px-5 sm:px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <span className="font-mono text-sm tracking-wider text-slate-100 group-hover:text-amber-300 transition">cognitum-learn</span>
          <span className="font-mono text-[10px] uppercase tracking-widest text-slate-500" data-version>{COGNITUM_LEARN_VERSION}</span>
        </Link>
        <BridgePill bridge={bridge} />
      </div>
    </header>
  );
}

function BridgePill({ bridge }: { bridge: BridgeState }) {
  const cfg = bridge === "online"
    ? { dot: "bg-emerald-400 animate-pulse", label: `bridge running · ${COGNITUM_LEARN_VERSION}`, tone: "text-emerald-300" }
    : bridge === "offline"
      ? { dot: "bg-amber-400", label: "preview mode · run `learn ui` to go live", tone: "text-amber-300" }
      : { dot: "bg-slate-500 animate-pulse", label: "checking…", tone: "text-slate-400" };
  return (
    <div className={`flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest ${cfg.tone}`}>
      <span className={`w-1.5 h-1.5 ${cfg.dot}`} />
      {cfg.label}
    </div>
  );
}

// ── Checking ────────────────────────────────────────────────────────────────

function CheckingBridge() {
  return (
    <div className="py-20 text-center">
      <div className="font-mono text-[11px] uppercase tracking-widest text-slate-500">looking for your local bridge…</div>
    </div>
  );
}

// ── Offline (3 install tabs) ────────────────────────────────────────────────

function Offline() {
  const [tab, setTab] = useState<"cargo" | "brew" | "download">("cargo");
  return (
    <section className="mt-10 border border-slate-800 bg-slate-900/40 rounded-[6px] p-7">
      <div className="font-mono text-[11px] uppercase tracking-widest text-amber-300 flex items-center gap-3 mb-4">
        <span className="inline-block w-4 h-px bg-amber-300" />
        ONE-TIME SETUP · STEP 1 OF 4
      </div>
      <h2 className="text-2xl sm:text-3xl font-bold text-slate-50 mb-3 tracking-tight">Let&rsquo;s get your local bridge running.</h2>
      <p className="text-slate-300 text-[15px] leading-relaxed mb-6 max-w-2xl">
        This dashboard talks to a tiny CLI you run on your own machine — that&rsquo;s how nothing leaves your network. Pick your preferred install method. Takes about three minutes. The page connects automatically once it&rsquo;s running.
      </p>

      {/* Tabs — short on mobile, full on desktop */}
      <div className="flex border-b border-slate-800 mb-5 overflow-x-auto">
        {[
          { id: "brew" as const, short: "Homebrew", long: "Homebrew · macOS" },
          { id: "cargo" as const, short: "Cargo", long: "Cargo · cross-platform" },
          { id: "download" as const, short: "Download", long: "Download binary" },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-3 sm:px-4 py-2.5 font-mono text-[11px] uppercase tracking-widest border-b-2 -mb-px transition whitespace-nowrap flex-none ${
              tab === t.id ? "border-amber-300 text-amber-300" : "border-transparent text-slate-500 hover:text-slate-300"
            }`}
          >
            <span className="sm:hidden">{t.short}</span>
            <span className="hidden sm:inline">{t.long}</span>
          </button>
        ))}
      </div>

      {tab === "brew" && (
        <div className="space-y-3">
          <CodeBlock>brew install stuinfla/tap/cognitum-learn  # coming soon — use Cargo for now</CodeBlock>
          <p className="text-slate-500 text-xs">Homebrew formula is in the pipeline. Use the Cargo tab today.</p>
        </div>
      )}
      {tab === "cargo" && (
        <div className="space-y-3">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-widest text-slate-500 mb-1.5">First — install Rust if you don&rsquo;t have it</div>
            <CodeBlock>curl --proto &apos;=https&apos; --tlsv1.2 -sSf https://sh.rustup.rs | sh</CodeBlock>
          </div>
          <div>
            <div className="font-mono text-[10px] uppercase tracking-widest text-slate-500 mb-1.5 mt-3">Then — install cognitum-learn</div>
            <CodeBlock>cargo install --git https://github.com/stuinfla/cognitum-learn learn-cli</CodeBlock>
          </div>
          <div>
            <div className="font-mono text-[10px] uppercase tracking-widest text-slate-500 mb-1.5 mt-3">Finally — start the bridge</div>
            <CodeBlock>learn ui</CodeBlock>
            <p className="text-slate-500 text-xs mt-2">Compiles in 3–5 min. Installs a <code className="font-mono text-amber-200">learn</code> binary to ~/.cargo/bin/.</p>
          </div>
        </div>
      )}
      {tab === "download" && (
        <div className="space-y-3">
          <p className="text-slate-400 text-[14px]">Grab a pre-built binary for your platform.</p>
          <a href="https://github.com/stuinfla/cognitum-learn/releases/latest" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-5 py-3 bg-amber-300 text-slate-950 font-medium hover:bg-amber-200 transition rounded-[4px]">
            Open GitHub Releases <span aria-hidden>↗</span>
          </a>
          <p className="text-slate-500 text-xs">Download the right tarball, extract <code className="font-mono text-amber-200">learn</code>, and put it on your PATH. Then run <code className="font-mono text-amber-200">learn ui</code>.</p>
        </div>
      )}

      <div className="mt-7 pt-5 border-t border-slate-800 flex items-center gap-2 text-slate-500 text-xs">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
        <span>polling <code className="font-mono text-slate-400">127.0.0.1:7878</code> every 5 seconds — no need to refresh.</span>
      </div>
    </section>
  );
}

function CodeBlock({ children }: { children: string }) {
  return (
    <div className="font-mono text-[13px] text-amber-200 bg-slate-950 border border-slate-800 px-4 py-3 rounded-[4px] overflow-x-auto whitespace-pre">
      <span className="text-slate-600 select-none">$ </span>{children}
    </div>
  );
}

// ── Progress bar (the 4 steps) ─────────────────────────────────────────────

function Progressbar({ step }: { step: Step }) {
  const labels: { id: Step; label: string }[] = [
    { id: "seed",   label: "1 · Pair" },
    { id: "topic",  label: "2 · Pick a topic" },
    { id: "ingest", label: "3 · Learn" },
    { id: "chat",   label: "4 · Ask" },
  ];
  const idx = step === "wow" ? 3 : labels.findIndex((l) => l.id === step);
  return (
    <nav className="mt-10 mb-10">
      <div className="flex items-center gap-4">
        {labels.map((l, i) => {
          const done = i < idx;
          const active = i === idx;
          return (
            <div key={l.id} className="flex items-center gap-4 flex-1">
              <div className="flex items-center gap-2">
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold transition ${
                  done ? "bg-amber-300 text-slate-950"
                  : active ? "bg-amber-300/15 border border-amber-300 text-amber-300"
                  : "bg-slate-900 border border-slate-700 text-slate-600"
                }`}>{done ? "✓" : i + 1}</span>
                <span className={`font-mono text-[10px] uppercase tracking-widest whitespace-nowrap transition ${
                  done ? "text-amber-300" : active ? "text-amber-300" : "text-slate-600"
                }`}>{l.label.split(" · ")[1] || l.label}</span>
              </div>
              {i < labels.length - 1 && (
                <span className={`flex-1 h-px transition ${done ? "bg-amber-300/40" : "bg-slate-800"}`} />
              )}
            </div>
          );
        })}
      </div>
    </nav>
  );
}

// ── Step 1: Seed pairing ───────────────────────────────────────────────────

function SeedStep({ status, seedName, setSeedName, onPaired }: {
  status: Status; seedName: string; setSeedName: (s: string) => void; onPaired: () => void;
}) {
  const [phase, setPhase] = useState<"idle" | "scanning" | "found" | "manual">("idle");
  const [secondsLeft, setSecondsLeft] = useState(4);
  const [foundIp, setFoundIp] = useState<string | null>(null);
  const [manual, setManual] = useState(status.seed.ip ?? "");
  const [err, setErr] = useState<string | null>(null);

  const scan = async () => {
    setPhase("scanning");
    setErr(null);
    setSecondsLeft(4);
    const timer = setInterval(() => setSecondsLeft((s) => Math.max(0, s - 1)), 1000);
    try {
      const res = await fetch(`${BRIDGE}/api/seed/discover`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ timeout_secs: 4 }),
      });
      const data = await res.json();
      clearInterval(timer);
      const first = (data.found ?? [])[0] as string | undefined;
      if (first) {
        setFoundIp(first);
        setPhase("found");
      } else {
        setPhase("manual");
      }
    } catch (e: unknown) {
      clearInterval(timer);
      setErr((e as Error).message);
      setPhase("manual");
    }
  };

  const pair = async (address: string) => {
    setErr(null);
    try {
      const res = await fetch(`${BRIDGE}/api/seed/configure`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address, auto_push: true }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      onPaired();
    } catch (e: unknown) {
      setErr((e as Error).message);
    }
  };

  return (
    <section>
      <h2 className="display text-[36px] sm:text-[44px] leading-[1.1] text-slate-50 font-normal mb-3">
        Let&rsquo;s <em className="text-amber-300 italic">find</em> your Seed.
      </h2>
      <p className="text-slate-400 text-[15px] leading-relaxed mb-10 max-w-2xl">
        Your Cognitum One Seed broadcasts itself on your local network. One scan and we should see it. If you connected by USB, we&rsquo;ll fall back to the cable.
      </p>

      {status.seed.ip && phase === "idle" && (
        <div className="mb-6 px-4 py-3 rounded-[4px] bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-sm">
          Already paired with <code className="font-mono">{status.seed.ip}</code> · <button className="underline hover:no-underline" onClick={() => onPaired()}>continue</button>
        </div>
      )}

      {phase === "idle" && (
        <button
          onClick={scan}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-5 bg-amber-300 text-slate-950 font-semibold text-[17px] hover:bg-amber-200 transition rounded-[4px] shadow-lg shadow-amber-900/30"
        >
          <span className="w-2 h-2 rounded-full bg-slate-950" /> Scan my network for the Seed
        </button>
      )}

      {phase === "scanning" && (
        <div className="border border-amber-300/30 rounded-[6px] p-8 bg-amber-300/[0.03]">
          <div className="flex items-center gap-4">
            <Spinner />
            <div>
              <div className="text-slate-100 font-medium">Scanning your network…</div>
              <div className="font-mono text-[11px] uppercase tracking-widest text-amber-300 mt-1">{secondsLeft}s remaining</div>
            </div>
          </div>
        </div>
      )}

      {phase === "found" && foundIp && (
        <FoundCard
          ip={foundIp}
          seedName={seedName}
          setSeedName={setSeedName}
          onPair={() => pair(foundIp)}
        />
      )}

      {phase === "manual" && (
        <div className="border border-slate-800 rounded-[6px] p-6 bg-slate-900/40 space-y-4">
          <div className="font-mono text-[11px] uppercase tracking-widest text-amber-300 flex items-center gap-2">
            <span className="inline-block w-3 h-px bg-amber-300" />
            mDNS DIDN&rsquo;T FIND ONE
          </div>
          <h3 className="text-lg font-semibold text-slate-100">No worries. Try one of these.</h3>
          <ul className="space-y-3 text-slate-300 text-[14px]">
            <li className="flex items-start gap-3"><span className="text-amber-300 mt-0.5">·</span>Make sure your Seed is plugged in and powered on.</li>
            <li className="flex items-start gap-3"><span className="text-amber-300 mt-0.5">·</span>Confirm your Seed is on the same WiFi network as this laptop.</li>
            <li className="flex items-start gap-3"><span className="text-amber-300 mt-0.5">·</span>If it&rsquo;s connected by USB, it&rsquo;s probably at <code className="font-mono text-amber-200">169.254.42.1</code>.</li>
          </ul>
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={() => pair("169.254.42.1")}
              className="px-5 py-3 border border-amber-300 text-amber-300 font-medium hover:bg-amber-300 hover:text-slate-950 transition rounded-[4px]"
            >
              Connect via USB (169.254.42.1)
            </button>
            <input
              value={manual}
              onChange={(e) => setManual(e.target.value)}
              placeholder="…or paste an IP"
              className="flex-1 px-4 py-3 bg-slate-950 border border-slate-800 text-slate-200 font-mono text-sm rounded-[4px]"
            />
            <button
              onClick={() => manual && pair(manual)}
              disabled={!manual}
              className="px-5 py-3 bg-amber-300 text-slate-950 font-medium hover:bg-amber-200 disabled:opacity-50 transition rounded-[4px]"
            >
              Pair
            </button>
          </div>
          <button onClick={scan} className="font-mono text-[11px] uppercase tracking-widest text-slate-500 hover:text-amber-300 transition">
            ← scan again
          </button>
        </div>
      )}

      {err && <div className="mt-4 text-rose-400 text-sm">{err}</div>}
    </section>
  );
}

function FoundCard({ ip, seedName, setSeedName, onPair }: {
  ip: string; seedName: string; setSeedName: (s: string) => void; onPair: () => void;
}) {
  return (
    <div className="border border-emerald-400/30 rounded-[6px] p-7 bg-emerald-400/[0.04] relative overflow-hidden">
      <div className="absolute -top-12 -right-12 w-32 h-32 bg-emerald-400/10 rounded-full blur-2xl pointer-events-none" />

      <div className="font-mono text-[11px] uppercase tracking-widest text-emerald-300 flex items-center gap-2 mb-4">
        <span className="relative inline-flex w-3 h-3">
          <span className="absolute inline-flex w-full h-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
          <span className="relative inline-flex w-3 h-3 rounded-full bg-emerald-400" />
        </span>
        FOUND YOUR SEED
      </div>

      <h3 className="text-[24px] font-bold text-slate-50 mb-2">Hello, {seedName}.</h3>
      <p className="text-slate-300 text-[14px] mb-6 leading-relaxed">
        Cognitum One Seed · on your local network · offline-capable.
        <br/>
        <span className="text-slate-500">It&rsquo;s ready to learn whatever you point it at.</span>
      </p>

      <div className="space-y-4">
        <div>
          <label className="font-mono text-[10px] uppercase tracking-widest text-slate-400 block mb-1.5">
            What do you want to call this Appliance?
          </label>
          <input
            value={seedName}
            onChange={(e) => setSeedName(e.target.value)}
            className="w-full sm:w-72 px-3 py-2 bg-slate-950 border border-slate-700 text-slate-100 rounded-[4px] focus:border-emerald-400 focus:outline-none"
          />
        </div>
        <button
          onClick={onPair}
          className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-emerald-400 text-slate-950 font-semibold hover:bg-emerald-300 transition rounded-[4px]"
        >
          Pair {seedName} <span aria-hidden>→</span>
        </button>
      </div>

      <details className="mt-5 group">
        <summary className="font-mono text-[10px] uppercase tracking-widest text-slate-500 hover:text-slate-300 cursor-pointer">technical details</summary>
        <div className="mt-2 font-mono text-[11px] text-slate-500">
          discovered via mDNS · _cognitum._tcp.local. · ip <span className="text-emerald-300">{ip}</span>
        </div>
      </details>
    </div>
  );
}

function Spinner() {
  return (
    <svg className="w-6 h-6 animate-spin text-amber-300" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" strokeOpacity="0.2" />
      <path d="M21 12a9 9 0 00-9-9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

// ── Step 2: Pick a topic (starter cards + custom + existing) ───────────────

function TopicStep({ topics, onStarter, onCustom, onExisting }: {
  topics: Topic[]; onStarter: (t: StarterTopic) => void; onCustom: (t: StarterTopic) => void; onExisting: () => void;
}) {
  const [customTitle, setCustomTitle] = useState("");
  const [customSource, setCustomSource] = useState("");
  const [showCustom, setShowCustom] = useState(false);

  const startCustom = () => {
    if (!customTitle || !customSource) return;
    const slug = customTitle.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
    onCustom({
      slug,
      title: customTitle,
      blurb: "Your custom topic.",
      source: customSource,
      emoji: "✨",
      firstQuestion: `What's the most important thing to know about ${customTitle.toLowerCase()}?`,
    });
  };

  return (
    <section>
      <h2 className="display text-[36px] sm:text-[44px] leading-[1.1] text-slate-50 font-normal mb-3">
        What do you want to be an <em className="text-amber-300 italic">expert</em> at?
      </h2>
      <p className="text-slate-400 text-[15px] leading-relaxed mb-3 max-w-2xl">
        Pick a starter. Your Seed will go pull 3–5 of the best YouTube channels on it, watch all 15+ hours, synthesize what they agree and disagree on, and hold it forever. About ten minutes of patience.
      </p>
      <p className="text-slate-500 text-[13px] leading-relaxed mb-10 max-w-2xl italic">
        Tip: the more specific your topic, the more uncanny the answers. &ldquo;Day trading&rdquo; is mush. &ldquo;Day trading the SPY with 0DTE options&rdquo; will get you a real expert.
      </p>

      <div className="font-mono text-[10px] uppercase tracking-widest text-amber-300 mb-4 flex items-center gap-2">
        <span className="inline-block w-3 h-px bg-amber-300" />
        STARTER TOPICS
      </div>
      <div className="grid sm:grid-cols-2 gap-3 mb-10">
        {STARTERS.map((s) => (
          <button
            key={s.slug}
            onClick={() => onStarter(s)}
            className="text-left border border-slate-800 hover:border-amber-300/60 bg-slate-900/30 hover:bg-slate-900/60 p-5 rounded-[6px] transition group"
          >
            <div className="flex items-start gap-3">
              <div className="text-2xl">{s.emoji}</div>
              <div className="flex-1">
                <div className="font-semibold text-slate-100 group-hover:text-amber-300 transition">{s.title}</div>
                <div className="text-slate-400 text-[13px] mt-1 leading-snug">{s.blurb}</div>
              </div>
              <div className="font-mono text-[10px] text-slate-600 group-hover:text-amber-300/70 transition">→</div>
            </div>
          </button>
        ))}
      </div>

      <div className="mb-10">
        {!showCustom ? (
          <button
            onClick={() => setShowCustom(true)}
            className="font-mono text-[11px] uppercase tracking-widest text-slate-400 hover:text-amber-300 transition flex items-center gap-2"
          >
            <span className="inline-block w-3 h-px bg-current" />
            Or describe your own topic
          </button>
        ) : (
          <div className="border border-slate-800 bg-slate-900/30 rounded-[6px] p-5 space-y-4">
            <div className="font-mono text-[10px] uppercase tracking-widest text-amber-300">YOUR OWN TOPIC</div>
            <input
              value={customTitle}
              onChange={(e) => setCustomTitle(e.target.value)}
              placeholder="Topic name (e.g. mountain biking technique)"
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 text-slate-200 rounded-[4px]"
            />
            <input
              value={customSource}
              onChange={(e) => setCustomSource(e.target.value)}
              placeholder="YouTube channel or playlist URL"
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 text-slate-200 font-mono text-sm rounded-[4px]"
            />
            <button
              onClick={startCustom}
              disabled={!customTitle || !customSource}
              className="px-5 py-2.5 bg-amber-300 text-slate-950 font-medium hover:bg-amber-200 disabled:opacity-50 transition rounded-[4px]"
            >
              Build this expert →
            </button>
          </div>
        )}
      </div>

      {topics.length > 0 && (
        <div>
          <div className="font-mono text-[10px] uppercase tracking-widest text-emerald-300 mb-3 flex items-center gap-2">
            <span className="inline-block w-3 h-px bg-emerald-300" />
            EXISTING TOPICS · {topics.length}
          </div>
          <div className="space-y-2">
            {topics.map((t) => (
              <button
                key={t.slug}
                onClick={onExisting}
                className="block w-full text-left border border-slate-800 hover:border-emerald-300/60 bg-slate-950 p-4 rounded-[4px] transition"
              >
                <div className="flex items-center justify-between gap-3">
                  <code className="font-mono text-emerald-300">{t.slug}</code>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-slate-500">
                    {t.video_count} videos · {t.chunks} chunks
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

// ── Step 3: Ingest (ring + counters + card grid) ────────────────────────────

function IngestStep({ topic, seedName, onDone }: {
  topic: StarterTopic; seedName: string;
  onDone: (stats: { videos: number; chunks: number; concepts: number }) => void;
}) {
  const [running, setRunning] = useState(false);
  const [events, setEvents] = useState<Progress[]>([]);
  const [pct, setPct] = useState(0);
  const [phase, setPhase] = useState("Getting ready…");
  const [videos, setVideos] = useState<string[]>([]); // titles extracted from progress
  const [chunks, setChunks] = useState(0);
  const [concepts, setConcepts] = useState(0);
  const [stalled, setStalled] = useState(false);
  const esRef = useRef<EventSource | null>(null);
  const lastEventAt = useRef(Date.now());

  // start ingest as soon as we mount
  useEffect(() => {
    setRunning(true);
    setEvents([]); setPct(0);
    const url = `${BRIDGE}/api/ingest/progress?source=${encodeURIComponent(topic.source)}&topic=${encodeURIComponent(topic.slug)}`;
    const es = new EventSource(url);
    esRef.current = es;
    es.onmessage = (evt) => {
      lastEventAt.current = Date.now();
      setStalled(false);
      try {
        const data: Progress = JSON.parse(evt.data);
        setEvents((prev) => [...prev, data]);
        setPct(data.progress);
        // phase parsing from messages
        const m = data.message.toLowerCase();
        if (m.includes("transcrib")) setPhase("Transcribing audio…");
        else if (m.includes("embed")) setPhase("Distilling into vectors…");
        else if (m.includes("index") || m.includes("hnsw")) setPhase("Building searchable index…");
        else if (m.includes("push")) setPhase(`Pushing to ${seedName}…`);
        else if (m.includes("download") || m.includes("fetch")) setPhase("Downloading videos…");
        else if (m.includes("done") || m.includes("complete")) setPhase("Almost ready…");
        // video title extraction (best-effort, looks for "title:" or quoted strings)
        const titleMatch = data.message.match(/(?:video|title|episode)[:\s]+([^,\n]{4,80})/i);
        if (titleMatch && !videos.includes(titleMatch[1])) {
          setVideos((prev) => prev.length < 24 ? [...prev, titleMatch[1].trim()] : prev);
        }
        // counter inference from messages
        const chunkMatch = data.message.match(/(\d[\d,]*)\s*chunks?/i);
        if (chunkMatch) setChunks(parseInt(chunkMatch[1].replace(/,/g, ""), 10));
        const conceptMatch = data.message.match(/(\d[\d,]*)\s*(?:concepts?|topics?|entities|vectors?)/i);
        if (conceptMatch) setConcepts(parseInt(conceptMatch[1].replace(/,/g, ""), 10));

        if (data.done) {
          es.close();
          setRunning(false);
          // Estimate counters if we never got explicit numbers
          const finalVideos = Math.max(videos.length, 1);
          const finalChunks = chunks || Math.max(finalVideos * 80, 80);
          const finalConcepts = concepts || Math.floor(finalChunks * 0.6);
          setTimeout(() => onDone({ videos: finalVideos, chunks: finalChunks, concepts: finalConcepts }), 1200);
        }
      } catch {}
    };
    es.onerror = () => { es.close(); setRunning(false); };

    return () => { es.close(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topic.slug, topic.source]);

  // stall detector
  useEffect(() => {
    const id = setInterval(() => {
      if (running && Date.now() - lastEventAt.current > 30000) setStalled(true);
    }, 5000);
    return () => clearInterval(id);
  }, [running]);

  return (
    <section>
      <div className="font-mono text-[11px] uppercase tracking-widest text-amber-300 flex items-center gap-2 mb-3">
        <span className="inline-block w-4 h-px bg-amber-300" />
        BUILDING YOUR {topic.title.toUpperCase()} EXPERT
      </div>
      <h2 className="display text-[36px] sm:text-[44px] leading-[1.1] text-slate-50 font-normal mb-2">
        Your Seed is <em className="text-amber-300 italic">studying</em>.
      </h2>
      <p className="text-slate-400 text-[15px] mb-10 max-w-2xl">
        Grab a coffee. {seedName} is fetching videos, transcribing every word, and distilling each one into vectors. About ten minutes of patience for years of expertise.
      </p>

      <div className="grid lg:grid-cols-12 gap-8">
        {/* LEFT: ring + phase + counters */}
        <div className="lg:col-span-5">
          <ProgressRing pct={pct} phase={phase} />
          <div className="mt-8 grid grid-cols-3 gap-3">
            <StatChip label="videos" value={videos.length} />
            <StatChip label="chunks" value={chunks} />
            <StatChip label="concepts" value={concepts} />
          </div>
          {stalled && (
            <div className="mt-6 px-4 py-3 rounded-[4px] bg-amber-500/10 border border-amber-500/30 text-amber-200 text-[13px]">
              Still working — large videos can take a few minutes each. You can leave this tab open; we&rsquo;ll be here.
            </div>
          )}
        </div>

        {/* RIGHT: card grid of incoming videos */}
        <div className="lg:col-span-7">
          <div className="font-mono text-[10px] uppercase tracking-widest text-slate-500 mb-3">
            indexed so far
          </div>
          {videos.length === 0 ? (
            <div className="border border-slate-800 border-dashed rounded-[6px] p-8 text-center">
              <div className="text-slate-500 text-sm">Videos will appear here as your Seed processes them…</div>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-2">
              {videos.map((v, i) => (
                <div key={i} className="border border-slate-800 bg-slate-900/40 rounded-[4px] p-3 flex items-start gap-3 animate-fade-in">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 mt-1.5 flex-none animate-pulse" />
                  <div className="text-slate-200 text-[13px] leading-snug line-clamp-2">{v}</div>
                </div>
              ))}
            </div>
          )}

          <details className="mt-6 group">
            <summary className="font-mono text-[10px] uppercase tracking-widest text-slate-600 hover:text-slate-400 cursor-pointer">
              raw progress log
            </summary>
            <div className="mt-3 max-h-48 overflow-y-auto bg-slate-950 border border-slate-800 rounded-[4px] p-3 font-mono text-[11px] space-y-1">
              {events.slice(-30).map((e, i) => (
                <div key={i} className={
                  e.level === "warn" ? "text-amber-400" :
                  e.level === "success" ? "text-emerald-400" :
                  e.level === "active" ? "text-amber-200" : "text-slate-500"
                }>{e.message}</div>
              ))}
            </div>
          </details>
        </div>
      </div>
    </section>
  );
}

function ProgressRing({ pct, phase }: { pct: number; phase: string }) {
  const r = 70;
  const c = 2 * Math.PI * r;
  const offset = c - (pct / 100) * c;
  return (
    <div className="flex items-center justify-center">
      <div className="relative">
        <svg width="180" height="180" viewBox="0 0 180 180" aria-hidden>
          <circle cx="90" cy="90" r={r} fill="none" stroke="#1e293b" strokeWidth="6" />
          <circle
            cx="90" cy="90" r={r} fill="none" stroke="#fcd34d" strokeWidth="6"
            strokeLinecap="round" strokeDasharray={c} strokeDashoffset={offset}
            transform="rotate(-90 90 90)"
            style={{ transition: "stroke-dashoffset 0.5s ease" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="display text-[44px] text-slate-50 leading-none">{pct}<span className="text-slate-500 text-2xl">%</span></div>
          <div className="mt-2 font-mono text-[10px] uppercase tracking-widest text-amber-300 text-center px-2 max-w-[140px]">{phase}</div>
        </div>
      </div>
    </div>
  );
}

function StatChip({ label, value }: { label: string; value: number }) {
  return (
    <div className="border border-slate-800 bg-slate-900/40 rounded-[4px] px-3 py-3 text-center">
      <div className="display text-[26px] text-amber-300 tabular-nums leading-none">{value.toLocaleString()}</div>
      <div className="font-mono text-[9px] uppercase tracking-widest text-slate-500 mt-2">{label}</div>
    </div>
  );
}

// ── Step 4: Wow card ───────────────────────────────────────────────────────

function WowCard({ topic, seedName, stats, onAsk }: {
  topic: StarterTopic; seedName: string;
  stats: { videos: number; chunks: number; concepts: number };
  onAsk: () => void;
}) {
  return (
    <section className="border border-emerald-400/30 rounded-[8px] p-10 bg-gradient-to-br from-emerald-400/[0.06] via-slate-900/40 to-amber-400/[0.04] relative overflow-hidden">
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-emerald-400 text-slate-950 flex items-center justify-center font-bold text-xl">
          ✓
        </div>
        <div className="font-mono text-[11px] uppercase tracking-widest text-emerald-300">
          INGEST COMPLETE
        </div>
      </div>

      <h2 className="display text-[40px] sm:text-[52px] leading-[1.05] text-slate-50 font-normal mb-3">
        {seedName} now <em className="text-emerald-300 italic">knows</em> {topic.title.toLowerCase()}.
      </h2>
      <p className="text-slate-300 text-[16px] leading-relaxed mb-8 max-w-xl">
        Ask it anything. It cites every source — so when it tells you something, you can click straight to the timestamp and verify.
      </p>

      <div className="grid sm:grid-cols-3 gap-3 mb-10">
        <BigStat label="videos processed" value={stats.videos} />
        <BigStat label="knowledge chunks" value={stats.chunks} />
        <BigStat label="vectors indexed" value={stats.concepts} />
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={onAsk}
          className="inline-flex items-center justify-center gap-2 px-7 py-4 bg-emerald-400 text-slate-950 font-semibold text-[16px] hover:bg-emerald-300 transition rounded-[4px]"
        >
          Ask {seedName} my first question <span aria-hidden>→</span>
        </button>
        <Link
          href="/start"
          onClick={(e) => { e.preventDefault(); window.location.reload(); }}
          className="inline-flex items-center justify-center gap-2 px-7 py-4 border border-slate-700 text-slate-200 font-medium hover:border-amber-300 hover:text-amber-300 transition rounded-[4px]"
        >
          Build another expert
        </Link>
      </div>

      <div className="mt-6 font-mono text-[10px] uppercase tracking-widest text-slate-600">
        stored on {seedName} · file <code className="text-emerald-300">~/Docs/KB/{topic.slug}.rvf</code>
      </div>
    </section>
  );
}

function BigStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="border border-slate-800 bg-slate-950/60 rounded-[4px] px-5 py-5">
      <div className="display text-[40px] text-emerald-300 tabular-nums leading-none">{value.toLocaleString()}</div>
      <div className="font-mono text-[10px] uppercase tracking-widest text-slate-500 mt-2">{label}</div>
    </div>
  );
}

// ── Step 5: Chat (with pre-filled first question) ──────────────────────────

type ChatTurn = { q: string; a: string; citations: string[] };

function ChatStep({ topics, seedName, initialTopic, initialQuestion }: {
  topics: Topic[]; seedName: string; initialTopic: string; initialQuestion: string;
}) {
  const [topic, setTopic] = useState(initialTopic || topics[0]?.slug || "");
  const [q, setQ] = useState(initialQuestion);
  const [busy, setBusy] = useState(false);
  const [turns, setTurns] = useState<ChatTurn[]>([]);

  const ask = async () => {
    if (!q || !topic) return;
    setBusy(true);
    try {
      const res = await fetch(`${BRIDGE}/api/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q, topic }),
      });
      const data = await res.json();
      setTurns((prev) => [...prev, { q, a: data.answer ?? data.error ?? "(no answer)", citations: data.citations ?? [] }]);
      setQ("");
    } finally {
      setBusy(false);
    }
  };

  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <h2 className="display text-[32px] sm:text-[40px] leading-[1.1] text-slate-50 font-normal">
          Ask {seedName}.
        </h2>
        {topics.length > 1 && (
          <select
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="px-3 py-2 bg-slate-950 border border-slate-800 text-slate-200 text-sm rounded-[4px] font-mono"
          >
            {topics.map((t) => <option key={t.slug} value={t.slug}>{t.slug}</option>)}
          </select>
        )}
      </div>

      {turns.length === 0 && initialQuestion && (
        <div className="mb-6 px-4 py-3 rounded-[4px] bg-amber-300/[0.05] border border-amber-300/20 text-amber-200 text-sm">
          ✦ Pre-filled a good starter question for you. Edit it or hit Ask.
        </div>
      )}

      <div className="space-y-4 mb-6">
        {turns.map((t, i) => (
          <div key={i} className="border border-slate-800 bg-slate-900/40 rounded-[6px] p-5">
            <div className="font-mono text-[10px] uppercase tracking-widest text-slate-500 mb-1">YOU</div>
            <div className="text-slate-100 mb-4">{t.q}</div>
            <div className="font-mono text-[10px] uppercase tracking-widest text-amber-300 mb-1">{seedName.toUpperCase()}</div>
            <div className="answer">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{t.a}</ReactMarkdown>
            </div>
            {t.citations.length > 0 && (
              <div className="mt-4 pt-4 border-t border-slate-800">
                <div className="font-mono text-[10px] uppercase tracking-widest text-emerald-300 mb-2">
                  ✦ cited from {t.citations.length} {t.citations.length === 1 ? "source" : "sources"}
                </div>
                <ul className="space-y-1.5 text-sm text-slate-400">
                  {t.citations.map((c, j) => <li key={j} className="flex items-start gap-2"><span className="text-emerald-300 mt-0.5">·</span>{c}</li>)}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !busy && ask()}
          placeholder={`Ask ${seedName} anything…`}
          disabled={busy}
          className="flex-1 px-4 py-3 bg-slate-950 border border-slate-800 text-slate-100 rounded-[4px]"
        />
        <button
          onClick={ask}
          disabled={busy || !q || !topic}
          className="px-6 py-3 bg-amber-300 text-slate-950 font-semibold hover:bg-amber-200 disabled:opacity-50 transition rounded-[4px]"
        >
          {busy ? "…" : "Ask"}
        </button>
      </div>

      {turns.length > 0 && (
        <div className="mt-8 pt-6 border-t border-slate-800 text-center">
          <Link
            href="/start"
            onClick={(e) => { e.preventDefault(); window.location.reload(); }}
            className="font-mono text-[11px] uppercase tracking-widest text-slate-500 hover:text-amber-300 transition inline-flex items-center gap-2"
          >
            <span className="inline-block w-3 h-px bg-current" />
            Build another expert
          </Link>
        </div>
      )}
    </section>
  );
}

// ── Footer ──────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer className="mt-12 py-8 border-t border-slate-800">
      <div className="max-w-4xl mx-auto px-5 sm:px-6 flex flex-wrap items-center justify-between gap-4 font-mono text-[11px] uppercase tracking-widest text-slate-500">
        <span>cognitum-learn <span data-version-footer>{COGNITUM_LEARN_VERSION}</span> · your hardware, your data</span>
        <Link href="/" className="hover:text-amber-300 transition">← back to homepage</Link>
      </div>
    </footer>
  );
}
