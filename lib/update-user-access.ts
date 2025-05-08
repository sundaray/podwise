import "server-only";

import { usersTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { add } from "date-fns";
import { db } from "@/db";

export async function updateUserAccess(
  email: string,
  planType: "annual" | "lifetime",
) {
  try {
    const now = new Date();

    if (planType === "annual") {
      // Calculate expiration date (1 year from now)
      const expiresAt = add(now, { years: 1 });

      await db
        .update(usersTable)
        .set({
          annualAccess: true,
          annualAccessPurchasedAt: now,
          annualAccessExpiresAt: expiresAt,
        })
        .where(eq(usersTable.email, email));
    } else if (planType === "lifetime") {
      await db
        .update(usersTable)
        .set({
          lifetimeAccess: true,
          lifetimeAccessPurchasedAt: now,
        })
        .where(eq(usersTable.email, email));
    }

    return { success: true };
  } catch (error) {
    console.error(`[updateUserAccess] error:`, error);
    return { success: false, error: "Failed to update user access" };
  }
}
