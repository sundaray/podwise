import { db } from "@/db";
import { subscribersTable } from "@/db/schema";
import type { Subscriber, InsertSubscriber } from "@/db/schema";

export async function createSubscriber(
  email: string,
): Promise<{ data: Subscriber }> {
  try {
    const userData: InsertSubscriber = {
      email,
      emailVerified: true,
    };

    const [subscriber] = await db
      .insert(subscribersTable)
      .values(userData)
      .returning();

    return { data: subscriber };
  } catch (error) {
    console.error("Create subscriber error: ", error);
    throw error;
  }
}
