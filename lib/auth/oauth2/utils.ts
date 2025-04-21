import { base64url } from "jose";
import { getRandomValues } from "uncrypto";

export function generateState(): string {
  const randomValues = new Uint8Array(32);
  getRandomValues(randomValues);
  return base64url.encode(randomValues);
}

export function encodeClientCredentials(
  clientId: string,
  clientSecret: string,
) {
  const bytes = new TextEncoder().encode(`${clientId}:${clientSecret}`);
  return base64url.encode(bytes);
}
