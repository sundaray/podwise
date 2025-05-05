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

import { render } from "@react-email/render";
import { sesClient } from "@/lib/aws";
import { SendEmailCommand } from "@aws-sdk/client-ses";
import { EmailVerificationTemplate } from "@/components/auth/email-verification-template";

export async function sendVerificationEmail(email: string, url: string) {
      // Convert the email to HTML
      const emailHtml = await render(EmailVerificationTemplate({ url }))

      const sendEmailCommand = new SendEmailCommand({
        Destination: {
          ToAddresses: [email],
        },
        Message: {
          Body: {
            Html: {
              Charset: "UTF-8",
              Data: emailHtml,
            },
          },
          Subject: {
            Charset: "UTF-8",
            Data: "Sign-up link for www.podwise.org",
          },
        },
        Source: process.env.EMAIL_FROM,
      })
  
  try {
    await sesClient.send(sendEmailCommand)
  } catch (error) {
    const message =
      error instanceof Error ? error.message : `Unknown error: ${error}`;
    throw new Error(`Failed to send verification email: ${message}`);
  }
}
