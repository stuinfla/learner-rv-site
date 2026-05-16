"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const LEARN_RV_VERSION = "v0.2.15";
const BRIDGE = "http://127.0.0.1:7878";

type BridgeState = "checking" | "offline" | "online";
type Step = "seed" | "topic" | "ingest" | "chat";
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

export default function Page() {
  const [bridge, setBridge] = useState<BridgeState>("checking");
  const [status, setStatus] = useState<Status | null>(null);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [step, setStep] = useState<Step>("seed");

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
      if (s.seed.connected) setStep((p) => (p === "seed" ? "topic" : p));
    } catch {
      setBridge("offline");
    }
  }, []);

  useEffect(() => {
    probe();
    const id = setInterval(probe, 5000);
    return () => clearInterval(id);
  }, [probe]);

  return (
    <main className="min-h-screen px-6 py-10 max-w-3xl mx-auto">
      <Header bridge={bridge} status={status} />
      {bridge === "offline" && <Offline />}
      {bridge === "online" && status && (
        <>
          <Stepper step={step} setStep={setStep} hasTopics={topics.length > 0} seedReady={status.seed.connected} />
          {step === "seed" && <SeedStep status={status} onSaved={probe} />}
          {step === "topic" && <TopicStep topics={topics} onPick={() => setStep("chat")} onNew={() => setStep("ingest")} />}
          {step === "ingest" && <IngestStep onDone={() => { probe(); setStep("chat"); }} />}
          {step === "chat" && <ChatStep topics={topics} />}
        </>
      )}
      <Footer />
    </main>
  );
}

function Header({ bridge, status }: { bridge: BridgeState; status: Status | null }) {
  const dot = bridge === "online" ? "bg-emerald-400" : bridge === "offline" ? "bg-rose-400" : "bg-slate-500 animate-pulse";
  const label = bridge === "online" ? `bridge online · ${status?.model ?? ""}` : bridge === "offline" ? "bridge offline — start `learn ui`" : "checking bridge…";
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">
          learn-rv <span className="text-slate-500 font-mono text-sm">{LEARN_RV_VERSION}</span>
        </h1>
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span className={`w-2 h-2 rounded-full ${dot}`} />
          {label}
        </div>
      </div>
      <p className="text-slate-400 mt-1">Watch a video. Own the knowledge. Push it to your Cognitum Seed.</p>
    </div>
  );
}

function Offline() {
  return (
    <section className="rounded-lg border border-slate-800 bg-slate-900/60 p-6">
      <h2 className="text-lg font-semibold text-rose-400 mb-2">Local bridge not detected</h2>
      <p className="text-slate-300 mb-4">
        This GUI talks to the <code className="text-sky-300">learn-rv</code> CLI running on your
        machine. Install once, then start the bridge:
      </p>
      <pre className="rounded-md bg-slate-950 border border-slate-800 p-4 font-mono text-sm text-sky-300 overflow-x-auto">
        <code>{`# install
cargo install learn-rs

# start the local bridge
learn ui`}</code>
      </pre>
      <p className="text-slate-500 text-xs mt-4">
        The bridge runs at <code>127.0.0.1:7878</code>. This page polls it every 5 seconds.
      </p>
    </section>
  );
}

function Stepper({ step, setStep, hasTopics, seedReady }: { step: Step; setStep: (s: Step) => void; hasTopics: boolean; seedReady: boolean }) {
  const steps: { id: Step; label: string; enabled: boolean }[] = [
    { id: "seed", label: "1 · Seed", enabled: true },
    { id: "topic", label: "2 · Topic", enabled: seedReady },
    { id: "ingest", label: "3 · Ingest", enabled: seedReady },
    { id: "chat", label: "4 · Chat", enabled: hasTopics },
  ];
  return (
    <nav className="flex gap-2 mb-6 text-sm">
      {steps.map((s) => (
        <button
          key={s.id}
          disabled={!s.enabled}
          onClick={() => setStep(s.id)}
          className={`px-3 py-1.5 rounded-md border transition ${
            step === s.id
              ? "border-sky-400 text-sky-300 bg-sky-500/10"
              : s.enabled
                ? "border-slate-800 text-slate-400 hover:border-slate-600"
                : "border-slate-900 text-slate-700 cursor-not-allowed"
          }`}
        >
          {s.label}
        </button>
      ))}
    </nav>
  );
}

