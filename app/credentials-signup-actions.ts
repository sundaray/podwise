"use server";

import { redirect } from "next/navigation";
import { parseWithZod } from "@conform-to/zod";
import { SignUpEmailPasswordFormSchema } from "@/schema";

import {
  createEmailVerificationToken,
  createEmailVerificationURL,
  isEmailVerified,
  sendVerificationEmail,
} from "@/lib/auth/credentials/email-verification";
import { hashPassword } from "@/lib/auth/credentials/hash-password";
import { createEmailVerificationSession } from "@/lib/auth/credentials/session";

/************************************************
 *
 * Sign Up With Email and Password
 *
 ************************************************/

export async function signUpWithEmailAndPassword(
  next: string,
  prevState: unknown,
  formData: FormData,
) {
  // const headersList = await headers();
  // const clientIP = (await headersList).get("x-forwarded-for") ?? "127.0.0.1";

  // check rate limit
  // const rateLimitResult = await authRateLimit(clientIP);

  // Parse and validate form data using zod schema
  const submission = parseWithZod(formData, {
    schema: SignUpEmailPasswordFormSchema,
  });

  // Return validation errors if any
  if (submission.status !== "success") {
    return submission.reply();
  }

  // Return rate limit error if any
  // if (rateLimitResult.limited) {
  //   return submission.reply({
  //     formErrors: [rateLimitResult.message],
  //   });
  // }

  // Extract email and password
  const { email, password } = submission.value;

  let errorOccurred = false;
  let needsEmailVerification = false;

  try {
    const emailVerified = await isEmailVerified(email);

    if (emailVerified) {
      // Account already exists with verified email
      return submission.reply({
        formErrors: ["Account already exists. Please sign in."],
      });
    } else {
      // Account either doesn't exist OR exists but email not verified
      // In both cases, we'll proceed with creating/updating and sending verification

      needsEmailVerification = true;

      const token = createEmailVerificationToken();

      const url = createEmailVerificationURL(token);

      const hashedPassword = await hashPassword(password);

      await createEmailVerificationSession(email, hashedPassword, token);

      await sendVerificationEmail(email, url);
    }
  } catch (error) {
    console.log("Credentials action error: ", error);
    errorOccurred = true;
    if (error instanceof Error) {
      console.error(`[signUpWithEmailAndPassword] error: `, error.message);
    } else {
      console.error(`[signUpWithEmailAndPassword] error: `, error);
    }
    return submission.reply({
      formErrors: ["Something went wrong. Please try again."],
    });
  } finally {
    if (!errorOccurred) {
      if (needsEmailVerification) {
        redirect("/signup/verify-email");
      } else {
        redirect(next);
      }
    }
  }
}
