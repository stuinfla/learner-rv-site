# learner-rv-site

Marketing + docs landing page for [`learn-rv`](https://github.com/stuinfla/learner-rv) — the pure-Rust video knowledge-base CLI.

Deployed to Vercel. The footer version stamp tracks the latest `learn-rv` release; bump `LEARN_RV_VERSION` in `app/page.tsx` after each `learn-rs` release and the deploy carries the new number through.

```bash
npm install
npm run dev    # local at http://localhost:3000
npm run build  # production build (auto-run by Vercel on push)
```
