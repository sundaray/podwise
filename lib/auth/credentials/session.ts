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
 * Create email verification session
 *
 ************************************************/

export async function createEmailVerificationSession(
  email: string,
  hashedPassword: string,
  token: string,
) {
  try {
    const sessionData = await encrypt({
      email,
      hashedPassword,
      token,
    });

    const cookieStore = await cookies();

    cookieStore.set({
      name: "email-verification-session",
      value: sessionData,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60, // 1 hour in seconds
      sameSite: "lax",
      path: "/",
    });
  } catch (error) {
    throw new Error("Failed to create email verification session.");
  }
}

/************************************************
 *
 * Check if an email verification session exists
 *
 ************************************************/

export async function doesEmailVerificationSessionExist(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const hasCookie = cookieStore.has("email-verification-session");
    return hasCookie;
  } catch (error) {
    throw Error("Failed to check email verification session");
  }
}

/************************************************
 *
 * Create password reset session
 *
 ************************************************/
export async function createPasswordResetSession(email: string, token: string) {
  try {
    const sessionData = await encrypt({
      email,
      token,
    });

    const cookieStore = await cookies();

    cookieStore.set({
      name: "password-reset-session",
      value: sessionData,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60, // 1 hour in seconds
      sameSite: "lax",
      path: "/",
    });
  } catch (error) {
    throw new Error("Failed to create password reset session.");
  }
}

/************************************************
 *
 * Check if password reset session exists
 *
 ************************************************/

export async function doesPasswordResetSessionExist(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const hasCookie = cookieStore.has("password-reset-session");
    return hasCookie;
  } catch (error) {
    throw Error("Failed to check password reset session");
  }
}

/************************************************
 *
 * Get password reset session
 *
 ************************************************/
type PasswordResetSession = {
  email: string;
  token: string;
};

/************************************************
 *
 * Delete password reset session
 *
 ************************************************/

export async function deletePasswordResetSession() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete("password-reset-session");
  } catch (error) {
    throw Error("Failed to delete password reset session.");
  }
}
