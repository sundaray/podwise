import "server-only";

import chalk from "chalk";
import { db } from "@/db";
import { subscribersTable } from "@/db/schema";
import { eq } from "drizzle-orm";

/************************************************
 *
 * Check if a subscriber's email is verified
 *
 ************************************************/

export async function isSubscriptionEmailVerified(email: string): Promise<boolean> {
  try {
    const users = await db
      .select({ emailVerified: subscribersTable.emailVerified })
      .from(subscribersTable)
      .where(eq(subscribersTable.email, email))
      .limit(1);

    // If no user found, return false
    // Otherwise, return the verification status
    if (users.length === 0) {
      return false;
    }

    return users[0].emailVerified;
  } catch (error) {
    console.error(chalk.red("[isSubscriptionEmailVerified] error: "), error);
    const message =
      error instanceof Error ? error.message : `Unknown error: ${error}`;
    throw new Error(`Failed to verify subscriber email: ${message}`);
  }
}

/************************************************
 *
 * Create subscription email verification token
 *
 ************************************************/
import { base64url } from "jose";
import { getRandomValues } from "uncrypto";

export function createSubscriptionEmailVerificationToken(): string {
  const randomValues = new Uint8Array(32);
  getRandomValues(randomValues);
  return base64url.encode(randomValues);
}

/************************************************
 *
 * Create subscription email verification URL
 *
 ************************************************/

export function createSubscriptionEmailVerificationURL(token: string): string {
  const url = new URL("/api/subscribe/verify-email", process.env.BASE_URL);
  url.searchParams.set("token", token);
  return url.toString();
}

/************************************************
 *
 * Send subscription verification email
 *
 ************************************************/

import { render } from "@react-email/render";
import { sesClient } from "@/lib/aws";
import { SendEmailCommand } from "@aws-sdk/client-ses";
import { SubscriptionEmailVerificationTemplate } from "@/components/subscription/subscription-email-verification-template";

export async function sendSubscriptionVerificationEmail(email: string, url: string) {
      // Convert the email to HTML
      const emailHtml = await render(SubscriptionEmailVerificationTemplate({ url }))

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
            Data: "Subscription link for 5-idea friday newsletter",
          },
        },
        Source: process.env.EMAIL_FROM,
      })
  
  try {
    await sesClient.send(sendEmailCommand)
  } catch (error) {
    const message =
      error instanceof Error ? error.message : `Unknown error: ${error}`;
    throw new Error(`Failed to send subscription verification email: ${message}`);
  }
}
