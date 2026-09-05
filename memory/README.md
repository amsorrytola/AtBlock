# Project Memory

Living, modular context for EthOnline. Any agent (or human) should be able to resume from **anywhere** by reading this folder first.

## How to use (agents)

1. **Always start here:** read [`CURRENT.md`](./CURRENT.md) — status, last stop, next actions.
2. **Then skim:** [`INDEX.md`](./INDEX.md) for the map of all modules.
3. **Deep-dive only what you need:** `state/`, `topics/`, `decisions/`, latest `sessions/`.
4. **Before ending a turn of meaningful work:** update memory (see protocol below).

Do **not** dump everything into one file. Prefer small, linked modules that grow over time.

## Layout

```
memory/
├── README.md          ← you are here (protocol + layout)
├── CURRENT.md         ← single source of truth: where we left off
├── INDEX.md           ← catalog of all memory modules
├── glossary.md        ← shared terms & acronyms
├── state/             ← living project state
│   ├── goals.md
│   ├── next-actions.md
│   ├── open-questions.md
│   └── blockers.md
├── sessions/          ← chronological session logs (append-only)
├── topics/            ← durable knowledge by subject
├── decisions/         ← architecture / product decisions (ADRs)
└── artifacts/         ← pointers to outputs, links, paths, IDs
```

## Update protocol

After any meaningful progress (code, design choice, research, user preference):

| Change type | Update |
|-------------|--------|
| Where we left off / next step | `CURRENT.md` + `state/next-actions.md` |
| Goal or scope shift | `state/goals.md` |
| Unanswered / ambiguous item | `state/open-questions.md` |
| Blocked work | `state/blockers.md` |
| Durable topic knowledge | `topics/<slug>.md` (+ link in `INDEX.md`) |
| Significant choice (why we did X) | `decisions/NNNN-slug.md` (+ link in `INDEX.md`) |
| End of a working session **or loop tick** | new/append `sessions/YYYY-MM-DD-slug.md` |
| External link, deploy, address, ID | `artifacts/` entry + `INDEX.md` |
| Qualify / sponsor surface change | `topics/qualification-matrix.md` + `topics/sponsor-surface.md` |
| Loop arm / stop / cadence | `loops/*.md` |
| New term | `glossary.md` |

Also bump the **Last updated** stamp in `CURRENT.md` and add a one-line entry to `INDEX.md` when you create a new module.

**Standing order:** User asked (2026-09-10) to keep updating and recording everything in `memory/` continuously during the AtBlock build — treat memory sync as part of “done,” not optional cleanup.

## Writing conventions

- **Dates:** ISO `YYYY-MM-DD` (timezone: Asia/Kolkata / IST unless noted).
- **Slugs:** lowercase-kebab-case filenames.
- **Links:** relative Markdown links between memory files.
- **Decisions:** use `decisions/_template.md`; number sequentially `0001-…`.
- **Sessions:** one file per focused work block; include Outcome + Next.
- **Be concrete:** paths, commands, file names, ownership — not vague summaries.
- **Never store secrets** (keys, mnemonics, private env values). Store *names* of env vars and where they live instead.

## Fresh agent checklist

```
[ ] Read memory/CURRENT.md
[ ] Skim memory/INDEX.md
[ ] Read state/next-actions.md and state/blockers.md
[ ] Open only the topics/decisions needed for the task
[ ] Do the work
[ ] Update CURRENT.md + relevant modules before finishing
```
