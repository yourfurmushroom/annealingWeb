export async function sha256(message: string): Promise<string> {
  // Convert string to ArrayBuffer
  const msgBuffer = new TextEncoder().encode(message);
  // Compute SHA-256 hash
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  // Convert buffer to hex string
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}