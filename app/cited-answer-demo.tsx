"use client";

import { useState, useEffect } from "react";

type Demo = {
  id: string;
  topicLabel: string;
  rvfFile: string;
  rvfMeta: string;
  question: string;
  answerLatency: string;
  answer: string; // [1] [2] [3] markers inline
  citations: { n: number; ep: string; t: string }[];
};

const DEMOS: Demo[] = [
  {
    id: "longevity",
    topicLabel: "Longevity & circadian",
    rvfFile: "longevity.rvf",
    rvfMeta: "longevity.rvf · 91 h · 14,800 chunks",
    question: "what does Huberman actually say about morning light?",
    answerLatency: "850 ms",
    answer:
      "Get 5–10 minutes of unfiltered outdoor light within the first hour of waking [1]. This anchors your circadian clock, suppresses morning melatonin, and is the single highest-leverage input for both daytime energy and nighttime sleep quality [2]. On overcast days, roughly double the duration to compensate for the reduction in UV and blue-spectrum intensity [3].",
    citations: [
      { n: 1, ep: "Master Your Sleep · Andrew Huberman", t: "12:48" },
      { n: 2, ep: "Huberman Lab Ep. 68 · with Matthew Walker", t: "23:14" },
      { n: 3, ep: "Optimize Morning Routines · Huberman Lab", t: "04:32" },
    ],
  },
  {
    id: "retirement",
    topicLabel: "Retire at 45",
    rvfFile: "earlyretire.rvf",
    rvfMeta: "earlyretire.rvf · 64 h · 9,200 chunks",
    question: "what's a safe withdrawal rate if I retire at 45 instead of 65?",
    answerLatency: "910 ms",
    answer:
      "3.0–3.25%, not 4%. The classic “4% rule” assumes a 30-year horizon; a 45-year retirement nearly doubles that window and exposes you to sequence-of-returns risk in the early years that a Trinity-study horizon never tests [1]. A glidepath strategy — start at 3.0% and ramp toward 4% only after the first decade clears the danger zone — drops Monte Carlo failure probability from ~28% to ~7% [2]. The exact landing depends heavily on the bond/equity split and whether you can earn even modest part-time income in the first 5 years [3].",
    citations: [
      { n: 1, ep: "Big ERN — Safe Withdrawal Rates Part 1", t: "18:42" },
      { n: 2, ep: "Karsten Jeske — Why 4% Fails Early Retirees", t: "09:14" },
      { n: 3, ep: "ChooseFI — Bill Bengen on the 4% Rule", t: "31:08" },
    ],
  },
  {
    id: "theta",
    topicLabel: "Options theta decay",
    rvfFile: "options.rvf",
    rvfMeta: "options.rvf · 48 h · 7,100 chunks",
    question: "is options theta decay linear through the day or front-loaded?",
    answerLatency: "780 ms",
    answer:
      "Front-loaded for short-dated options, near-linear for monthly+ [1]. Roughly 55–65% of a 0-DTE option's total theta burns in the first half of the regular session — the morning hours pay the option seller and punish the buyer disproportionately [2]. The mechanism is gamma: as time-to-expiry collapses, gamma rises with the square root of T, so afternoon moves carry asymmetric P/L. For monthlies held 30+ days out, theta decay is close to linear and the morning-vs-afternoon timing barely matters [3].",
    citations: [
      { n: 1, ep: "tastytrade — Time Decay Across the Day", t: "06:33" },
      { n: 2, ep: "Options Alpha — 0-DTE Mechanics", t: "14:21" },
      { n: 3, ep: "The Random Walker — Theta Curves Explained", t: "22:07" },
    ],
  },
  {
    id: "vietnam",
    topicLabel: "Vietnam travel budget",
    rvfFile: "vietnam.rvf",
    rvfMeta: "vietnam.rvf · 22 h · 3,400 chunks",
    question: "what's a realistic daily budget for Vietnam in mid-range guesthouses?",
    answerLatency: "640 ms",
    answer:
      "$38–$52 USD per day. Lodging $18–$25 (en-suite room in District 3 or Old Quarter — book on Agoda, not Booking, for ~12% lower prices) [1]. Food $9–$13 (street bún chả, phở, cơm tấm plus one mid-tier restaurant dinner). Local transport $3–$6 (Grab bike across the city, GrabCar on long hops). Buffer $5–$8 daily for entry fees, sim cards, and occasional Western meals [2]. Pad another 30% in your first week while you learn the prices — locals will quote you 2× for taxis without it [3].",
    citations: [
      { n: 1, ep: "Nomadic Matt — Vietnam on $40/day", t: "11:18" },
      { n: 2, ep: "Indie Travel Podcast — SE Asia Budget Update", t: "07:42" },
      { n: 3, ep: "Trip100 — Vietnam First-Week Mistakes", t: "04:55" },
    ],
  },
];