function SeedStep({ status, onSaved }: { status: Status; onSaved: () => void }) {
  const [found, setFound] = useState<string[] | null>(null);
  const [scanning, setScanning] = useState(false);
  const [manual, setManual] = useState(status.seed.ip ?? "");
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const scan = async () => {
    setScanning(true);
    setErr(null);
    try {
      const res = await fetch(`${BRIDGE}/api/seed/discover`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ timeout_secs: 4 }),
      });
      const data = await res.json();
      setFound(data.found ?? []);
    } catch (e: unknown) {
      setErr((e as Error).message);
    } finally {
      setScanning(false);
    }
  };

  const save = async (address: string) => {
    setSaving(true);
    setErr(null);
    try {
      const res = await fetch(`${BRIDGE}/api/seed/configure`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address, auto_push: true }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      onSaved();
    } catch (e: unknown) {
      setErr((e as Error).message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="rounded-lg border border-slate-800 bg-slate-900/60 p-6 space-y-4">
      <h2 className="text-xl font-semibold">Find your Cognitum Seed</h2>
      <p className="text-slate-400 text-sm">
        Your Seed broadcasts <code>_cognitum._tcp.local.</code> over mDNS. Scan now, or paste an IP if
        you connected via USB (typically <code>169.254.42.1</code>).
      </p>

      {status.seed.ip && (
        <div className="rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 px-3 py-2 text-sm">
          Configured: <code>{status.seed.ip}</code> · {status.seed.connected ? "reachable ✓" : "unreachable ✗"}
        </div>
      )}

      <div className="flex gap-2">
        <button
          onClick={scan}
          disabled={scanning}
          className="px-4 py-2 rounded-md bg-sky-500 text-slate-950 font-medium hover:bg-sky-400 disabled:opacity-50"
        >
          {scanning ? "Scanning…" : "Scan network"}
        </button>
        <input
          value={manual}
          onChange={(e) => setManual(e.target.value)}
          placeholder="or enter IP (e.g. 169.254.42.1)"
          className="flex-1 px-3 py-2 rounded-md bg-slate-950 border border-slate-800 text-slate-200 font-mono text-sm"
        />
        <button
          onClick={() => manual && save(manual)}
          disabled={saving || !manual}
          className="px-4 py-2 rounded-md border border-slate-700 hover:border-sky-400 disabled:opacity-50"
        >
          {saving ? "Saving…" : "Use this"}
        </button>
      </div>

      {found && (
        <div className="space-y-2">
          {found.length === 0 && <p className="text-slate-500 text-sm">No Seeds found. Plug in via USB or paste the IP manually.</p>}
          {found.map((ip) => (
            <button
              key={ip}
              onClick={() => save(ip)}
              className="block w-full text-left rounded-md border border-slate-800 hover:border-sky-400 bg-slate-950 px-4 py-3 transition"
            >
              <div className="font-mono text-sky-300">{ip}</div>
              <div className="text-xs text-slate-500">Click to pair</div>
            </button>
          ))}
        </div>
      )}

      {err && <div className="text-rose-400 text-sm">{err}</div>}
    </section>
  );
}

function TopicStep({ topics, onPick, onNew }: { topics: Topic[]; onPick: () => void; onNew: () => void }) {
  return (
    <section className="rounded-lg border border-slate-800 bg-slate-900/60 p-6 space-y-4">
      <h2 className="text-xl font-semibold">What do you want to be an expert at?</h2>
      <p className="text-slate-400 text-sm">
        Pick an existing topic to keep building on it, or start a new one. Each topic is one
        <code className="mx-1">.rvf</code> file under <code>~/Docs/KB/</code>.
      </p>

      <button
        onClick={onNew}
        className="w-full rounded-md bg-sky-500 text-slate-950 font-medium px-4 py-3 hover:bg-sky-400 transition"
      >
        + Start a new topic
      </button>

      {topics.length > 0 && (
        <div className="space-y-2 pt-2">
          <div className="text-xs uppercase tracking-wider text-slate-500">Existing topics</div>
          {topics.map((t) => (
            <button
              key={t.slug}
              onClick={onPick}
              className="block w-full text-left rounded-md border border-slate-800 hover:border-sky-400 bg-slate-950 px-4 py-3 transition"
            >
              <div className="flex items-center justify-between">
                <code className="text-sky-300">{t.slug}</code>
                <span className="text-xs text-slate-500">{t.video_count} videos · {t.chunks} chunks</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </section>
  );
}

function IngestStep({ onDone }: { onDone: (slug: string) => void }) {
  const [source, setSource] = useState("");
  const [topic, setTopic] = useState("");
  const [running, setRunning] = useState(false);
  const [events, setEvents] = useState<Progress[]>([]);
  const [pct, setPct] = useState(0);
  const esRef = useRef<EventSource | null>(null);

  const start = () => {
    if (!source || !topic) return;
    setRunning(true);
    setEvents([]);
    setPct(0);
    const slug = topic.trim().toLowerCase().replace(/\s+/g, "-");
    const url = `${BRIDGE}/api/ingest/progress?source=${encodeURIComponent(source)}&topic=${encodeURIComponent(slug)}`;
    const es = new EventSource(url);
    esRef.current = es;
    es.onmessage = (evt) => {
      try {
        const data: Progress = JSON.parse(evt.data);
        setEvents((prev) => [...prev, data]);
        setPct(data.progress);
        if (data.done) {
          es.close();
          setRunning(false);
          setTimeout(() => onDone(slug), 1500);
        }
      } catch {}
    };
    es.onerror = () => { es.close(); setRunning(false); };
  };

  useEffect(() => () => esRef.current?.close(), []);

  return (
    <section className="rounded-lg border border-slate-800 bg-slate-900/60 p-6 space-y-4">
      <h2 className="text-xl font-semibold">Pull down the knowledge</h2>
      <input
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        placeholder="Topic name (e.g. harvard-pitches)"
        disabled={running}
        className="w-full px-3 py-2 rounded-md bg-slate-950 border border-slate-800 text-slate-200"
      />
      <input
        value={source}
        onChange={(e) => setSource(e.target.value)}
        placeholder="YouTube URL, playlist, channel, RSS, PDF, or ytsearch:query"
        disabled={running}
        className="w-full px-3 py-2 rounded-md bg-slate-950 border border-slate-800 text-slate-200 font-mono text-sm"
      />
      <button
        onClick={start}
        disabled={running || !source || !topic}
        className="px-4 py-2 rounded-md bg-sky-500 text-slate-950 font-medium hover:bg-sky-400 disabled:opacity-50"
      >
        {running ? "Ingesting…" : "Start ingest"}
      </button>

      {(running || events.length > 0) && (
        <>
          <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden">
            <div className="h-full bg-sky-400 transition-all" style={{ width: `${pct}%` }} />
          </div>
          <div className="rounded-md bg-slate-950 border border-slate-800 p-3 max-h-64 overflow-y-auto font-mono text-xs space-y-1">
            {events.map((e, i) => (
              <div key={i} className={
                e.level === "warn" ? "text-amber-400" :
                e.level === "success" ? "text-emerald-400" :
                e.level === "active" ? "text-sky-300" : "text-slate-400"
              }>{e.message}</div>
            ))}
          </div>
        </>
      )}
    </section>
  );
}

type ChatTurn = { q: string; a: string; citations: string[] };

function ChatStep({ topics }: { topics: Topic[] }) {
  const [topic, setTopic] = useState(topics[0]?.slug ?? "");
  const [q, setQ] = useState("");
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
    <section className="rounded-lg border border-slate-800 bg-slate-900/60 p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Ask your knowledge base</h2>
        <select
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          className="px-3 py-1.5 rounded-md bg-slate-950 border border-slate-800 text-slate-200 text-sm"
        >
          {topics.map((t) => <option key={t.slug} value={t.slug}>{t.slug}</option>)}
        </select>
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {turns.map((t, i) => (
          <div key={i} className="rounded-md bg-slate-950 border border-slate-800 p-3">
            <div className="text-slate-500 text-xs mb-1">You</div>
            <div className="text-slate-200 mb-3">{t.q}</div>
            <div className="text-sky-300 text-xs mb-1">learn-rv</div>
            <div className="text-slate-300 whitespace-pre-wrap">{t.a}</div>
            {t.citations.length > 0 && (
              <ul className="mt-3 text-xs text-slate-500 space-y-1">
                {t.citations.map((c, j) => <li key={j}>· {c}</li>)}
              </ul>
            )}
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !busy && ask()}
          placeholder="Ask anything from this topic…"
          disabled={busy}
          className="flex-1 px-3 py-2 rounded-md bg-slate-950 border border-slate-800 text-slate-200"
        />
        <button
          onClick={ask}
          disabled={busy || !q || !topic}
          className="px-4 py-2 rounded-md bg-sky-500 text-slate-950 font-medium hover:bg-sky-400 disabled:opacity-50"
        >
          {busy ? "…" : "Ask"}
        </button>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="mt-12 pt-6 border-t border-slate-900 text-xs text-slate-500 flex flex-wrap justify-between gap-2">
      <span>
        <code>learn-rv</code> <span data-version>{LEARN_RV_VERSION}</span> ·{" "}
        <a className="hover:text-sky-400" href="https://github.com/stuinfla/learner-rv">github.com/stuinfla/learner-rv</a>
      </span>
      <a className="hover:text-orange-400" href="https://cognitum.one">Built for Cognitum One →</a>
    </footer>
  );
}
