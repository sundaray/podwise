import "server-only";

import { cookies } from "next/headers";
import { base64url, EncryptJWT, jwtDecrypt } from "jose";

const key = process.env.JWT_ENCRYPTION_KEY ?? "";
const secret = base64url.decode(key);

/************************************************
 *
 * Encrypt payload
 *
 ************************************************/

export async function encrypt(payload: any) {
  return await new EncryptJWT(payload)
    .setProtectedHeader({ alg: "dir", enc: "A128CBC-HS256" })
    .setExpirationTime("1hr")
    .encrypt(secret);
}

/************************************************
 *
 * Decrypt JWT
 *
 ************************************************/

export async function decrypt(jwt: string) {
  try {
    const { payload } = await jwtDecrypt(jwt, secret);
    return payload;
  } catch (error) {
    return null;
  }
}

/************************************************
 *
 * Store OAuth state in cookies
 *
 ************************************************/

export async function storeOAuthState(
  state: string,
  codeVerifier: string,
  redirect: string,
) {
  const cookieStore = await cookies();

  const cookieOptions = {
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 10, // 10 minutes in seconds
    sameSite: "lax",
  } as const;

  const encryptedOAuthState = await encrypt({
    state,
    codeVerifier,
    redirect,
  });

  cookieStore.set("google_oauth_state", encryptedOAuthState, cookieOptions);
}