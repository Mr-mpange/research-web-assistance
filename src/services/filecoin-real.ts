/**
 * Real IPFS/Filecoin integration via Lighthouse SDK REST API.
 * Uploads documents to IPFS with Filecoin deal-making via Lighthouse.
 * 
 * Get a free API key at: https://files.lighthouse.storage/
 */

const LIGHTHOUSE_API_URL = "https://node.lighthouse.storage/api/v0/add";
const LIGHTHOUSE_GATEWAY = "https://gateway.lighthouse.storage/ipfs";

export interface RealFilecoinResult {
  cid: string;
  size: number;
  timestamp: number;
  network: "filecoin-calibration" | "ipfs-lighthouse";
  gatewayUrl: string;
  fileName: string;
}

export async function uploadToLighthouse(
  file: File,
  apiKey: string
): Promise<RealFilecoinResult> {
  if (!apiKey) {
    throw new Error("Lighthouse API key is required. Get one at https://files.lighthouse.storage/");
  }

  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(LIGHTHOUSE_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Lighthouse upload failed [${response.status}]: ${errorText}`);
  }

  const data = await response.json();

  return {
    cid: data.Hash,
    size: parseInt(data.Size, 10),
    timestamp: Date.now(),
    network: "ipfs-lighthouse",
    gatewayUrl: `${LIGHTHOUSE_GATEWAY}/${data.Hash}`,
    fileName: data.Name || file.name,
  };
}

export async function retrieveFromLighthouse(cid: string): Promise<{ status: string; url: string }> {
  const url = `${LIGHTHOUSE_GATEWAY}/${cid}`;
  const response = await fetch(url, { method: "HEAD" });

  return {
    status: response.ok ? "available" : "unavailable",
    url,
  };
}
