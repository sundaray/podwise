import "server-only";

import { hash } from "@node-rs/argon2";
import chalk from "chalk";

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
