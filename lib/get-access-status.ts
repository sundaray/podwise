import "server-only";
import chalk from "chalk";
import { db } from "@/db";
import { usersTable } from "@/db/schema";
import { eq } from "drizzle-orm";

/**
 * Retrieves a user's subscription access status based on their email address.
 * This function queries the database for annual and lifetime access flags.
 */
export async function getAccessStatus(email: string): Promise<{
  annualAccessStatus: boolean;
  lifetimeAccessStatus: boolean;
}> {
  try {
    const users = await db
      .select({
        annualAccessStatus: usersTable.annualAccess,
        lifetimeAccessStatus: usersTable.lifetimeAccess,
      })
      .from(usersTable)
      .where(eq(usersTable.email, email))
      .limit(1);

    if (users.length === 0) {
      throw new Error("User not found");
    }

    return {
      annualAccessStatus: users[0].annualAccessStatus,
      lifetimeAccessStatus: users[0].lifetimeAccessStatus,
    };
  } catch (error) {
    console.error(chalk.red("[getAccessStatus] error:"), error);
    const message =
      error instanceof Error ? error.message : `Unknown error: ${error}`;
    throw new Error(`Failed to get user access status: ${message}`);
  }
}
