import "server-only";

import { cookies } from "next/headers";
import { base64url, EncryptJWT, jwtDecrypt, type JWTPayload } from "jose";

/************************************************
 *
 * Encrypt payload
 *
 ************************************************/

const key = process.env.JWT_ENCRYPTION_KEY!;
const secret = base64url.decode(key);

export async function encrypt(payload: any): Promise<string> {
  try {
    return await new EncryptJWT(payload)
      .setProtectedHeader({ alg: "dir", enc: "A128CBC-HS256" })
      .setExpirationTime("1hr")
      .encrypt(secret);
  } catch (error) {
    throw new Error("Failed to encrypt payload.");
  }
}

/************************************************
 *
 * Decrypt JWT
 *
 ************************************************/

export async function decrypt<T extends JWTPayload>(jwt: string): Promise<T> {
  try {
    const { payload } = await jwtDecrypt(jwt, secret);
    return payload as T;
  } catch (error) {
    throw new Error("Failed to decrypt JWT.");
  }
}

/************************************************
 *
 * Create user session
 *
 ************************************************/

export async function createUserSession(
  email: string,
  role: string,
  annualAccessStatus: boolean,
  lifetimeAccessStatus: boolean,
) {
  try {
    const sessionData = await encrypt({
      email,
      role,
      annualAccessStatus,
      lifetimeAccessStatus,
    });

    const cookieStore = await cookies();

    cookieStore.set({
      name: "user-session",
      value: sessionData,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60, // 1 hour in seconds
      sameSite: "lax",
      path: "/",
    });
  } catch (error) {
    throw new Error("Failed to create user session.");
  }
}

/************************************************
 *
 * Update user session
 *
 ************************************************/

export async function updateUserSession(token: string) {
  try {
    const paylod = await decrypt(token);

    const updatedToken = await encrypt(paylod);

    return { updatedToken };
  } catch (error) {
    return null;
  }
}
