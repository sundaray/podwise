import "server-only";

import chalk from "chalk";
import { db } from "@/db";
import { usersTable } from "@/db/schema";
import { eq } from "drizzle-orm";

/************************************************
 *
 * Check if a user's email is verified
 *
 ************************************************/

export async function isEmailVerified(email: string): Promise<boolean> {
  try {
    const users = await db
      .select({ credentialEmailVerified: usersTable.credentialEmailVerified })
      .from(usersTable)
      .where(eq(usersTable.email, email))
      .limit(1);

    // If no user found, return false
    // Otherwise, return the verification status
    if (users.length === 0) {
      return false;
    }

    return users[0].credentialEmailVerified;
  } catch (error) {
    console.error(chalk.red("[isEmailVerified] error: "), error);
    const message =
      error instanceof Error ? error.message : `Unknown error: ${error}`;
    throw new Error(`Failed to verify email: ${message}`);
  }
}

/************************************************
 *
 * Create email verification token
 *
 ************************************************/
import { base64url } from "jose";
import { getRandomValues } from "uncrypto";

export function createEmailVerificationToken(): string {
  const randomValues = new Uint8Array(32);
  getRandomValues(randomValues);
  return base64url.encode(randomValues);
}

/************************************************
 *
 * Create email verification URL
 *
 ************************************************/

export function createEmailVerificationURL(token: string): string {
  const url = new URL("/api/auth/verify-email", process.env.BASE_URL);
  url.searchParams.set("token", token);
  return url.toString();
}

/************************************************
 *
 * Send verification email
 *
 ************************************************/

import { resend } from "@/lib/resend";
import { EmailVerificationTemplate } from "@/components/email-verification-template";

export async function sendVerificationEmail(email: string, url: string) {
  try {
    const { error } = await resend.emails.send({
      from: process.env.EMAIL_FROM!,
      to: email,
      subject: "Verify your email address",
      react: EmailVerificationTemplate({ url }),
    });

    if (error) {
      console.error(chalk.red("[sendVerificationEmail] error: "), error);
      throw new Error("Failed to send verification email.");
    }
  } catch (error) {
    const message =
      error instanceof Error ? error.message : `Unknown error: ${error}`;
    throw new Error(message);
  }
}
