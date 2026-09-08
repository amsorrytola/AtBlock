/**
 * Demo: revoke agent spend roles via EAC on Sepolia.
 *
 * Usage:
 *   ENS_RPC_URL=... ENS_PRIVATE_KEY=0x... ENS_EAC_CONTRACT=0x... \
 *   ENS_AGENT_NAME=buyer.atblock.eth ENS_AGENT_ACCOUNT=0x... \
 *   npm run revoke-demo -w @atblock/ens
 */
import type { Address, Hex } from "viem";
import { pinStatus, resourceFromName, revokeAgentRoles } from "./index.js";
import { loadEnv } from "./load-env.js";

loadEnv();

async function main() {
  const rpcUrl = process.env.ENS_RPC_URL;
  const privateKey = process.env.ENS_PRIVATE_KEY as Hex | undefined;
  const eacContract = process.env.ENS_EAC_CONTRACT as Address | undefined;
  const agentName = process.env.ENS_AGENT_NAME ?? "buyer.atblock.eth";
  const agentAccount = process.env.ENS_AGENT_ACCOUNT as Address | undefined;
  const roleBitmap = BigInt(process.env.ENS_ROLE_BITMAP ?? "1");

  if (!rpcUrl || !privateKey || !eacContract) {
    throw new Error("Need ENS_RPC_URL, ENS_PRIVATE_KEY, ENS_EAC_CONTRACT");
  }

  const pin = await pinStatus({ rpcUrl, agentName });
  console.log("pin:", JSON.stringify(pin, null, 2));

  const account = agentAccount ?? (pin.address as Address | null);
  if (!account) {
    throw new Error("No agent address — set ENS_AGENT_ACCOUNT or resolve ENS_AGENT_NAME");
  }

  const resource = resourceFromName(agentName);
  const hash = await revokeAgentRoles({
    rpcUrl,
    privateKey,
    eacContract,
    agentAccount: account,
    resource,
    roleBitmap,
  });

  console.log(
    JSON.stringify(
      {
        ok: true,
        revokeTx: hash,
        resource: resource.toString(),
        roleBitmap: roleBitmap.toString(),
        agentAccount: account,
        name: agentName,
        etherscan: `https://sepolia.etherscan.io/tx/${hash}`,
      },
      null,
      2,
    ),
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
