/**
 * Demo: grant then revoke agent spend roles (full Pin story on camera).
 *
 * Usage:
 *   ENS_RPC_URL=... ENS_PRIVATE_KEY=0x... ENS_EAC_CONTRACT=0x... \
 *   ENS_AGENT_NAME=buyer.atblock.eth ENS_AGENT_ACCOUNT=0x... \
 *   npm run pin-demo -w @atblock/ens
 */
import type { Address, Hex } from "viem";
import {
  agentHasRoles,
  grantAgentRoles,
  pinStatus,
  resourceFromName,
  revokeAgentRoles,
} from "./index.js";
import { loadEnv } from "./load-env.js";

loadEnv();

async function main() {
  const rpcUrl = process.env.ENS_RPC_URL;
  const privateKey = process.env.ENS_PRIVATE_KEY as Hex | undefined;
  const eacContract = process.env.ENS_EAC_CONTRACT as Address | undefined;
  const agentName = process.env.ENS_AGENT_NAME ?? "buyer.atblock.eth";
  const agentAccountEnv = process.env.ENS_AGENT_ACCOUNT as Address | undefined;
  const roleBitmap = BigInt(process.env.ENS_ROLE_BITMAP ?? "1");

  if (!rpcUrl || !privateKey || !eacContract) {
    throw new Error("Need ENS_RPC_URL, ENS_PRIVATE_KEY, ENS_EAC_CONTRACT");
  }

  const pin = await pinStatus({
    rpcUrl,
    agentName,
    eacContract,
    agentAccount: agentAccountEnv,
    roleBitmap,
  });
  const account = agentAccountEnv ?? (pin.address as Address | null);
  if (!account) {
    throw new Error("No agent address — set ENS_AGENT_ACCOUNT or resolve ENS_AGENT_NAME");
  }

  const resource = resourceFromName(agentName);

  const grantTx = await grantAgentRoles({
    rpcUrl,
    privateKey,
    eacContract,
    agentAccount: account,
    resource,
    roleBitmap,
  });
  const afterGrant = await agentHasRoles({
    rpcUrl,
    eacContract,
    agentAccount: account,
    resource,
    roleBitmap,
  });

  const revokeTx = await revokeAgentRoles({
    rpcUrl,
    privateKey,
    eacContract,
    agentAccount: account,
    resource,
    roleBitmap,
  });
  const afterRevoke = await agentHasRoles({
    rpcUrl,
    eacContract,
    agentAccount: account,
    resource,
    roleBitmap,
  });

  console.log(
    JSON.stringify(
      {
        ok: true,
        name: agentName,
        agentAccount: account,
        resource: resource.toString(),
        roleBitmap: roleBitmap.toString(),
        grant: {
          tx: grantTx,
          hasRoles: afterGrant,
          etherscan: `https://sepolia.etherscan.io/tx/${grantTx}`,
        },
        revoke: {
          tx: revokeTx,
          hasRoles: afterRevoke,
          etherscan: `https://sepolia.etherscan.io/tx/${revokeTx}`,
        },
        pinBefore: pin,
        story: "grant → hasRoles true → revoke → hasRoles false (ENSv2 EAC)",
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
