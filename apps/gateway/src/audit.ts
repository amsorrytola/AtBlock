/**
 * Hedera Consensus Service audit trail (extra points).
 * Without HEDERA_OPERATOR_* keys, records a local JSONL audit only.
 * With keys + HCS_TOPIC_ID, submits a ConsensusSubmitMessage.
 */
import { writeFile, appendFile, mkdir } from "node:fs/promises";
import path from "node:path";

export type AuditEvent = {
  at: string;
  kind: "payment" | "cite" | "rederive" | "revoke";
  payload: Record<string, unknown>;
};

const AUDIT_DIR = process.env.AUDIT_DIR ?? path.join(process.cwd(), ".audit");

export async function appendLocalAudit(event: AuditEvent): Promise<string> {
  await mkdir(AUDIT_DIR, { recursive: true });
  const file = path.join(AUDIT_DIR, "hcs-local.jsonl");
  await appendFile(file, `${JSON.stringify(event)}\n`, "utf8");
  return file;
}

export async function submitHcsAudit(event: AuditEvent): Promise<{ local: string; hcs?: string }> {
  const local = await appendLocalAudit(event);
  const topicId = process.env.HCS_TOPIC_ID;
  const operatorId = process.env.HEDERA_OPERATOR_ACCOUNT_ID ?? process.env.HEDERA_PAYEE_ACCOUNT_ID;
  const operatorKey = process.env.HEDERA_OPERATOR_PRIVATE_KEY ?? process.env.HEDERA_PAYEE_PRIVATE_KEY;

  if (!topicId || !operatorId || !operatorKey) {
    return { local };
  }

  // Lazy-load SDK only when configured (keeps gateway boot light).
  const {
    Client,
    TopicMessageSubmitTransaction,
    PrivateKey,
    AccountId,
  } = await import("@hashgraph/sdk");

  const client = Client.forTestnet().setOperator(
    AccountId.fromString(operatorId),
    PrivateKey.fromStringECDSA(operatorKey),
  );
  try {
    const tx = await new TopicMessageSubmitTransaction()
      .setTopicId(topicId)
      .setMessage(JSON.stringify(event))
      .execute(client);
    const receipt = await tx.getReceipt(client);
    return { local, hcs: String(receipt.status) };
  } finally {
    client.close();
  }
}

/** One-time helper note — create topic out of band, set HCS_TOPIC_ID */
export async function writeAuditReadme() {
  await mkdir(AUDIT_DIR, { recursive: true });
  await writeFile(
    path.join(AUDIT_DIR, "README.md"),
    "# Local audit mirror\n\nSet `HCS_TOPIC_ID` + operator keys to mirror events to Hedera Consensus Service.\n",
    "utf8",
  );
}
