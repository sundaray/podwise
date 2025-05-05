"use server";

import { redirect } from "next/navigation";
import { parseWithZod } from "@conform-to/zod";
import { SubscriptionFormSchema } from "@/schema";

import {
  createSubscriptionEmailVerificationToken,
  createSubscriptionEmailVerificationURL,
  isSubscriptionEmailVerified,
  sendSubscriptionVerificationEmail,
} from "@/lib/subscription/subscription-email-verification";
import { createSubscriptionEmailVerificationSession } from "@/lib/subscriptions/session";

/************************************************
 *
 * Subscribe to 5-idea friday
 *
 ************************************************/

export async function subscribe(
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

  let errorOccurred = false;
  let needsSubscriptionEmailVerification = false;

  try {
    const subscriptionEmailVerified = await isSubscriptionEmailVerified(email);

    if (subscriptionEmailVerified) {
      // Subscriber already exists with verified email
      errorOccurred = true
      return submission.reply({
        formErrors: ["User already subscribed."],
      });
    } else {
      // Account either doesn't exist OR exists but email not verified
      // In both cases, we'll proceed with creating/updating and sending verification

      needsSubscriptionEmailVerification = true;

      const token = createSubscriptionEmailVerificationToken();

      const url = createSubscriptionEmailVerificationURL(token);

      await createSubscriptionEmailVerificationSession(email, token);

      await sendSubscriptionVerificationEmail(email, url);
    }
  } catch (error) {
    console.log("Subscribe action error: ", error);
    errorOccurred = true;
    if (error instanceof Error) {
      console.error(`[subscribe] error: `, error.message);
    } else {
      console.error(`[subscribe] error: `, error);
    }
    return submission.reply({
      formErrors: ["Something went wrong. Please try again."],
    });
  } finally {
    if (!errorOccurred) {
      if (needsSubscriptionEmailVerification) {
        redirect("/subscribe/verify-email");
      }
    }
  }
}
