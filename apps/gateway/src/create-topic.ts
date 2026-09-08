/**
 * Create an HCS topic for AtBlock payment audit trail (Hedera extra points).
 *
 * Usage:
 *   HEDERA_PAYEE_ACCOUNT_ID=0.0.x HEDERA_PAYEE_PRIVATE_KEY=... npm run create-topic -w @atblock/gateway
 *
 * Prints HCS_TOPIC_ID to paste into .env
 */
import { loadEnv } from "./load-env.js";

loadEnv();

async function main() {
  const operatorId = process.env.HEDERA_OPERATOR_ACCOUNT_ID ?? process.env.HEDERA_PAYEE_ACCOUNT_ID;
  const operatorKey = process.env.HEDERA_OPERATOR_PRIVATE_KEY ?? process.env.HEDERA_PAYEE_PRIVATE_KEY;
  if (!operatorId || !operatorKey) {
    throw new Error("Set HEDERA_PAYEE_ACCOUNT_ID + HEDERA_PAYEE_PRIVATE_KEY (or OPERATOR_*)");
  }

  const { Client, TopicCreateTransaction, PrivateKey, AccountId } = await import("@hashgraph/sdk");

  let key;
  try {
    key = PrivateKey.fromStringECDSA(operatorKey);
  } catch {
    key = PrivateKey.fromString(operatorKey);
  }

  const client = Client.forTestnet().setOperator(AccountId.fromString(operatorId), key);
  try {
    const tx = await new TopicCreateTransaction()
      .setTopicMemo("AtBlock payment/cite audit — ETHOnline 2026")
      .execute(client);
    const receipt = await tx.getReceipt(client);
    const topicId = receipt.topicId?.toString();
    if (!topicId) throw new Error("No topicId in receipt");
    console.log(
      JSON.stringify(
        {
          ok: true,
          HCS_TOPIC_ID: topicId,
          hashscan: `https://hashscan.io/testnet/topic/${topicId}`,
          hint: "Add HCS_TOPIC_ID to .env then restart gateway",
        },
        null,
        2,
      ),
    );
  } finally {
    client.close();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
