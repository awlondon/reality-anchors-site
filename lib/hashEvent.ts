export async function hashEvent(payload: unknown): Promise<string> {
  const raw = JSON.stringify(payload);
  const buffer = new TextEncoder().encode(raw);
  const hash = await crypto.subtle.digest('SHA-256', buffer);
  const hex = Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
  return hex.slice(0, 32);
}
