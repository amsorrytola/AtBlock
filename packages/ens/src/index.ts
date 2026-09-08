import {
  createPublicClient,
  createWalletClient,
  http,
  parseAbi,
  type Address,
  type Hex,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { sepolia } from "viem/chains";
import { normalize, namehash } from "viem/ens";

/**
 * Thin ENSv2 helpers for AtBlock demo (Sepolia).
 * Keep central: resolve agent names + revoke a role bitmap via EAC on a registry/resolver.
 * Full UserRegistry deploy is optional stretch — see ENS contract-dev tutorial.
 */

const eacAbi = parseAbi([
  "function hasRoles(uint256 resource, uint256 roleBitmap, address account) view returns (bool)",
  "function revokeRoles(uint256 resource, uint256 roleBitmap, address account) returns (bool)",
  "function grantRoles(uint256 resource, uint256 roleBitmap, address account) returns (bool)",
]);

export type EnsConfig = {
  rpcUrl: string;
  /** Agent / buyer name e.g. buyer.atblock.eth (must exist on Sepolia ENSv2) */
  agentName: string;
};

function publicClient(rpcUrl: string) {
  return createPublicClient({
    chain: sepolia,
    transport: http(rpcUrl),
  });
}

export async function resolveAgent(config: EnsConfig): Promise<Address | null> {
  const client = publicClient(config.rpcUrl);
  return client.getEnsAddress({ name: normalize(config.agentName) });
}

export async function getResolver(config: EnsConfig): Promise<Address | null> {
  const client = publicClient(config.rpcUrl);
  return client.getEnsResolver({ name: normalize(config.agentName) });
}

/**
 * Revoke roles on a resource for an agent account.
 * `roleBitmap` and `resource` come from your ENSv2 setup (see EAC docs).
 * Demo default resource = namehash(agentName) as uint256-friendly hex via BigInt.
 */
export async function revokeAgentRoles(opts: {
  rpcUrl: string;
  privateKey: Hex;
  eacContract: Address;
  agentAccount: Address;
  resource: bigint;
  roleBitmap: bigint;
}) {
  const account = privateKeyToAccount(opts.privateKey);
  const wallet = createWalletClient({
    account,
    chain: sepolia,
    transport: http(opts.rpcUrl),
  });
  const hash = await wallet.writeContract({
    address: opts.eacContract,
    abi: eacAbi,
    functionName: "revokeRoles",
    args: [opts.resource, opts.roleBitmap, opts.agentAccount],
  });
  return hash;
}

/**
 * Grant roles on a resource for an agent account (setup before demo revoke).
 */
export async function grantAgentRoles(opts: {
  rpcUrl: string;
  privateKey: Hex;
  eacContract: Address;
  agentAccount: Address;
  resource: bigint;
  roleBitmap: bigint;
}) {
  const account = privateKeyToAccount(opts.privateKey);
  const wallet = createWalletClient({
    account,
    chain: sepolia,
    transport: http(opts.rpcUrl),
  });
  const hash = await wallet.writeContract({
    address: opts.eacContract,
    abi: eacAbi,
    functionName: "grantRoles",
    args: [opts.resource, opts.roleBitmap, opts.agentAccount],
  });
  return hash;
}

/** Read whether account currently holds roleBitmap on resource. */
export async function agentHasRoles(opts: {
  rpcUrl: string;
  eacContract: Address;
  agentAccount: Address;
  resource: bigint;
  roleBitmap: bigint;
}): Promise<boolean> {
  const client = publicClient(opts.rpcUrl);
  return client.readContract({
    address: opts.eacContract,
    abi: eacAbi,
    functionName: "hasRoles",
    args: [opts.resource, opts.roleBitmap, opts.agentAccount],
  });
}

export function resourceFromName(name: string): bigint {
  // namehash is bytes32; interpret as bigint for EAC resource id when using name-scoped roles
  return BigInt(namehash(normalize(name)));
}

export async function pinStatus(
  config: EnsConfig & {
    eacContract?: Address;
    agentAccount?: Address;
    roleBitmap?: bigint;
  },
) {
  const address = await resolveAgent(config);
  const resolver = await getResolver(config);
  let roles: { hasRoles: boolean; resource: string; roleBitmap: string } | null = null;
  if (config.eacContract && (config.agentAccount || address)) {
    const agentAccount = (config.agentAccount ?? address) as Address;
    const resource = resourceFromName(config.agentName);
    const roleBitmap = config.roleBitmap ?? 1n;
    const has = await agentHasRoles({
      rpcUrl: config.rpcUrl,
      eacContract: config.eacContract,
      agentAccount,
      resource,
      roleBitmap,
    });
    roles = {
      hasRoles: has,
      resource: resource.toString(),
      roleBitmap: roleBitmap.toString(),
    };
  }
  return {
    name: config.agentName,
    normalized: normalize(config.agentName),
    address,
    resolver,
    network: "sepolia",
    ensv2: true,
    roles,
  };
}
