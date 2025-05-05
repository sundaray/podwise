"use server";

import { parseWithZod } from "@conform-to/zod";
import { eq } from "drizzle-orm";
import { SubscriptionFormSchema } from "@/schema";
import { db } from "@/db";
import { subscribersTable } from "@/db/schema";

/************************************************
 *
 * Subscribe to Newsletter
 *
 ************************************************/

export async function subscribeToNewsletter(
  prevState: unknown,
  formData: FormData,
) {
  // Parse and validate form data using zod schema
  const submission = parseWithZod(formData, {
    schema: SubscriptionFormSchema,
  });

  // Return validation errors if any
  if (submission.status !== "success") {
    return submission.reply();
  }

  // Extract email
  const { email } = submission.value;

  try {
    // Check if email already exists
    const existingSubscriber = await db
      .select()
      .from(subscribersTable)
      .where(eq(subscribersTable.email, email))
      .limit(1);

    if (existingSubscriber.length > 0) {
      return submission.reply({
        formErrors: ["This email is already subscribed."],
      });
    }

    // Insert new subscriber
    await db.insert(subscribersTable).values({
      email,
    });

    // Return success response
    return submission.reply({
      resetForm: true,
    });
  } catch (error) {
    console.error("[subscribeToNewsletter] error: ", error);

    if (error instanceof Error) {
      console.error(`[subscribeToNewsletter] error message: `, error.message);
    }

    return submission.reply({
      formErrors: ["Something went wrong. Please try again."],
    });
  }
}
