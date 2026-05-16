# learner-rv-site

The hosted GUI for [`learn-rv`](https://github.com/stuinfla/learner-rv) — the pure-Rust
video knowledge-base CLI that pairs with a [Cognitum One Seed](https://cognitum.one).

## How it works

The page talks to a local bridge (the `learn ui` Axum server) over `http://127.0.0.1:7878`.

```
[Vercel HTTPS page]  ──fetch──▶  [learn ui bridge on localhost]  ──▶  [Cognitum Seed]
```

Browsers exempt `localhost` from mixed-content blocking, so an HTTPS Vercel origin can
talk to an HTTP localhost endpoint. The bridge proxies all Seed traffic (mDNS discovery,
pairing, ingest, push, ask) so the browser never has to reach the Seed directly.

## User flow

1. `cargo install learn-rs`
2. `learn ui` — starts the bridge + opens the local copy of this same GUI
3. Or open `https://learner-rv-site.vercel.app` from any device on the same machine and
   the page will detect the bridge and walk you through Seed pairing → topic ingest →
   chat.

## Dev

```bash
npm install
npm run dev    # local at http://localhost:3000
npm run build  # production build (auto-run by Vercel on push)
```

Bump `LEARN_RV_VERSION` in `app/page.tsx` after each `learn-rs` release.
