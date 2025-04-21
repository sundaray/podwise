import { base64url } from "jose";
import { getRandomValues } from "uncrypto";

export function generateCodeVerifier(): string {
  const randomValues = new Uint8Array(32);
  getRandomValues(randomValues);
  return base64url.encode(randomValues);
}

import { subtle } from "uncrypto";

export async function generateS256CodeChallenge(
  codeverifier: string,
): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(codeverifier);
  const hash = await subtle.digest("SHA-256", data);
  return base64url.encode(new Uint8Array(hash));
}
