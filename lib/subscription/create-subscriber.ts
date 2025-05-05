import { db } from "@/db";
import { subscribersTable } from "@/db/schema";
import type { Subscriber, InsertSubscriber } from "@/db/schema";
import { eq } from "drizzle-orm";


export async function createSubscriber(email: string): Promise<{ data: Subscriber }> {
  try {
      const userData: InsertSubscriber = {
        email,
      };

      // Create the user and return the result
      const [newUser] = await db
        .insert(usersTable)
        .values(userData)
        .returning();

      return { data: newUser };

    // This should never happen but TypeScript wants a return
    throw new Error("Unexpected state in createSubscriber function");
  } catch (error) {
    console.log("Create subscriber error: ", error);
    throw error;
  }
}
