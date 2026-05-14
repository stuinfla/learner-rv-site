const LEARN_RV_VERSION = "v0.2.14";

const FEATURES = [
  {
    title: "Pure-Rust pipeline",
    body: "BGE-large embeddings, HNSW + BM25 hybrid retrieval, MMR diversity, Blake3-chained witness ledger. Zero Python in the hot path.",
  },
  {
    title: "Per-topic .rvf stores",
    body: "Every topic is one binary file under ~/Docs/KB/. Append-only, content-addressed, replayable. No server, no Docker, no daemons.",
  },
  {
    title: "Cited answers, always",
    body: "Every learn ask response cites the source video and timestamp. No hallucinated quotes. Local synthesis via LEARN_SYNTH_LOCAL=1 for full sovereignty.",
  },
  {
    title: "Cognitum One ready",
    body: "learn push streams your KB into a paired Cognitum Seed over USB or LAN — using the Seed's native JSON ingest contract.",
  },
];

const SOURCES = [
  "YouTube video URLs",
  "Playlists & channels (@handle)",
  "ytsearch:<query> top-N",
  "Local .mp4 / .mkv / .webm",
  "PDFs (URL or local)",
  "Podcast RSS feeds",
  "Web articles",
];

export default function Page() {
  return (
    <main className="min-h-screen">
      <section className="px-6 pt-24 pb-20 max-w-5xl mx-auto">
        <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-sky-400 mb-6">
          <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
          <span>open-source · pure rust · local-first</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-bold leading-[1.05] tracking-tight">
          Watch a video.<br />
          <span className="text-sky-400">Own the knowledge.</span>
        </h1>
        <p className="mt-8 text-xl text-slate-300 max-w-2xl leading-relaxed">
          <code className="text-sky-300">learn-rv</code> turns any video source into a
          queryable knowledge base, stored locally as a single{" "}
          <code className="text-sky-300">.rvf</code> file. Ask cited questions, run
          spaced-repetition quizzes, and push your KB into your{" "}
          <a
            href="https://cognitum.one"
            className="underline decoration-orange-400 underline-offset-4 hover:text-orange-400"
          >
            Cognitum One Seed
          </a>{" "}
          when you&rsquo;re ready to leave the cloud.
        </p>

        <div className="mt-12 rounded-lg bg-slate-900 border border-slate-800 p-5 font-mono text-sm">
          <div className="text-slate-500 mb-2"># install</div>
          <div className="text-sky-300">$ cargo install learn-rs</div>
          <div className="text-slate-500 mt-4 mb-2">
            # ingest a Harvard pitch playlist, push to your Seed
          </div>
          <div className="text-sky-300">
            $ learn ingest https://youtube.com/playlist?list=... --topic harvard-pitches
          </div>
          <div className="text-sky-300">
            $ learn push harvard-pitches --seed 169.254.42.1 --token $LEARN_SEED_TOKEN
          </div>
        </div>

        <div className="mt-10 flex flex-wrap gap-3">
          <a
            href="https://github.com/stuinfla/learner-rv"
            className="px-5 py-3 rounded-md bg-sky-500 text-slate-950 font-semibold hover:bg-sky-400 transition"
          >
            GitHub →
          </a>
          <a
            href="https://github.com/stuinfla/learner-rv/releases/latest"
            className="px-5 py-3 rounded-md border border-slate-700 hover:border-sky-400 transition"
          >
            Download {LEARN_RV_VERSION}
          </a>
          <a
            href="https://cognitum.one"
            className="px-5 py-3 rounded-md border border-orange-500 text-orange-400 hover:bg-orange-500 hover:text-slate-950 transition"
          >
            Buy a Cognitum Seed
          </a>
        </div>
      </section>

      <section className="px-6 py-20 bg-slate-900/50 border-y border-slate-800">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold mb-3">Built for owning your knowledge</h2>
          <p className="text-slate-400 mb-12 max-w-2xl">
            Most RAG tools ship to the cloud, depend on a hosted API, and lock your
            vectors behind someone else&rsquo;s schema. <code>learn-rv</code> is the
            opposite: it&rsquo;s a CLI that produces files you own.
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="rounded-lg bg-slate-950/60 border border-slate-800 p-6"
              >
                <h3 className="text-lg font-semibold text-sky-300 mb-2">{f.title}</h3>
                <p className="text-slate-300 leading-relaxed">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-20 max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold mb-3">Every source you&rsquo;d throw at it</h2>
        <p className="text-slate-400 mb-8">
          One ingest pipeline, many input shapes. Frame extraction is{" "}
          <em>auto</em> by default — visual demos get keyframes, talking heads stay
          captions-only.
        </p>
        <div className="flex flex-wrap gap-2">
          {SOURCES.map((s) => (
            <span
              key={s}
              className="px-4 py-2 rounded-md bg-slate-900 border border-slate-800 text-sm text-slate-300"
            >
              {s}
            </span>
          ))}
        </div>
      </section>

      <section className="px-6 py-20 bg-slate-900/50 border-y border-slate-800">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold mb-3">
            For Cognitum One Seed owners
          </h2>
          <p className="text-slate-400 mb-8 max-w-2xl">
            <code>learn-rv {LEARN_RV_VERSION}</code> speaks the Cognitum Seed&rsquo;s
            published JSON ingest contract. Connect your Seed via USB, pair this
            client, and a single command lands your topic on the device.
          </p>
          <pre className="rounded-lg bg-slate-950 border border-slate-800 p-5 text-sm overflow-x-auto">
            <code className="text-slate-300">
{`# 1. Pair this client with your Seed (one-time)
curl -X POST http://169.254.42.1/api/v1/pair/window
curl -X POST http://169.254.42.1/api/v1/pair \\
  -d '{"client_name":"my-laptop"}'
# → save the returned token to LEARN_SEED_TOKEN

# 2. Push any topic
learn push <topic> --seed 169.254.42.1 --token $LEARN_SEED_TOKEN

# Output:
#   pushing 118 vectors (1024-dim) to 169.254.42.1…
#   batch 40: ingested 1 vectors (118/118)
#   ✓ pushed 118 vectors (1024-dim)`}
            </code>
          </pre>
        </div>
      </section>

      <footer className="px-6 py-12 text-center text-sm text-slate-500">
        <p>
          <code>learn-rv</code> <span data-version>{LEARN_RV_VERSION}</span> ·{" "}
          <a className="hover:text-sky-400" href="https://github.com/stuinfla/learner-rv">
            github.com/stuinfla/learner-rv
          </a>
        </p>
        <p className="mt-2">
          Built for the{" "}
          <a className="hover:text-orange-400" href="https://cognitum.one">
            Cognitum One
          </a>{" "}
          ecosystem.
        </p>
      </footer>
    </main>
  );
}
