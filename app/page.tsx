import Link from "next/link";
import Image from "next/image";
import { LEARN_RV_VERSION } from "./version";

const INSTALL_CMD = "cargo install --git https://github.com/stuinfla/learner-rv learn-cli";

export default function Home() {
  return (
    <main className="min-h-screen text-slate-200">
      <SiteHeader />
      <Hero />
      <Story />
      <BrainVectors />
      <WhileYouSleep />
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
          <span className="font-medium tracking-tight text-slate-100 whitespace-nowrap">learn-rv</span>
          <span className="mono text-[10px] text-slate-500 uppercase tracking-widest whitespace-nowrap" data-version>{LEARN_RV_VERSION}</span>
        </div>
        <nav className="flex items-center gap-4 sm:gap-7 mono text-[11px] sm:text-[12px] uppercase tracking-widest">
          <a href="#brain" className="text-slate-500 hover:text-amber-300 transition hidden md:inline">How it remembers</a>
          <a href="#sleep" className="text-slate-500 hover:text-amber-300 transition hidden md:inline">While you sleep</a>
          <a href="#install" className="text-slate-500 hover:text-amber-300 transition hidden md:inline">Install</a>
          <Link href="/start" className="text-slate-100 hover:text-amber-300 transition whitespace-nowrap">
            <span className="hidden sm:inline">Open dashboard </span><span className="sm:hidden">Start </span><span className="text-amber-300">→</span>
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
      {/* Background image with overlay */}
      <div className="absolute inset-0">
        <Image
          src="/img/hero-desk.png"
          alt=""
          fill
          priority
          className="object-cover opacity-40"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950/95 via-slate-950/75 to-slate-950/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
      </div>

      <div className="relative max-w-[1280px] mx-auto px-6 lg:px-12 pt-24 pb-32 lg:pt-32 lg:pb-40">
        <div className="max-w-3xl">
          <Eyebrow>FOR PEOPLE WHO JUST UNBOXED A COGNITUM SEED</Eyebrow>
          <h1 className="display mt-8 text-[42px] sm:text-[64px] lg:text-[84px] leading-[1.02] tracking-[-0.02em] text-slate-50 font-normal">
            Let&rsquo;s make you an <em className="cream italic" style={{ fontVariationSettings: '"SOFT" 100, "WONK" 1' }}>expert</em> on anything you want.
          </h1>
          <p className="mt-10 text-[18px] leading-[1.65] text-slate-300 max-w-[55ch]">
            Your Seed watches the hours of video so you don&rsquo;t have to. Stores it the way your brain stores knowledge — as <em className="text-amber-300 not-italic">vectors</em>, not files. Hands it back, cited, the moment you ask.
          </p>
          <div className="mt-12 flex flex-wrap gap-3">
            <a href="#brain" className="inline-flex items-center gap-2 px-6 py-3.5 bg-amber-300 text-slate-950 font-medium hover:bg-amber-200 transition rounded-[4px]">
              Show me how it works <span aria-hidden>↓</span>
            </a>
            <Link href="/start" className="inline-flex items-center gap-2 px-6 py-3.5 border border-slate-700 text-slate-100 font-medium hover:border-amber-300 hover:text-amber-300 transition rounded-[4px]">
              I have my Seed — let&rsquo;s start it up <span aria-hidden>→</span>
            </Link>
          </div>
          <div className="mt-16 flex flex-wrap items-center gap-x-5 gap-y-2 mono text-[11px] uppercase tracking-widest text-slate-500">
            <span className="inline-flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-emerald-400 animate-pulse" />
              <span>shipping <span className="text-emerald-300">{LEARN_RV_VERSION}</span></span>
            </span>
            <span className="text-slate-700">·</span>
            <span>nothing leaves your network</span>
            <span className="text-slate-700">·</span>
            <span>your hardware, your data</span>
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
              You can already paste a PDF into ChatGPT.
              <br/>
              <em className="cream italic">This isn&rsquo;t that.</em>
            </h2>
          </div>
          <div className="lg:col-span-7 text-[17px] leading-[1.75] text-slate-300 space-y-5">
            <p>This is the device that can sit on your desk for a year, watch every Stanford lecture, every Andrew Huberman episode, every conference talk in your industry — and remember it the way you wish you could.</p>
            <p>You don&rsquo;t curate a folder of PDFs and dump it into a chat window. You point your Seed at <em className="text-amber-300 not-italic">a topic that matters to you</em> and walk away. It does the watching, the listening, the reading. It builds a personal expert by morning.</p>
            <p>Then it answers — citing the exact timestamp in the exact video — until you know the field better than people who have been working in it for years.</p>
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
              1,024 numbers per moment. Hundreds of thousands per topic. Brain-style recall on a device the size of your wallet.
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
            <div className="mt-8 mono text-[11px] uppercase tracking-widest text-slate-500 flex items-center gap-3">
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
    { axis: "Watches hours of video for you",   notebooklm: false, chatgpt: false, perplexity: false, learnRv: true },
    { axis: "Runs offline",                      notebooklm: false, chatgpt: false, perplexity: false, learnRv: true },
    { axis: "No account required",               notebooklm: false, chatgpt: false, perplexity: false, learnRv: true },
    { axis: "Zero monthly fee",                  notebooklm: false, chatgpt: false, perplexity: false, learnRv: true },
    { axis: "Your KB outlives the vendor",       notebooklm: false, chatgpt: false, perplexity: false, learnRv: true },
    { axis: "Hardware you can hold",             notebooklm: false, chatgpt: false, perplexity: false, learnRv: true },
    { axis: "Cited answers with timestamps",     notebooklm: true,  chatgpt: false, perplexity: true,  learnRv: true },
  ];
  return (
    <section className="py-28 border-b border-slate-800 bg-slate-950">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-12">
        <div className="max-w-3xl">
          <Eyebrow>WHY THIS, NOT THAT</Eyebrow>
          <h2 className="display mt-5 text-[36px] sm:text-[48px] leading-[1.05] text-slate-50 font-normal">
            On the things that actually matter,<br/>
            <em className="cream italic">this is the only product on the chart.</em>
          </h2>
          <p className="mt-6 text-slate-400 text-[17px] leading-[1.7] max-w-2xl">
            Everyone competes on model size and response speed. Nobody competes on whether you can unplug the cord and still keep your knowledge. We do.
          </p>
        </div>

        <div className="mt-14 border border-slate-800 rounded-[4px] overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-900/60 border-b border-slate-800">
                <th className="text-left px-6 py-4 mono text-[11px] uppercase tracking-widest text-slate-500 font-normal">Capability</th>
                <th className="px-4 py-4 mono text-[11px] uppercase tracking-widest text-slate-500 font-normal">NotebookLM</th>
                <th className="px-4 py-4 mono text-[11px] uppercase tracking-widest text-slate-500 font-normal">ChatGPT</th>
                <th className="px-4 py-4 mono text-[11px] uppercase tracking-widest text-slate-500 font-normal">Perplexity</th>
                <th className="px-4 py-4 mono text-[11px] uppercase tracking-widest text-amber-300 font-medium">learn-rv</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={r.axis} className={i % 2 ? "bg-slate-950" : "bg-slate-900/20"}>
                  <td className="px-6 py-4 text-slate-200">{r.axis}</td>
                  <td className="px-4 py-4 text-center"><Mark on={r.notebooklm} /></td>
                  <td className="px-4 py-4 text-center"><Mark on={r.chatgpt} /></td>
                  <td className="px-4 py-4 text-center"><Mark on={r.perplexity} /></td>
                  <td className="px-4 py-4 text-center bg-amber-500/5"><Mark on={r.learnRv} highlight /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-6 mono text-[11px] uppercase tracking-widest text-slate-600 text-right">
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
    <section id="what" className="py-28 border-b border-slate-800">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-12">
        <div className="max-w-3xl">
          <Eyebrow warm>THE HARDWARE</Eyebrow>
          <h2 className="display mt-5 text-[36px] sm:text-[48px] leading-[1.05] text-slate-50 font-normal">
            A matchbox-sized AI appliance<br/>
            that lives on <em className="cream italic">your</em> desk.
          </h2>
        </div>
        <div className="grid lg:grid-cols-12 gap-10 mt-14">
          <div className="lg:col-span-7 text-[16px] leading-[1.75] text-slate-300 space-y-5">
            <p>The Cognitum One Seed is a small Linux device — Raspberry Pi Zero 2W class hardware in a clean enclosure — that runs <span className="mono text-amber-200">cognitum-agent</span>. Inside that agent: RuVector (a vector database, HNSW-indexed) plus a local inference runtime, exposed over your network or via USB.</p>
            <p>Plug it in. Forget it&rsquo;s there. It draws about as much power as a USB-charged toothbrush. It indexes whatever you give it, holds onto it as long as the SD card is alive, and answers cited questions from it whenever you ask.</p>
          </div>
          <div className="lg:col-span-5">
            <dl className="space-y-4 border-l border-amber-300/30 pl-6">
              <SpecRow label="Footprint">~65 × 30 × 12 mm. Smaller than a credit card.</SpecRow>
              <SpecRow label="Storage">Up to 32 GB on microSD. Hundreds of hours of transcribed video.</SpecRow>
              <SpecRow label="Power">~2W typical. USB charger and forget it.</SpecRow>
              <SpecRow label="Networking">WiFi · mDNS discovery · USB gadget mode for travel.</SpecRow>
              <SpecRow label="Open">MCP server for Claude/Cursor. REST API. Rust, Node, Python SDKs.</SpecRow>
            </dl>
            <a href="https://cognitum.one" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 mt-8 mono text-[12px] uppercase tracking-widest text-amber-300 hover:text-amber-200 transition group">
              <span className="inline-block w-4 h-px bg-amber-300 group-hover:w-8 transition-all" />
              Get one at cognitum.one
            </a>
          </div>
        </div>
      </div>
    </section>
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
            <Eyebrow>FIVE MINUTES</Eyebrow>
            <h2 className="display mt-5 text-[36px] sm:text-[48px] leading-[1.05] text-slate-50 font-normal">
              Install once.<br/>
              <em className="cream italic">Run for years.</em>
            </h2>
            <p className="mt-6 text-slate-400 text-[17px] leading-[1.7]">
              <span className="mono text-amber-200">learn-rv</span> is a pure-Rust workspace. You need <a className="text-amber-300 hover:text-amber-200 underline decoration-amber-500/40 underline-offset-2" href="https://rustup.rs" target="_blank" rel="noreferrer">the Rust toolchain</a> on your machine. Pre-built binaries for non-Rust folks are landing soon.
            </p>
            <p className="mt-6 mono text-[11px] uppercase tracking-widest text-slate-600 leading-relaxed">
              compiles in ~3-5 min · installs to ~/.cargo/bin/ · no system packages touched
            </p>
          </div>

          <div className="lg:col-span-7 space-y-4">
            <InstallCard step="1" title="Install Rust (skip if you have it)">
              <CodeLine>curl --proto &apos;=https&apos; --tlsv1.2 -sSf https://sh.rustup.rs | sh</CodeLine>
            </InstallCard>
            <InstallCard step="2" title="Install learn-rv from source">
              <CodeLine>{INSTALL_CMD}</CodeLine>
            </InstallCard>
            <InstallCard step="3" title="Start the local bridge">
              <CodeLine>learn ui</CodeLine>
              <p className="mt-3 text-slate-400 text-[13px] leading-relaxed">
                Opens a browser at <span className="mono text-amber-200">http://127.0.0.1:7878</span>. Scans your network for your Seed automatically. From there, drive everything from <Link href="/start" className="text-amber-300 hover:text-amber-200 underline decoration-amber-500/40 underline-offset-2">this site&rsquo;s dashboard</Link> — it talks to your bridge over localhost, never the cloud.
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
            {items.map((it) => (
              <details key={it.q} className="group border border-slate-800 hover:border-slate-700 bg-slate-900/20 rounded-[4px]">
                <summary className="cursor-pointer p-5 flex items-start justify-between gap-4 text-slate-100 font-medium text-[15px] list-none">
                  <span>{it.q}</span>
                  <span className="mono text-amber-300 transition-transform group-open:rotate-45 text-xl leading-none flex-none">+</span>
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
            Buy a Cognitum Seed
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
          <span className="mono text-[11px] uppercase tracking-widest text-slate-500">
            learn-rv <span data-version-footer>{LEARN_RV_VERSION}</span> · open source
          </span>
        </div>
        <div className="flex items-center gap-6 mono text-[11px] uppercase tracking-widest text-slate-500">
          <a href="https://github.com/stuinfla/learner-rv" className="hover:text-amber-300 transition">GitHub</a>
          <a href="https://cognitum.one" className="hover:text-amber-300 transition">cognitum.one</a>
          <span className="text-slate-700">Built in public</span>
        </div>
      </div>
    </footer>
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
