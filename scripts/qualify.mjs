#!/usr/bin/env node
/**
 * Pre-demo qualify gate (no secrets printed).
 * Usage: npm run qualify
 */
import { existsSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const hasEnv = existsSync(resolve(root, ".env"));

function run(label, cmd, args) {
  console.log(`\n==> ${label}`);
  const r = spawnSync(cmd, args, { cwd: root, stdio: "inherit", shell: false });
  if (r.status !== 0) {
    console.error(`FAIL: ${label}`);
    process.exit(r.status ?? 1);
  }
}

console.log(
  JSON.stringify(
    {
      ok: true,
      step: "preflight",
      envFilePresent: hasEnv,
      checkin2Due: "~09:29 IST Fri Sep 11 2026",
      checkin2Paste: "memory/artifacts/checkin-2-pitch.md",
      judgeChecklist: "docs/atblock-judge-qualify-checklist.html",
      note: hasEnv
        ? "env present — after smoke, run: npm run create-topic -w @atblock/gateway && npm run pay -w @atblock/gateway && npm run probe:graph -w @atblock/gateway"
        : "no .env yet — fill docs/AtBlock-Credentials-Checklist.pdf; code path still qualifies via smoke+typecheck",
    },
    null,
    2,
  ),
);

run("typecheck", "npm", ["run", "typecheck"]);
run("smoke:facilitator", "npm", ["run", "smoke:facilitator", "-w", "@atblock/gateway"]);

console.log(
  JSON.stringify(
    {
      ok: true,
      qualify: "coded-path-green",
      livePay: hasEnv ? "ready-to-attempt" : "blocked-no-env",
      partners: ["The Graph", "Hedera", "ENS"],
    },
    null,
    2,
  ),
);
