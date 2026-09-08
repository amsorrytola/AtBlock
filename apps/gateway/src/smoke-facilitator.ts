/** No-secrets smoke: Blocky402 facilitator reachable + hedera:testnet advertised. */
import { loadEnv } from "./load-env.js";

loadEnv();

const FACILITATOR = (process.env.FACILITATOR_URL ?? "https://api.testnet.blocky402.com").replace(
  /\/$/,
  "",
);

async function main() {
  const health = await fetch(`${FACILITATOR}/health`);
  const healthBody = await health.json();
  const supported = await fetch(`${FACILITATOR}/supported`);
  const supportedBody = (await supported.json()) as {
    kinds?: { network?: string; extra?: { feePayer?: string } }[];
  };
  const hedera = supportedBody.kinds?.find((k) => k.network === "hedera:testnet");
  const ok = health.ok && Boolean(hedera?.extra?.feePayer);
  console.log(
    JSON.stringify(
      {
        ok,
        facilitator: FACILITATOR,
        health: healthBody,
        hederaTestnet: hedera ?? null,
      },
      null,
      2,
    ),
  );
  if (!ok) process.exit(1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
