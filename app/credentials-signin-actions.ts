"use server";

import { redirect } from "next/navigation";
import { parseWithZod } from "@conform-to/zod";
import { SignInEmailPasswordFormSchema } from "@/schema";

import { isEmailVerified } from "@/lib/auth/credentials/email-verification";
import { verifyPassword } from "@/lib/auth/credentials/verify-password";
import { createUserSession } from "@/lib/auth/session";
import { getUserRole } from "@/lib/auth/get-user-role";
import { getAccessStatus } from "@/lib/get-access-status";

/************************************************
 *
 * Sign In With Email and Password
 *
 ************************************************/

export async function signInWithEmailAndPassword(
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
    schema: SignInEmailPasswordFormSchema,
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

  try {
    const emailVerified = await isEmailVerified(email);

    if (!emailVerified) {
      errorOccurred = true;
      // Account doesn't exist or is not verified
      return submission.reply({
        formErrors: ["User not found. Sign up to create an account."],
      });
    }

    // Email is verified, now check password
    const passwordVerified = await verifyPassword(email, password);

    if (!passwordVerified) {
      errorOccurred = true;
      return submission.reply({
        formErrors: ["Incorrect email or password."],
      });
    }

    // Both email and password are correct, create session
    const { role } = await getUserRole(email);
    const { annualAccessStatus, lifetimeAccessStatus } =
      await getAccessStatus(email);

    await createUserSession(
      email,
      role,
      annualAccessStatus,
      lifetimeAccessStatus,
    );
  } catch (error) {
    console.log("Credentials action error: ", error);
    errorOccurred = true;
    if (error instanceof Error) {
      console.error(`[signInWithEmailAndPassword] error: `, error.message);
    } else {
      console.error(`[signInWithEmailAndPassword] error: `, error);
    }
    return submission.reply({
      formErrors: ["Something went wrong. Please try again."],
    });
  } finally {
    if (!errorOccurred) {
      redirect(next);
    }
  }
}
