# AGENTS.md — AtBlock / EthOnline

For Cursor and other coding agents working in this repo.

1. Product lock: **AtBlock** — partners **The Graph · Hedera · ENS** only.
2. Never mock Graph data for judges. Fail closed without `GRAPH_API_KEY`.
3. Never commit secrets. `.env` is gitignored; gateway/CLIs auto-load it via `load-env.ts`.
4. Local `memory/` is **gitignored** — keep private handoff notes there if useful; do **not** commit or push them.
5. Facilitator URL: `https://api.testnet.blocky402.com`.
6. Judge path: `npm run pay -w @atblock/gateway` — not demo payment header.
7. Human owns check-ins, credentials, and human-narrated demo video.

Useful entrypoints: `SETUP.md`, `SKILL.md`, `docs/checkin-2.md`, `docs/atblock-judge-qualify-checklist.html`.
