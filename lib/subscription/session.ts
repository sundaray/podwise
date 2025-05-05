import "server-only";

import { cookies } from "next/headers";
import type { JWTPayload } from "jose";
import { base64url, EncryptJWT, jwtDecrypt } from "jose";

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
 * Create subscription email verification session
 *
 ************************************************/

export async function createSubscriptionEmailVerificationSession(
  email: string,
  token: string,
) {
  try {
    const sessionData = await encrypt({
      email,
      token,
    });

    const cookieStore = await cookies();

    cookieStore.set({
      name: "subscription-email-verification-session",
      value: sessionData,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60, // 1 hour in seconds
      sameSite: "lax",
      path: "/",
    });
  } catch (error) {
    throw new Error(
      "Failed to create subscription email verification session.",
    );
  }
}

/************************************************
 *
 * Check if a subscription email verification session exists
 *
 ************************************************/

export async function doesSubscriptionEmailVerificationSessionExist(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const hasCookie = cookieStore.has(
      "subscription-email-verification-session",
    );
    return hasCookie;
  } catch (error) {
    throw new Error("Failed to check subscription email verification session");
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
 * Get the email verification session payload
 *
 ************************************************/
type SubscriptionEmailVerificationSession = {
  token: string;
  email: string;
};

export async function getSubscriptionEmailVerificationSession(): Promise<SubscriptionEmailVerificationSession> {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(
      "subscription-email-verification-session",
    );

    if (!sessionCookie) {
      throw new Error("Failed to get subscription email verification session");
    }

    return await decrypt<SubscriptionEmailVerificationSession>(
      sessionCookie.value,
    );
  } catch (error) {
    throw new Error(
      "Failed to get subscription email verification session payload",
    );
  }
}

/****************************************************
 *
 * Delete the subscription email verification session
 *
 ***************************************************/

export async function deleteSubscriptionEmailVerificationSession() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete("subscription-email-verification-session");
  } catch (error) {
    throw new Error(
      "Failed to delete subscription email verification session.",
    );
  }
}
