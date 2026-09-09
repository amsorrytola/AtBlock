# AGENTS.md — AtBlock / EthOnline

For Cursor and other coding agents working in this repo.

1. Read `memory/CURRENT.md` first, then `memory/state/next-actions.md` + `memory/state/blockers.md`.
2. Product lock: **AtBlock** — partners **The Graph · Hedera · ENS** only (ADR 0002).
3. Never mock Graph data for judges. Fail closed without `GRAPH_API_KEY`.
4. Never commit secrets. `.env` is gitignored; gateway/CLIs auto-load it via `load-env.ts`.
5. Update `memory/` every meaningful turn (ADR 0003).
6. Facilitator URL: `https://api.testnet.blocky402.com`.
7. Judge path: `npm run pay -w @atblock/gateway` — not demo payment header.
8. Human owns check-ins, credentials, and human-narrated demo video.

Useful entrypoints: `SETUP.md`, `SKILL.md`, `memory/topics/sponsor-surface.md`, `memory/topics/demo-script.md`.
