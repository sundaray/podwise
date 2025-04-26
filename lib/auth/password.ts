import "server-only";

import { hash, verify } from "@node-rs/argon2";
import chalk from "chalk";

import { db } from "@/db";
import { usersTable } from "@/db/schema";
import { eq } from "drizzle-orm";
/************************************************
 *
 * Verify user password
 *
 ************************************************/

export async function verifyPassword(
  email: string,
  password: string,
): Promise<boolean> {
  try {
    // Query using Drizzle ORM syntax
    const users = await db
      .select({ password: usersTable.password })
      .from(usersTable)
      .where(eq(usersTable.email, email))
      .limit(1);

    // If no user found or password is null (e.g., Google auth user), return false
    if (users.length === 0 || !users[0].password) {
      return false;
    }

    // Verify the password using argon2
    const hashedPassword = users[0].password;
    return await verify(hashedPassword, password);
  } catch (error) {
    console.error(chalk.red("[verifyPassword] error: "), error);
    const message =
      error instanceof Error ? error.message : `Unknown error: ${error}`;
    throw new Error(`Failed to verify password: ${message}`);
  }
}

/************************************************
 *
 * Hash user password
 *
 ************************************************/

export async function hashPassword(password: string): Promise<string> {
  try {
    return await hash(password);
  } catch (error) {
    console.error(chalk.red("[hashPassword] error: "), error);
    throw new Error("Failed to hash password.");
  }
}
