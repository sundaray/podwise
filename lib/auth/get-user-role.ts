import "server-only";

import chalk from "chalk";
import { db } from "@/db";
import { usersTable } from "@/db/schema";
import { eq } from "drizzle-orm";

/**
 * Retrieves a user's role based on their email address.
 * This function queries the database for a user with the provided email
 * and returns their assigned role in the system.
 */
export async function getUserRole(email: string): Promise<{ role: string }> {
  try {
    const users = await db
      .select({ role: usersTable.role })
      .from(usersTable)
      .where(eq(usersTable.email, email))
      .limit(1);

    if (users.length === 0) {
      throw new Error("User not found");
    }
    
    return { role: users[0].role };
  } catch (error) {
    console.error(chalk.red("[getUserRole] error:"), error);
    const message =
      error instanceof Error ? error.message : `Unknown error: ${error}`;
    throw new Error(`Failed to get user role: ${message}`);
  }
}