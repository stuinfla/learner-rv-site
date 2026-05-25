import Link from "next/link";
import Image from "next/image";
import { COGNITUM_LEARN_VERSION } from "./version";
import { CitedAnswerDemo } from "./cited-answer-demo";

const LATEST_RELEASE_URL = "https://github.com/stuinfla/cognitum-learn/releases/latest";
const CARGO_INSTALL_CMD = "cargo install --git https://github.com/stuinfla/cognitum-learn learn-cli";
const BREW_DEPS_CMD = "brew install yt-dlp ffmpeg";
const APT_DEPS_CMD = "sudo apt install yt-dlp ffmpeg";

export default function Home() {
  return (
    <main className="min-h-screen text-slate-200">
      <SiteHeader />
      <Hero />
      <LiveWalkthrough />
      <DataFlow />
      <CitedAnswerDemo />
      <WhileYouSleep />
      <BrainVectors />
      <Story />
      <SovereigntyPanel />
      <SeedHardware />
      <Install />
      <FAQ />
      <MondayMorning />
      <SiteFooter />
    </main>
  );
}

// ── Site Header ────────────────────────────────────────────────────────────

function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 backdrop-blur bg-slate-950/80 border-b border-slate-800">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-12 h-16 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <BrandMark className="w-7 h-7 flex-none" />
          <span className="font-medium tracking-tight text-slate-100 whitespace-nowrap">cognitum-learn</span>
          <span className="mono text-[10px] text-slate-400 uppercase tracking-widest whitespace-nowrap" data-version>{COGNITUM_LEARN_VERSION}</span>
        </div>
        <nav className="flex items-center gap-4 sm:gap-7 mono text-[11px] sm:text-[12px] uppercase tracking-widest">
          <a href="#brain" className="text-slate-500 hover:text-amber-300 transition hidden md:inline">How it remembers</a>
          <a href="#sleep" className="text-slate-500 hover:text-amber-300 transition hidden md:inline">While you sleep</a>
          <a href="#install" className="text-slate-500 hover:text-amber-300 transition hidden md:inline">Install</a>
          <Link href="/start" className="text-slate-100 hover:text-amber-300 transition whitespace-nowrap">
            <span className="hidden sm:inline">See it in action </span><span className="sm:hidden">Demo </span><span className="text-amber-300">→</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}

function BrandMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 28 28" className={className} aria-hidden>
      <circle cx="14" cy="14" r="11" fill="none" stroke="#fcd34d" strokeWidth="1.2" opacity="0.4" />
      <circle cx="14" cy="14" r="6" fill="none" stroke="#38bdf8" strokeWidth="1.2" />
      <circle cx="14" cy="14" r="2" fill="#fb923c" />
      <line x1="14" y1="3" x2="14" y2="6" stroke="#fcd34d" strokeWidth="1" opacity="0.5" />
      <line x1="14" y1="22" x2="14" y2="25" stroke="#fcd34d" strokeWidth="1" opacity="0.5" />
      <line x1="3" y1="14" x2="6" y2="14" stroke="#fcd34d" strokeWidth="1" opacity="0.5" />
      <line x1="22" y1="14" x2="25" y2="14" stroke="#fcd34d" strokeWidth="1" opacity="0.5" />
    </svg>
  );
}

// ── Hero ───────────────────────────────────────────────────────────────────

function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-slate-800">
      {/* Atmospheric backdrop — hero-desk.png at low opacity, single fade overlay */}
      <div className="absolute inset-0 pointer-events-none">
        <Image
          src="/img/hero-desk.png"
          alt=""
          fill
          loading="lazy"
          className="object-cover opacity-[0.18]"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-slate-950/20" />
      </div>

      <div className="relative max-w-[1280px] mx-auto px-5 sm:px-6 lg:px-12 pt-10 pb-20 lg:pt-20 lg:pb-28">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">

          {/* IMAGE first on mobile (order-1), second on desktop (lg:order-2) — the actual v0 Appliance product */}
          <div className="lg:col-span-7 order-1 lg:order-2">
            <figure className="relative">
              <div className="relative aspect-[4/3] sm:aspect-[3/2] lg:aspect-[4/3] rounded-[8px] overflow-hidden border border-amber-500/25 shadow-2xl shadow-amber-900/40 ring-1 ring-inset ring-amber-300/10">
                <Image
                  src="/img/seed-box.webp"
                  alt="The Cognitum One Seed — a flat matte-black appliance with the COGNITUM wordmark on top, sitting on a MacBook keyboard for scale."
                  fill
                  priority
                  fetchPriority="high"
                  className="object-cover"
                  sizes="(min-width: 1024px) 56vw, (min-width: 640px) 90vw, 92vw"
                />

                {/* Top-right "now shipping" pill */}
                <div className="absolute top-4 right-4 inline-flex items-center gap-2 bg-slate-950/85 backdrop-blur border border-emerald-500/30 px-2.5 py-1 rounded-[3px]">
                  <span className="w-1.5 h-1.5 bg-emerald-400 animate-pulse" />
                  <span className="mono text-[10px] uppercase tracking-widest text-emerald-300">Cognitum One Seed · now shipping</span>
                </div>

                {/* Floating mono label overlay — anchors what they're looking at */}
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent">
                  <div className="mono text-[10px] uppercase tracking-widest text-amber-200 flex items-center gap-2">
                    <span className="inline-block w-3 h-px bg-amber-300/70" />
                    Cognitum One Seed · sized to live next to your machine
                  </div>
                </div>
              </div>
            </figure>
          </div>

          {/* COPY second on mobile (order-2), first on desktop (lg:order-1) — slightly narrower */}
          <div className="lg:col-span-5 order-2 lg:order-1">
            <Eyebrow>VIDEOS → CITED ANSWERS · ON YOUR HARDWARE</Eyebrow>
            <h1 className="display mt-5 text-[32px] sm:text-[40px] lg:text-[52px] leading-[1.05] tracking-[-0.02em] text-slate-50 font-normal">
              Turn any topic into an in-house <em className="cream italic" style={{ fontVariationSettings: '"SOFT" 100, "WONK" 1' }}>expert</em> you can ask anything.
            </h1>
            <p className="mt-7 text-[17px] leading-[1.65] text-slate-300 max-w-[52ch]">
              Point it at a YouTube channel, a podcast feed, a stack of PDFs. It watches every minute, transcribes every word, and turns it into a searchable knowledge base — answering your questions with <em className="text-amber-300 not-italic">citations back to the exact second in the exact source</em>. No cloud. No subscription. Your knowledge, on your hardware.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#walkthrough" className="inline-flex items-center gap-2 px-6 py-3.5 bg-amber-300 text-slate-950 font-medium hover:bg-amber-200 transition rounded-[4px]">
                See what runs <span aria-hidden>↓</span>
              </a>
              <Link href="/start" className="inline-flex items-center gap-2 px-6 py-3.5 border border-slate-700 text-slate-100 font-medium hover:border-amber-300 hover:text-amber-300 transition rounded-[4px]">
                Try the demo <span aria-hidden>→</span>
              </Link>
            </div>
            <div className="mt-10 flex flex-wrap items-center gap-x-5 gap-y-2 mono text-[11px] uppercase tracking-widest text-slate-400">
              <span className="inline-flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-emerald-400 animate-pulse" />
                <span>shipping <span className="text-emerald-300">{COGNITUM_LEARN_VERSION}</span></span>
              </span>
              <span className="text-slate-700">·</span>
              <span>pairs with the <a href="#hardware" className="text-amber-300/80 hover:text-amber-300 underline decoration-amber-500/30 underline-offset-2">Cognitum One Seed</a></span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Story (the elevator) ───────────────────────────────────────────────────

