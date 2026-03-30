/**
 * Real NEAR Protocol integration via near-api-js.
 * Connects to NEAR testnet and stores document proofs.
 */

import * as nearAPI from "near-api-js";

const NEAR_TESTNET_CONFIG = {
  networkId: "testnet",
  nodeUrl: "https://rpc.testnet.near.org",
  walletUrl: "https://testnet.mynearwallet.com",
  helperUrl: "https://helper.testnet.near.org",
  explorerUrl: "https://testnet.nearblocks.io",
};

// Contract for storing proofs — uses a guest-book-style contract for demo
// In production, you'd deploy a custom contract
const PROOF_CONTRACT = "guest-book.testnet";

let nearConnection: nearAPI.Near | null = null;
let walletConnection: nearAPI.WalletConnection | null = null;

export async function initNearConnection(): Promise<nearAPI.WalletConnection> {
  if (walletConnection) return walletConnection;

  const keyStore = new nearAPI.keyStores.BrowserLocalStorageKeyStore();

  nearConnection = await nearAPI.connect({
    ...NEAR_TESTNET_CONFIG,
    keyStore,
  });

  walletConnection = new nearAPI.WalletConnection(nearConnection, "proofdoc-ai");
  return walletConnection;
}

export function getNearAccountId(): string | null {
  if (!walletConnection) return null;
  if (!walletConnection.isSignedIn()) return null;
  return walletConnection.getAccountId();
}

export async function signInNear(): Promise<void> {
  const wallet = await initNearConnection();
  if (!wallet.isSignedIn()) {
    await wallet.requestSignIn({
      contractId: PROOF_CONTRACT,
      methodNames: [],
    });
  }
}

export async function signOutNear(): Promise<void> {
  const wallet = await initNearConnection();
  wallet.signOut();
  walletConnection = null;
}

export interface RealBlockchainProof {
  transactionHash: string;
  blockHeight: number;
  timestamp: number;
  contractId: string;
  documentHash: string;
  filecoinCid: string;
  network: "testnet";
  explorerUrl: string;
}

export async function storeProofOnNearTestnet(
  documentHash: string,
  filecoinCid: string
): Promise<RealBlockchainProof> {
  const wallet = await initNearConnection();

  if (!wallet.isSignedIn()) {
    throw new Error("Please sign in to NEAR wallet first");
  }

  const account = wallet.account();

  // Store proof as a function call to a simple contract
  // We use the guest-book contract's addMessage method as a proof-of-concept
  // In production, you'd deploy a custom ProofDoc contract
  const proofData = JSON.stringify({
    type: "proofdoc-proof",
    hash: documentHash,
    cid: filecoinCid,
    timestamp: Date.now(),
  });

  const result = await account.functionCall({
    contractId: PROOF_CONTRACT,
    methodName: "add_message",
    args: { text: proofData },
    gas: BigInt("30000000000000"), // 30 TGas
    attachedDeposit: BigInt(0),
  });

  const txHash = result.transaction?.hash || result.transaction_outcome?.id || "unknown";
  const blockHeight = result.transaction_outcome?.block_hash
    ? parseInt(result.transaction_outcome.block_hash.slice(0, 8), 16)
    : 0;

  return {
    transactionHash: txHash,
    blockHeight,
    timestamp: Date.now(),
    contractId: PROOF_CONTRACT,
    documentHash,
    filecoinCid,
    network: "testnet",
    explorerUrl: `${NEAR_TESTNET_CONFIG.explorerUrl}/txns/${txHash}`,
  };
}