function renderAnswer(text: string) {
  return text.split(/(\[\d+\])/g).map((part, i) => {
    if (/^\[\d+\]$/.test(part)) {
      return (
        <span key={i} className="text-amber-300/80 font-mono text-[12px] mx-0.5">
          {part}
        </span>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

export function CitedAnswerDemo() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [thinking, setThinking] = useState(false);
  const [pendingIdx, setPendingIdx] = useState<number | null>(null);

  // Tab switch with 250ms "thinking" pulse — simulates the real retrieval latency
  useEffect(() => {
    if (pendingIdx === null) return;
    const id = setTimeout(() => {
      setActiveIdx(pendingIdx);
      setThinking(false);
      setPendingIdx(null);
    }, 280);
    return () => clearTimeout(id);
  }, [pendingIdx]);

  const handleSwitch = (i: number) => {
    if (i === activeIdx || thinking) return;
    setThinking(true);
    setPendingIdx(i);
  };

  const demo = DEMOS[activeIdx];

  return (
    <section className="border-b border-slate-800 bg-slate-950">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-12 py-24 lg:py-28">
        <div className="grid lg:grid-cols-12 gap-12 items-start">

          {/* LEFT — heading + tabs */}
          <div className="lg:col-span-4">
            <div className="font-mono text-[11px] uppercase tracking-widest text-emerald-300 flex items-center gap-3">
              <span className="inline-block w-4 h-px bg-emerald-300" />
              TRY IT — ANY TOPIC
            </div>
            <h2 className="display mt-5 text-[34px] sm:text-[40px] leading-[1.1] text-slate-50 font-normal">
              Click a topic.<br/>
              See the answer.<br/>
              <em className="cream italic">Click a citation.</em>
            </h2>
            <p className="mt-6 text-slate-400 text-[15px] leading-[1.7]">
              Four knowledge bases the Seed could host at once. Every answer cites the exact second of the source it came from — not a paraphrase, not a summary, the actual moment.
            </p>

            {/* Topic tabs */}
            <ul className="mt-8 space-y-2" role="tablist">
              {DEMOS.map((d, i) => {
                const isActive = i === activeIdx;
                return (
                  <li key={d.id}>
                    <button
                      role="tab"
                      aria-selected={isActive}
                      onClick={() => handleSwitch(i)}
                      className={`group w-full text-left px-4 py-3 rounded-[3px] border transition-all duration-200 ${
                        isActive
                          ? "border-amber-500/40 bg-amber-500/10 text-amber-100"
                          : "border-slate-800 hover:border-slate-700 hover:bg-slate-900/40 text-slate-300 hover:text-slate-100"
                      }`}
                    >
                      <div className={`font-mono text-[10px] uppercase tracking-widest mb-1 ${isActive ? "text-amber-300" : "text-slate-500 group-hover:text-amber-300/70"} transition-colors`}>
                        {d.rvfFile}
                      </div>
                      <div className="text-[14px] leading-snug">{d.topicLabel}</div>
                    </button>
                  </li>
                );
              })}
            </ul>

            <p className="mt-6 font-mono text-[10px] uppercase tracking-widest text-slate-600 leading-relaxed">
              static preview · the live dashboard renders identical structure when you run <span className="text-amber-200">learn ui</span>
            </p>
          </div>

          {/* RIGHT — the answer terminal */}
          <div className="lg:col-span-8">
            <div className="border border-amber-500/20 bg-slate-900/40 rounded-[6px] overflow-hidden shadow-2xl shadow-amber-900/10">

              {/* Chrome bar */}
              <div className="flex items-center justify-between px-4 py-2.5 bg-slate-950 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-slate-700" />
                  <span className="w-2 h-2 rounded-full bg-slate-700" />
                  <span className="w-2 h-2 rounded-full bg-slate-700" />
                </div>
                <div className="font-mono text-[10px] uppercase tracking-widest text-slate-500 transition-opacity duration-200" key={`meta-${demo.id}`}>
                  {demo.rvfMeta}
                </div>
              </div>

              {/* Question */}
              <div
                key={`q-${demo.id}`}
                className={`px-5 py-4 border-b border-slate-800 bg-slate-900/30 transition-opacity duration-200 ${thinking ? "opacity-30" : "opacity-100"}`}
              >
                <div className="font-mono text-[10px] uppercase tracking-widest text-amber-300/70 mb-2">YOU ASKED</div>
                <div className="text-[16px] text-slate-100 leading-[1.5]">
                  &ldquo;{demo.question}&rdquo;
                </div>
              </div>

              {/* Answer */}
              <div
                key={`a-${demo.id}`}
                className={`px-5 py-5 border-b border-slate-800 transition-opacity duration-200 ${thinking ? "opacity-30" : "opacity-100"}`}
              >
                <div className="font-mono text-[10px] uppercase tracking-widest text-emerald-300/80 mb-2 flex items-center gap-3 min-h-[14px]">
                  {thinking ? (
                    <>
                      <span>THINKING…</span>
                      <span className="w-1.5 h-1.5 bg-emerald-400 animate-pulse" />
                    </>
                  ) : (
                    <span>SEED ANSWERED · {demo.answerLatency}</span>
                  )}
                </div>
                <div className="text-[15.5px] text-slate-200 leading-[1.7]">
                  {renderAnswer(demo.answer)}
                </div>
              </div>

              {/* Citations */}
              <div
                key={`c-${demo.id}`}
                className={`px-5 py-4 transition-opacity duration-200 ${thinking ? "opacity-30" : "opacity-100"}`}
              >
                <div className="font-mono text-[10px] uppercase tracking-widest text-slate-500 mb-3">CITATIONS · click any to open at timestamp</div>
                <ol className="space-y-2 text-[13.5px]">
                  {demo.citations.map((c) => (
                    <li
                      key={c.n}
                      className="flex items-baseline gap-3 group cursor-pointer hover:bg-slate-900/50 -mx-2 px-2 py-1 rounded-[2px] transition-colors"
                    >
                      <span className="font-mono text-[12px] text-amber-300/80 flex-none">[{c.n}]</span>
                      <span className="text-slate-300 group-hover:text-amber-300 transition-colors">{c.ep}</span>
                      <span className="ml-auto font-mono text-[11px] text-slate-500 group-hover:text-amber-300/70 flex-none transition-colors">{c.t}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