function Story() {
  return (
    <section className="border-b border-slate-800">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-12 py-24">
        <div className="grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-5">
            <Eyebrow warm>THE PITCH</Eyebrow>
            <h2 className="display mt-5 text-[34px] sm:text-[44px] leading-[1.05] font-normal text-slate-50">
              ChatGPT can read a PDF.
              <br/>
              <em className="cream italic">That&rsquo;s not what this is for.</em>
            </h2>
          </div>
          <div className="lg:col-span-7 text-[17px] leading-[1.75] text-slate-300 space-y-5">
            <p>This is for the topics where the answer lives across <em className="text-amber-300 not-italic">five different experts and forty hours of YouTube</em>. Retirement planning at 45. Day trading with AI to beat the retail average. Building a 10kW DIY solar install. Six weeks across Southeast Asia under $4k.</p>
            <p>The kind of question where you&rsquo;d need to watch a dozen long videos, take notes, cross-reference what disagrees, and remember it months later. Your Seed does that. It does the watching, the synthesizing, and the remembering — so you do the thinking.</p>
            <p>Then it answers — citing the exact timestamp in the exact video — until you know the field better than the people who&rsquo;ve been selling courses about it.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Brain / Vectors ────────────────────────────────────────────────────────

function BrainVectors() {
  return (
    <section id="brain" className="border-b border-slate-800 bg-slate-950">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-12 py-28">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 lg:order-2">
            <div className="relative aspect-[3/2] rounded-[6px] overflow-hidden border border-slate-800">
              <Image
                src="/img/brain-vectors.png"
                alt="A charcoal-pencil brain on one side, a glowing vector grid on the other, bridged by an arc of warm light."
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 50vw, 100vw"
              />
            </div>
          </div>
          <div className="lg:col-span-6 lg:order-1">
            <Eyebrow>HOW IT REMEMBERS</Eyebrow>
            <h2 className="display mt-5 text-[36px] sm:text-[52px] leading-[1.05] text-slate-50 font-normal">
              It remembers the way <em className="cream italic">your</em> brain does.
            </h2>
            <div className="mt-8 space-y-5 text-[17px] leading-[1.75] text-slate-300">
              <p>Your brain doesn&rsquo;t store an MP4 of every lecture you&rsquo;ve ever attended. It stores <em className="text-amber-300 not-italic">meaning</em>. Patterns. The exact moment the speaker said the thing that made the rest of the talk make sense.</p>
              <p>Your Seed does the same. Every minute of video becomes a few thousand small mathematical fingerprints — <em className="text-amber-300 not-italic">vectors</em> — that hold &ldquo;this is the part about preserving wild salmon runs&rdquo; or &ldquo;this is where she finally explains options theta decay.&rdquo;</p>
              <p>Ask the Seed anything later. The right fingerprints light up in milliseconds. You get the answer with timestamps you can click through and verify.</p>
            </div>
            <blockquote className="display mt-10 text-[20px] sm:text-[24px] italic leading-[1.4] text-amber-200 border-l-2 border-amber-300 pl-5">
              384 numbers per moment. Hundreds of thousands per topic. Brain-style recall on a device the size of your wallet.
            </blockquote>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── While you sleep ────────────────────────────────────────────────────────

function WhileYouSleep() {
  const timeline = [
    { t: "9:14 pm", body: "You paste @AndrewHuberman's YouTube channel into the dashboard and close your laptop." },
    { t: "11:47 pm", body: "Seed has fetched 38 episodes — about 91 hours of audio." },
    { t: "2:14 am", body: "Every word transcribed locally. Every speaker labeled. Every chapter found." },
    { t: "3:22 am", body: "14,800 vector chunks indexed in HNSW. Searchable in 12 ms." },
    { t: "7:00 am", body: <>You pour coffee. You ask: <span className="text-amber-300">&ldquo;what does Huberman actually say about morning light?&rdquo;</span> Answer in 850 ms with six cited timestamps you can click through.</> },
  ];
  return (
    <section id="sleep" className="border-b border-slate-800">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-12 py-28">
        <div className="grid lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-5">
            <Eyebrow warm>WHILE YOU SLEEP</Eyebrow>
            <h2 className="display mt-5 text-[36px] sm:text-[52px] leading-[1.05] text-slate-50 font-normal">
              You went to bed.<br/>
              <em className="cream italic">Your Seed went to work.</em>
            </h2>
            <p className="mt-8 text-[17px] leading-[1.7] text-slate-400">
              It does the watching. You wake up the expert. The whole reason you bought the device — autonomous research, on hardware that doesn&rsquo;t need permission from a vendor.
            </p>
            <div className="relative aspect-[3/2] mt-10 rounded-[6px] overflow-hidden border border-slate-800">
              <Image
                src="/img/night-study.png"
                alt="A bedside table at 3 AM with a small AI device beside an analog clock, soft cyan LED pulsing."
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 40vw, 100vw"
              />
            </div>
          </div>
          <div className="lg:col-span-7">
            <ol className="space-y-0">
              {timeline.map((step, i) => (
                <li key={step.t} className="grid grid-cols-[88px_1fr] gap-6 py-5 border-t border-slate-800 first:border-t-0">
                  <div className="mono text-[11px] uppercase tracking-widest text-amber-300 pt-1">{step.t}</div>
                  <div className="text-[16px] leading-[1.65] text-slate-200">{step.body}</div>
                  {i === timeline.length - 1 && null}
                </li>
              ))}
            </ol>
            <div className="mt-8 mono text-[11px] uppercase tracking-widest text-slate-400 flex items-center gap-3">
              <span className="inline-block w-4 h-px bg-slate-700" />
              one example. swap in any channel, any podcast feed, any documentary library.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Sovereignty Panel ─────────────────────────────────────────────────────

function SovereigntyPanel() {
  const rows = [
    { axis: "Watches hours of video for you",   notebooklm: false, chatgpt: false, perplexity: false, cognitumLearn: true },
    { axis: "Cited answers with timestamps",     notebooklm: true,  chatgpt: false, perplexity: true,  cognitumLearn: true },
    { axis: "Live web search / fresh data",      notebooklm: false, chatgpt: true,  perplexity: true,  cognitumLearn: false },
    { axis: "Multimodal output (images, code)",  notebooklm: false, chatgpt: true,  perplexity: false, cognitumLearn: false },
    { axis: "Runs offline",                      notebooklm: false, chatgpt: false, perplexity: false, cognitumLearn: true },
    { axis: "No account required",               notebooklm: false, chatgpt: false, perplexity: false, cognitumLearn: true },
    { axis: "Zero monthly fee",                  notebooklm: false, chatgpt: false, perplexity: false, cognitumLearn: true },
    { axis: "Your KB outlives the vendor",       notebooklm: false, chatgpt: false, perplexity: false, cognitumLearn: true },
    { axis: "Hardware you can hold",             notebooklm: false, chatgpt: false, perplexity: false, cognitumLearn: true },
  ];
  return (
    <section className="py-28 border-b border-slate-800 bg-slate-950">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-12">
        <div className="max-w-3xl">
          <Eyebrow>WHERE EACH ONE WINS</Eyebrow>
          <h2 className="display mt-5 text-[36px] sm:text-[48px] leading-[1.05] text-slate-50 font-normal">
            ChatGPT wins some rows. Perplexity wins others.<br/>
            <em className="cream italic">The rows that matter most? Only one column ticks.</em>
          </h2>
          <p className="mt-6 text-slate-400 text-[17px] leading-[1.7] max-w-2xl">
            We didn&rsquo;t cherry-pick. Live web search and multimodal output go to the cloud incumbents and we&rsquo;re glad those exist. On sovereignty, durability, and zero ongoing cost — that&rsquo;s where the asymmetry shows up.
          </p>
        </div>

        <div
          className="mt-14 border border-slate-800 rounded-[4px] overflow-x-auto -mx-2 sm:mx-0"
          tabIndex={0}
          role="region"
          aria-label="Capability comparison: Cognitum Learn vs NotebookLM, ChatGPT, and Perplexity"
        >
          <table className="w-full text-sm min-w-[640px]">
            <thead>
              <tr className="bg-slate-900/60 border-b border-slate-800">
                <th className="text-left px-6 py-4 mono text-[11px] uppercase tracking-widest text-slate-400 font-normal">Capability</th>
                <th className="px-4 py-4 mono text-[11px] uppercase tracking-widest text-slate-400 font-normal">NotebookLM</th>
                <th className="px-4 py-4 mono text-[11px] uppercase tracking-widest text-slate-400 font-normal">ChatGPT</th>
                <th className="px-4 py-4 mono text-[11px] uppercase tracking-widest text-slate-400 font-normal">Perplexity</th>
                <th className="px-4 py-4 mono text-[11px] uppercase tracking-widest text-amber-300 font-medium">cognitum-learn</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={r.axis} className={`${i % 2 ? "bg-slate-950" : "bg-slate-900/20"} hover:bg-slate-900/60 transition-colors`}>
                  <td className="px-6 py-4 text-slate-200">{r.axis}</td>
                  <td className="px-4 py-4 text-center"><Mark on={r.notebooklm} /></td>
                  <td className="px-4 py-4 text-center"><Mark on={r.chatgpt} /></td>
                  <td className="px-4 py-4 text-center"><Mark on={r.perplexity} /></td>
                  <td className="px-4 py-4 text-center bg-amber-500/5"><Mark on={r.cognitumLearn} highlight /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-6 mono text-[11px] uppercase tracking-widest text-slate-400 text-right">
          capabilities change · sovereignty does not
        </p>
      </div>
    </section>
  );
}

function Mark({ on, highlight = false }: { on: boolean; highlight?: boolean }) {
  if (on) return (
    <svg className={`w-4 h-4 mx-auto ${highlight ? "text-amber-300" : "text-emerald-400"}`} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
  return <span className="text-slate-700">—</span>;
}

// ── Seed Hardware (condensed) ─────────────────────────────────────────────

function SeedHardware() {
  return (
    <section id="hardware" className="py-28 border-b border-slate-800">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-12">

        {/* — Current product: v0 Appliance — */}
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          {/* LEFT: real v0 Appliance photo */}
          <div className="lg:col-span-5">
            <div className="relative aspect-[4/3] rounded-[6px] overflow-hidden border border-slate-800 bg-gradient-to-b from-slate-900 to-slate-950">
              <Image
                src="/img/seed-on-mac.webp"
                alt="The Cognitum One Seed photographed front-facing — flat matte-black enclosure with the live LED matrix display visible across the front face, sitting atop a Mac mini."
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 40vw, 100vw"
              />
            </div>
            <div className="mt-4 mono text-[10px] uppercase tracking-widest text-emerald-300/80 text-center flex items-center justify-center gap-2">
              <span className="w-1.5 h-1.5 bg-emerald-400 animate-pulse" />
              Cognitum One Seed · shipping now
            </div>
          </div>

          {/* RIGHT: copy + specs */}
          <div className="lg:col-span-7">
            <Eyebrow warm>THE HARDWARE</Eyebrow>
            <h2 className="display mt-5 text-[36px] sm:text-[48px] leading-[1.05] text-slate-50 font-normal">
              A palm-sized appliance with a<br/>
              <em className="cream italic">live LED matrix on the front.</em>
            </h2>
            <div className="mt-6 text-[16px] leading-[1.75] text-slate-300 space-y-4">
              <p>The Cognitum One Seed is a small Linux device running <span className="mono text-amber-200">cognitum-agent</span>: a vector database (RuVector, HNSW-indexed) plus local inference, exposed over your network or via USB.</p>
              <p>The LED matrix on the front face shows ingest progress, query activity, and Seed status — you can <em className="text-amber-300 not-italic">see</em> when it&rsquo;s working. Plug it in, point it at your sources, watch it light up.</p>
            </div>
            <dl className="mt-8 space-y-3 border-l border-amber-300/30 pl-6">
              <SpecRow label="Footprint">Palm-sized, flat horizontal enclosure. Lives quietly on a bookshelf.</SpecRow>
              <SpecRow label="Display">Live LED matrix — ingest progress, query activity, Seed status.</SpecRow>
              <SpecRow label="Storage">microSD. Hundreds of hours of transcribed video per card.</SpecRow>
              <SpecRow label="Power">USB-powered. Sips current. Run it 24/7 and forget about it.</SpecRow>
              <SpecRow label="Networking">WiFi · mDNS discovery · USB gadget mode for travel.</SpecRow>
              <SpecRow label="Open">MCP server for Claude/Cursor. REST API. Rust, Node, Python SDKs.</SpecRow>
            </dl>
            <a href="https://cognitum.one" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 mt-8 mono text-[12px] uppercase tracking-widest text-amber-300 hover:text-amber-200 transition group">
              <span className="inline-block w-4 h-px bg-amber-300 group-hover:w-8 transition-all" />
              Get a v0 Appliance at cognitum.one
            </a>
          </div>
        </div>

        {/* — Coming next: v1 Appliance — */}
        <SeedTwoPreview />

      </div>
    </section>
  );
}

function SeedTwoPreview() {
  return (
    <div className="mt-24 pt-16 border-t border-slate-800">
      <div className="grid lg:grid-cols-12 gap-10 items-start">
        {/* LEFT: copy */}
        <div className="lg:col-span-5">
          <div className="inline-flex items-center gap-2 mono text-[11px] uppercase tracking-widest text-amber-300/90 border border-amber-500/30 bg-amber-500/5 px-3 py-1.5 rounded-[3px]">
            <span className="w-1.5 h-1.5 bg-amber-400" />
            coming next · next-generation Seed
          </div>
          <h3 className="display mt-5 text-[26px] sm:text-[32px] leading-[1.15] text-slate-50 font-normal">
            More compute. More storage.<br/>
            <em className="cream italic">More ports for everything.</em>
          </h3>
          <div className="mt-5 text-[15px] leading-[1.7] text-slate-400 space-y-3">
            <p>The next-generation Cognitum One Seed steps up to a faceted matte-black enclosure with a full back-panel of I/O — gigabit Ethernet, USB-A 3.0, microSD, dedicated power. Same software stack as your Seed, larger headroom for bigger knowledge bases and faster local inference.</p>
            <p>If you&rsquo;re evaluating for a corner-of-the-desk install where ports matter, this is the one to wait for.</p>
          </div>
          <a href="https://cognitum.one" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 mt-6 mono text-[11px] uppercase tracking-widest text-amber-300/80 hover:text-amber-300 transition group">
            <span className="inline-block w-3 h-px bg-amber-300/60 group-hover:w-6 transition-all" />
            Get notified at cognitum.one
          </a>
        </div>

        {/* RIGHT: two images */}
        <div className="lg:col-span-7 grid grid-cols-2 gap-3">
          <div className="relative aspect-square rounded-[6px] overflow-hidden border border-slate-800 bg-slate-900">
            <Image
              src="/img/seed-two-preview.png"
              alt="Cognitum One Seed — next-gen — top-down view of a matte-black enclosure with a faceted geometric top surface and the 'cognitum' wordmark on the front face."
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 30vw, 50vw"
            />
            <div className="absolute bottom-0 left-0 right-0 p-2.5 bg-gradient-to-t from-slate-950/95 to-transparent">
              <div className="mono text-[9px] uppercase tracking-widest text-amber-200/80">faceted top · cognitum wordmark</div>
            </div>
          </div>
          <div className="relative aspect-square rounded-[6px] overflow-hidden border border-slate-800 bg-slate-900">
            <Image
              src="/img/seed-two-ports.png"
              alt="next Cognitum Appliance back-panel detail showing Ethernet RJ45, two USB-A 3.0 ports, microSD slot, and power input."
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 30vw, 50vw"
            />
            <div className="absolute bottom-0 left-0 right-0 p-2.5 bg-gradient-to-t from-slate-950/95 to-transparent">
              <div className="mono text-[9px] uppercase tracking-widest text-amber-200/80">ethernet · 2× USB 3.0 · microSD · power</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SpecRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[110px_1fr] gap-6 items-baseline">
      <dt className="mono text-[11px] uppercase tracking-widest text-amber-300/80">{label}</dt>
      <dd className="text-slate-300 text-[15px] leading-[1.6]">{children}</dd>
    </div>
  );
}

// ── Install ───────────────────────────────────────────────────────────────

function Install() {
  return (
    <section id="install" className="py-28 border-b border-slate-800 bg-slate-950">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-5">
            <Eyebrow>THREE MINUTES</Eyebrow>
            <h2 className="display mt-5 text-[36px] sm:text-[48px] leading-[1.05] text-slate-50 font-normal">
              Install once.<br/>
              <em className="cream italic">Run for years.</em>
            </h2>
            <div className="mt-6 inline-flex items-center gap-2 mono text-[11px] uppercase tracking-widest text-emerald-300/90 border border-emerald-500/30 bg-emerald-500/5 px-3 py-1.5 rounded-[3px]">
              <span className="w-1.5 h-1.5 bg-emerald-400" />
              prebuilt binaries · macOS · Linux · Windows
            </div>
            <p className="mt-5 text-slate-400 text-[17px] leading-[1.7]">
              <span className="mono text-amber-200">cognitum-learn</span> is a single self-contained binary. Download for your platform, install two system tools, and you&rsquo;re running the local dashboard in three minutes — no Rust toolchain required.
            </p>
            <p className="mt-6 mono text-[11px] uppercase tracking-widest text-slate-400 leading-relaxed">
              binary ~17 MB · launches at 127.0.0.1:7878 · zero cloud
            </p>
          </div>

          <div className="lg:col-span-7 space-y-4">
            <InstallCard step="1" title="Install cognitum-learn">
              <p className="mb-3 text-slate-400 text-[13px] leading-relaxed">
                If you have Rust installed, one command — cargo fetches everything from GitHub. No clone, no path-tweaks.
              </p>
              <CodeLine>{CARGO_INSTALL_CMD}</CodeLine>
              <p className="mt-3 mono text-[11px] text-slate-500 leading-relaxed">
                No Rust? <a href={LATEST_RELEASE_URL} target="_blank" rel="noreferrer" className="text-amber-300 hover:text-amber-200 underline decoration-amber-500/40 underline-offset-2">Download a prebuilt binary</a> for macOS · Linux x86_64 · Linux aarch64 · Windows.
              </p>
            </InstallCard>
            <InstallCard step="2" title="Install yt-dlp + ffmpeg">
              <CodeLine>{BREW_DEPS_CMD}</CodeLine>
              <p className="mt-3 mono text-[11px] text-slate-500 leading-relaxed">
                on Linux: <span className="text-slate-300">{APT_DEPS_CMD}</span>
              </p>
            </InstallCard>
            <InstallCard step="3" title="Start the local dashboard">
              <CodeLine>learn doctor && learn ui</CodeLine>
              <p className="mt-3 text-slate-400 text-[13px] leading-relaxed">
                <span className="mono text-amber-200">learn doctor</span> verifies the deps and auto-downloads the embedding model (~130 MB, one-time). <span className="mono text-amber-200">learn ui</span> opens the dashboard at <span className="mono text-amber-200">http://127.0.0.1:7878/visual</span> — paste a YouTube URL or just say what you want to learn.
              </p>
            </InstallCard>
          </div>
        </div>
      </div>
    </section>
  );
}

function InstallCard({ step, title, children }: { step: string; title: string; children: React.ReactNode }) {
  return (
    <div className="border border-slate-800 bg-slate-900/30 p-5 rounded-[4px]">
      <div className="flex items-center gap-3 mb-3">
        <span className="mono text-[11px] text-amber-300 border border-amber-500/30 px-1.5 py-0.5 rounded-[2px]">{step}</span>
        <h3 className="text-[15px] font-semibold text-slate-100">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function CodeLine({ children }: { children: string }) {
  return (
    <div className="mono text-[13px] text-amber-200 bg-slate-950 border border-slate-800 px-4 py-3 rounded-[4px] overflow-x-auto whitespace-pre">
      <span className="text-slate-600 select-none">$ </span>{children}
    </div>
  );
}

// ── FAQ ───────────────────────────────────────────────────────────────────

function FAQ() {
  const items = [
    {
      q: "Can I really build an expert on anything?",
      a: <>If you can point <span className="mono text-amber-200">yt-dlp</span> at it, your Seed can learn it. YouTube channels, playlists, podcast RSS feeds, recorded lectures, local <span className="mono">.mp4 / .mkv</span> files. The more focused the topic, the more uncanny the result.</>
    },
    {
      q: "How is this different from feeding ChatGPT a PDF?",
      a: <>You can&rsquo;t ask ChatGPT to watch 91 hours of Huberman overnight and stay within the context window. You can&rsquo;t ask it to remember the answer next week. You can&rsquo;t take the knowledge with you when OpenAI changes their pricing. Your Seed does all three.</>
    },
    {
      q: "Does this need internet?",
      a: <>To ingest: yes — to fetch videos and run captioning. To query your Seed afterward: no. Set <span className="mono text-amber-200">LEARN_SYNTH_LOCAL=1</span> and answer synthesis runs entirely on your hardware too.</>
    },
    {
      q: "How does this page talk to my Seed?",
      a: <>It doesn&rsquo;t — directly. Browsers can&rsquo;t reach <span className="mono">169.254.x.x</span> from an HTTPS page (mixed-content blocking). This page&rsquo;s JavaScript talks to <span className="mono">127.0.0.1:7878</span> on <em className="text-amber-300 not-italic">your</em> machine (browsers exempt localhost). That bridge talks to your Seed. Vercel serves bytes; your content never crosses the public internet.</>
    },
    {
      q: "What if I don&rsquo;t have a Seed yet?",
      a: <>The CLI works standalone — your KB lives as a <span className="mono">.rvf</span> file on your laptop. Without a Seed you lose the always-on, sips-power, plug-and-share device. <a className="text-amber-300 hover:underline" href="https://cognitum.one">Get one →</a></>
    },
    {
      q: "What does it cost?",
      a: "The CLI and this dashboard are open source under PolyForm Noncommercial. The Cognitum One hardware is sold by cognitum.one. There is no recurring fee, ever."
    },
  ];
  return (
    <section className="py-28 border-b border-slate-800">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-4">
            <Eyebrow>HONEST ANSWERS</Eyebrow>
            <h2 className="display mt-5 text-[36px] leading-[1.05] text-slate-50 font-normal">
              The <em className="cream italic">obvious</em> questions.
            </h2>
            <p className="mt-5 text-slate-400 text-[15px] leading-[1.65]">No fluff. Click any.</p>
          </div>
          <div className="lg:col-span-8 space-y-3">
            {items.map((it, idx) => (
              <details key={it.q} open={idx < 2} className="group border border-slate-800 hover:border-slate-700 bg-slate-900/20 rounded-[4px]">
                <summary className="cursor-pointer p-5 flex items-start justify-between gap-4 text-slate-100 font-medium text-[15px] list-none">
                  <span>{it.q}</span>
                  <span className="mono text-amber-300 transition-transform duration-300 ease-out group-open:rotate-45 text-xl leading-none flex-none">+</span>
                </summary>
                <div className="px-5 pb-5 text-slate-400 text-[14px] leading-[1.75] border-t border-slate-800 pt-4">{it.a}</div>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Monday Morning closer ─────────────────────────────────────────────────

function MondayMorning() {
  return (
    <section className="relative overflow-hidden border-b border-slate-800">
      <div className="absolute inset-0">
        <Image
          src="/img/morning-expert.png"
          alt=""
          fill
          className="object-cover opacity-35"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/85 to-slate-950/40" />
      </div>
      <div className="relative max-w-[1280px] mx-auto px-6 lg:px-12 py-32 text-center">
        <Eyebrow>MONDAY MORNING</Eyebrow>
        <h2 className="display mt-6 text-[40px] sm:text-[56px] lg:text-[72px] leading-[1.04] text-slate-50 font-normal max-w-4xl mx-auto">
          This is what Monday morning<br/>
          <em className="cream italic">looks like</em> now.
        </h2>
        <p className="mt-8 text-slate-300 text-[17px] leading-[1.7] max-w-2xl mx-auto">
          You unbox your Seed. You point it at the channels and feeds and lectures you&rsquo;ve been meaning to get to for a year. It works while you sleep. You wake up the world&rsquo;s foremost authority — on the things that matter to <em className="text-amber-300 not-italic">you</em>.
        </p>
        <div className="mt-12 flex flex-wrap justify-center gap-3">
          <Link href="/start" className="inline-flex items-center gap-2 px-7 py-3.5 bg-amber-300 text-slate-950 font-semibold hover:bg-amber-200 transition rounded-[4px]">
            Open the dashboard <span aria-hidden>→</span>
          </Link>
          <a href="https://cognitum.one" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-7 py-3.5 border border-amber-500 text-amber-300 font-semibold hover:bg-amber-500 hover:text-slate-950 transition rounded-[4px]">
            Get the Cognitum One Seed
          </a>
        </div>
      </div>
    </section>
  );
}

// ── Footer ────────────────────────────────────────────────────────────────

function SiteFooter() {
  return (
    <footer className="py-12 bg-slate-950">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-12 flex flex-wrap items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <BrandMark className="w-5 h-5" />
          <span className="mono text-[11px] uppercase tracking-widest text-slate-400">
            cognitum-learn <span data-version-footer>{COGNITUM_LEARN_VERSION}</span> · open source
          </span>
        </div>
        <div className="flex items-center gap-6 mono text-[11px] uppercase tracking-widest text-slate-400">
          <a href="https://github.com/stuinfla/cognitum-learn" className="hover:text-amber-300 transition">GitHub</a>
          <a href="https://cognitum.one" className="hover:text-amber-300 transition">cognitum.one</a>
          <span className="text-slate-400">Built in public</span>
        </div>
      </div>
    </footer>
  );
}

// ── Live walkthrough (the four canonical commands) ────────────────────────

function LiveWalkthrough() {
  const cards = [
    {
      cmd: "learn doctor",
      title: "Verify the setup",
      blurb: "Checks the Rust toolchain, ffmpeg, yt-dlp, your Anthropic key, and whether a Seed is reachable on the network on the network.",
      mock: [
        "✓ Rust 1.87.0",
        "✓ ffmpeg 7.1",
        "✓ yt-dlp 2026.05",
        "✓ ANTHROPIC_API_KEY",
        "✓ Seed @ 192.168.1.42 (1.2 ms)",
      ],
    },
    {
      cmd: "learn study \"longevity\"",
      title: "Find + watch the experts",
      blurb: "Discovers top channels for your topic, downloads, transcribes, chunks, embeds — locally — and writes one .rvf file.",
      mock: [
        "→ discovered 4 channels · 38 videos",
        "→ downloading · 91h 14m of audio",
        "→ transcribing (Whisper.cpp on-device)",
        "→ embedding 14,800 chunks · BGE-small",
        "✓ longevity.rvf  (47 MB)  6m 12s",
      ],
    },
    {
      cmd: "learn ask longevity \"<question>\"",
      title: "Ask, with citations",
      blurb: "HyDE expansion → hybrid retrieve (dense + BM25) → cross-encoder rerank → MMR diversity → cited synthesis.",
      mock: [
        "Q: \"how does morning light affect sleep?\"",
        "  retrieving · 6 chunks · 12 ms",
        "  synthesizing · 850 ms",
        "  citations: [1] [2] [3]  ←  timestamps",
        "✓ answer ready  (click to expand below)",
      ],
    },
    {
      cmd: "learn push longevity",
      title: "Push it to your Seed",
      blurb: "Transfers the .rvf to the Cognitum One Seed. From then on, the Seed answers your questions, on-device, even offline.",
      mock: [
        "→ packaging longevity.rvf (47 MB)",
        "→ pushing to Cognitum @ 192.168.1.42",
        "✓ Seed now serving longevity",
        "  query it via MCP, REST, or the dashboard",
      ],
    },
  ];

  return (
    <section id="walkthrough" className="border-b border-slate-800">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-12 py-24 lg:py-28">
        <div className="grid lg:grid-cols-12 gap-12 items-end mb-12">
          <div className="lg:col-span-7">
            <Eyebrow warm>HERE&rsquo;S WHAT ACTUALLY RUNS</Eyebrow>
            <h2 className="display mt-5 text-[34px] sm:text-[44px] leading-[1.05] text-slate-50 font-normal">
              Four commands.<br/>
              <em className="cream italic">A working knowledge base in 6 minutes.</em>
            </h2>
          </div>
          <div className="lg:col-span-5 text-[15px] leading-[1.7] text-slate-400">
            <p>
              No GUI to learn, no account to create. Each card below is one of the four commands the binary prints when you run it. Top to bottom is the full path from empty disk to a Seed answering questions.
            </p>
          </div>
        </div>

        {/* Pipeline SVG strip — the 4-step header (light-themed asset on a dark card to soften) */}
        <div className="mb-10 rounded-[6px] overflow-hidden border border-slate-800 bg-slate-50/[0.02] p-4">
          <img
            src="/svg/quickstart.svg"
            alt="Four-step pipeline: download, study, ask, push."
            className="w-full h-auto"
            loading="lazy"
          />
        </div>

        <ol className="grid lg:grid-cols-2 gap-4 lg:gap-6">
          {cards.map((c, i) => (
            <li
              key={c.cmd}
              className="group border border-slate-800 hover:border-amber-500/30 bg-slate-900/30 hover:bg-slate-900/50 rounded-[6px] p-5 lg:p-6 transition-colors duration-200"
            >
              <div className="flex items-baseline gap-3 mb-3">
                <span className="mono text-[10px] text-amber-300 border border-amber-500/30 px-1.5 py-0.5 rounded-[2px] group-hover:bg-amber-500/10 transition-colors">{`STEP ${i + 1}`}</span>
                <h3 className="text-[15px] sm:text-[16px] font-semibold text-slate-100">{c.title}</h3>
              </div>
              <div className="mono text-[13px] text-amber-200 bg-slate-950 border border-slate-800 group-hover:border-amber-500/20 px-4 py-3 rounded-[4px] overflow-x-auto whitespace-pre transition-colors">
                <span className="text-slate-600 select-none">$ </span>{c.cmd}
                <span aria-hidden className="inline-block w-[7px] h-[14px] bg-amber-300/80 align-middle ml-1 animate-pulse" />
              </div>
              <p className="mt-3 text-slate-400 text-[13.5px] leading-[1.65]">{c.blurb}</p>
              <pre className="mt-3 mono text-[12px] leading-[1.7] text-slate-400 bg-slate-950/60 border border-slate-900 px-3 py-2.5 rounded-[3px] overflow-x-auto">
{c.mock.join("\n")}
              </pre>
            </li>
          ))}
        </ol>

        <p className="mt-8 mono text-[11px] uppercase tracking-widest text-slate-400">
          terminal output above is illustrative · real numbers vary by topic
        </p>
      </div>
    </section>
  );
}

// ── Data Flow (the pipeline, told as a story) ─────────────────────────────

function DataFlow() {
  const stages = [
    {
      num: "01",
      name: "Discover",
      where: "mac",
      blurb: "Cognitum finds the best videos on your topic and ranks them for you.",
      detail:
        "On `learn study`, it asks Claude to curate the top channels for your topic, then orders individual videos by signal-to-noise. Skip with `learn ingest` if you already have URLs.",
    },
    {
      num: "02",
      name: "Acquire & Read",
      where: "mac",
      blurb: "Each video is downloaded; captions are pulled straight from the source.",
      detail:
        "yt-dlp pulls the audio + caption tracks. If captions are missing, falls back to Whisper.cpp (Metal-accelerated on M-series) for local transcription. No cloud round-trip for the audio.",
    },
    {
      num: "03",
      name: "Watch",
      where: "mac",
      conditional: true,
      blurb: "When the video is visual — slides, demos, diagrams — it watches the picture too.",
      detail:
        "Perceptual-hash variance auto-decides per video. ffmpeg extracts keyframes; Claude Sonnet vision captions them. Skipped for talking-heads to save tokens.",
    },
    {
      num: "04",
      name: "Understand",
      where: "mac",
      blurb: "Every moment becomes a 384-dim fingerprint, anchored to its exact timestamp.",
      detail:
        "Sentence-aware chunking with stable SHA-256 claim IDs, then BGE-small-en-v1.5 (384-dim ONNX) on Metal. ~50 ms per chunk. The vectors are how questions find their answers.",
    },
    {
      num: "05",
      name: "Seal",
      where: "mac",
      blurb: "Everything is written into one signed .rvf file you own — proof attached to every claim.",
      detail:
        "Append-only binary: HNSW vector index + content-addressable chunks + Ed25519 witness chain. Open with the rvf CLI or @ruvector/rvf in Node. Survives the vendor.",
      hasRvfDef: true,
    },
    {
      num: "06",
      name: "Deliver to Seed",
      where: "seed",
      blurb: "The finished expert lands on your Cognitum One Seed — answering offline, forever.",
      detail:
        "mDNS discovers your Seed on the local network; vectors push over HTTP. The Seed stores them in its own RVF store and serves queries via MCP, REST, or the dashboard. Your Mac can power off — the Seed stays live.",
    },
  ];

  return (
    <section id="dataflow" className="border-b border-slate-800 bg-slate-950">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-12 py-24 lg:py-28">
        {/* Section header */}
        <div className="grid lg:grid-cols-12 gap-10 items-end mb-12 lg:mb-14">
          <div className="lg:col-span-7">
            <Eyebrow warm>FROM A VIDEO TO YOUR SEED</Eyebrow>
            <h2 className="display mt-5 text-[34px] sm:text-[44px] leading-[1.05] text-slate-50 font-normal">
              Six stages.<br/>
              <em className="cream italic">Two devices. One destination.</em>
            </h2>
          </div>
          <div className="lg:col-span-5 text-[15px] leading-[1.7] text-slate-400">
            <p>
              Your Mac does the temporary work — downloading, watching, learning. Your <span className="text-emerald-300">Cognitum One Seed</span> gets the permanent result: one signed file that holds the whole knowledge base, ready to answer questions on-device, offline, forever.
            </p>
          </div>
        </div>

        {/* Compute-zone labels above the pipeline (desktop only) */}
        <div className="hidden lg:grid grid-cols-6 gap-2 mb-3">
          <div className="col-span-5 mono text-[10px] uppercase tracking-widest text-slate-400 flex items-center gap-2">
            <span className="inline-block w-3 h-px bg-slate-600" />
            on your Mac · temporary workspace
          </div>
          <div className="col-span-1 mono text-[10px] uppercase tracking-widest text-emerald-300 flex items-center gap-2">
            <span className="inline-block w-3 h-px bg-emerald-400/60" />
            on your Seed
          </div>
        </div>

        {/* The pipeline */}
        <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 lg:gap-2.5 relative">
          {stages.map((stage, i) => (
            <li
              key={stage.num}
              className={`group relative rounded-[6px] border p-4 lg:p-5 transition-colors duration-200 ${
                stage.where === "seed"
                  ? "border-emerald-500/40 bg-emerald-500/[0.05] hover:bg-emerald-500/[0.08]"
                  : "border-slate-800 bg-slate-900/30 hover:border-amber-500/30 hover:bg-slate-900/50"
              }`}
            >
              {/* Pulse connector — desktop only, between cards */}
              {i < stages.length - 1 && (
                <div
                  aria-hidden
                  className="hidden lg:flex absolute top-1/2 -translate-y-1/2 -right-[7px] z-10 items-center justify-center"
                >
                  <span className="block w-2.5 h-2.5 rounded-full bg-amber-300/80 animate-pulse" />
                </div>
              )}

              <div className={`mono text-[10px] uppercase tracking-widest mb-2 flex items-center justify-between ${
                stage.where === "seed" ? "text-emerald-300" : "text-amber-300/80"
              }`}>
                <span>{stage.num}</span>
                {stage.conditional && (
                  <span className="text-slate-500" title="auto-decided per video">· auto</span>
                )}
              </div>

              <h3 className="text-[15.5px] sm:text-[16px] font-semibold text-slate-50 mb-2 leading-tight">
                {stage.name}
              </h3>

              <p className="text-[13px] leading-[1.55] text-slate-300">
                {stage.blurb}
              </p>

              {/* .rvf inline definition box (Stage 5 only) */}
              {stage.hasRvfDef && (
                <div className="mt-3 border border-amber-500/25 bg-amber-500/[0.06] rounded-[3px] px-2.5 py-2">
                  <div className="mono text-[10px] uppercase tracking-widest text-amber-300 mb-0.5">
                    .rvf
                  </div>
                  <div className="text-[11.5px] leading-[1.4] text-amber-100/80">
                    RuVector File. One signed binary. Your whole knowledge base.
                  </div>
                </div>
              )}

              {/* Click to reveal nerd detail */}
              <details className="mt-3 group/d">
                <summary className="list-none cursor-pointer mono text-[10px] uppercase tracking-widest text-slate-400 hover:text-amber-300 transition-colors flex items-center gap-2 select-none">
                  <span className="text-amber-300 transition-transform duration-200 group-open/d:rotate-45 text-base leading-none">+</span>
                  how it actually runs
                </summary>
                <p className="mt-2 text-[12px] leading-[1.55] text-slate-400 border-t border-slate-800 pt-2">
                  {stage.detail}
                </p>
              </details>
            </li>
          ))}
        </ol>

        {/* Footnote */}
        <p className="mt-10 mono text-[11px] uppercase tracking-widest text-slate-400 flex items-center gap-2">
          <span className="inline-block w-3 h-px bg-slate-600" />
          two compute locations · your Mac builds it · your Seed keeps it
        </p>
      </div>
    </section>
  );
}

// ── Building blocks ───────────────────────────────────────────────────────

function Eyebrow({ children, warm = false }: { children: React.ReactNode; warm?: boolean }) {
  return (
    <div className={`mono text-[11px] uppercase tracking-widest ${warm ? "text-amber-300" : "text-emerald-300"} flex items-center gap-3`}>
      <span className={`inline-block w-4 h-px ${warm ? "bg-amber-300" : "bg-emerald-300"}`} />
      {children}
    </div>
  );
}
