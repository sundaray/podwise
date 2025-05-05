"use server";

import { redirect } from "next/navigation";
import { parseWithZod } from "@conform-to/zod";
import chalk from "chalk";
import { hashPassword } from "@/lib/auth/credentials/hash-password";
import {
  doesPasswordResetSessionExist,
  getPasswordResetSession,
} from "@/lib/auth/credentials/session";

/************************************************
 *
 * Forgot user password
 *
 ************************************************/
import { ForgotPasswordFormSchema } from "@/schema";

import {
  createPasswordResetToken,
  createPasswordResetURL,
  sendPasswordResetEmail,
} from "@/lib/auth/credentials/password-reset";
import { createPasswordResetSession } from "@/lib/auth/credentials/session";

export async function forgotPassword(prevState: unknown, formData: FormData) {
  // const headersList = await headers();
  // const clientIP = (await headersList).get("x-forwarded-for") ?? "127.0.0.1";

  // check rate limit
  // const rateLimitResult = await authRateLimit(clientIP);

  // Parse and validate form data using zod schema
  const submission = parseWithZod(formData, {
    schema: ForgotPasswordFormSchema,
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

  const { email } = submission.value;

  let errorOccurred = false;

  try {
    const token = createPasswordResetToken();

    const url = createPasswordResetURL(token);

    await createPasswordResetSession(email, token);

    await sendPasswordResetEmail(email, url);
  } catch (error) {
    errorOccurred = true;

    if (error instanceof Error) {
      console.error(chalk.red("[forgotPassword] error: "), error.message);
    } else {
      console.error(chalk.red("[forgotPassword] error: "), error);
    }
    return submission.reply({
      formErrors: ["Something went wrong. Please try again."],
    });
  } finally {
    if (!errorOccurred) {
      // Redirect to success page if no errors occurred
      redirect("/forgot-password/check-email");
    }
  }
}
/************************************************
 *
 * Reset user password
 *
 ************************************************/
import { updatePassword } from "@/lib/auth/credentials/update-password";
import { ResetPasswordFormSchema } from "@/schema";
import { deletePasswordResetSession } from "@/lib/auth/credentials/session";

export async function resetPassword(prevState: unknown, formData: FormData) {
  // const headersList = await headers();
  // const clientIP = (await headersList).get("x-forwarded-for") ?? "127.0.0.1";

  // check rate limit
  // const rateLimitResult = await authRateLimit(clientIP);

  // Parse and validate form data using zod schema
  const submission = parseWithZod(formData, {
    schema: ResetPasswordFormSchema,
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

  // Extract validated password
  const { newPassword } = submission.value;

  let errorOccurred = false;

  try {
    // Verify that there's an active password reset session
    const sessionExists = await doesPasswordResetSessionExist();
    if (!sessionExists) {
      errorOccurred = true;
      return submission.reply({
        formErrors: [
          "Your password reset session has expired. Please request a new password reset link.",
        ],
      });
    }

    // Get email from the password reset session
    const { email } = await getPasswordResetSession();

    // Hash the new password
    const hashedPassword = await hashPassword(newPassword);

    // Update the password in the database
    await updatePassword(email, hashedPassword);

    // Delete the password reset session
    await deletePasswordResetSession();
  } catch (error) {
    if (error instanceof Error) {
      console.error(chalk.red("[resetPassword] error: "), error.message);
    } else {
      console.error(chalk.red("[resetPassword] error: "), error);
    }
    errorOccurred = true;
    return submission.reply({
      formErrors: ["Something went wrong. Please try again."],
    });
  } finally {
    if (!errorOccurred) {
      // Redirect to success page if no errors occurred
      redirect("/reset-password/success");
    }
  }
}
