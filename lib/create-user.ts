import { db } from "@/db";
import { usersTable } from "@/db/schema";
import type { User, InsertUser } from "@/db/schema";
import { eq } from "drizzle-orm";

/**
 * Checks if a user with the given email and authentication provider exists
 */
export async function findUserByEmailAndProvider(
  email: string,
  provider: "google" | "credentials",
): Promise<{ user: User | null; hasProvider: boolean }> {
  const users = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, email))
    .limit(1);

  if (users.length === 0) {
    return { user: null, hasProvider: false };
  }

  const user = users[0];
  const hasProvider = user.authProviders?.includes(provider) || false;

  return { user, hasProvider };
}

/**
 * Creates a new user or updates an existing user with a new authentication provider
 */
export async function createUser(
  email: string,
  role: string,
  provider: "google" | "credentials",
  picture?: string,
  password?: string,
): Promise<{ data: User }> {
  try {
    // Check if user exists with this email and provider
    const { user, hasProvider } = await findUserByEmailAndProvider(
      email,
      provider,
    );

    // If user exists
    if (user) {
      // If user already has this provider, nothing to do
      if (hasProvider) {
        return { data: user };
      }

      // Update existing user with new provider
      const [updatedUser] = await db
        .update(usersTable)
        .set({
          authProviders: [...(user.authProviders || []), provider],
          ...(provider === "google" && picture ? { picture } : {}),
          ...(provider === "credentials" && password
            ? {
                password,
                credentialEmailVerified: true,
              }
            : {}),
        })
        .where(eq(usersTable.id, user.id))
        .returning();

      return { data: updatedUser };
    }

    // If user doesn't exist, create a new one
    if (!user) {
      // Prepare user data with type safety
      const userData: InsertUser = {
        email,
        role,
        authProviders: [provider],
        ...(provider === "google" && picture ? { picture } : {}),
        ...(provider === "credentials" && password
          ? {
              password,
              credentialEmailVerified: true,
            }
          : {}),
      };

      // Create the user and return the result
      const [newUser] = await db
        .insert(usersTable)
        .values(userData)
        .returning();

      return { data: newUser };
    }

    // This should never happen but TypeScript wants a return
    throw new Error("Unexpected state in createUser function");
  } catch (error) {
    console.log("Create user error: ", error);
    throw error;
  }
}
