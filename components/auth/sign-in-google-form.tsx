"use client";

import { useActionState } from "react";
import { useSearchParams } from "next/navigation";

import { Icons } from "@/components/icons";
import { signInWithGoogle } from "@/app/google-actions";
import { ErrorMessage } from "@/components/auth/error-message";

export function SignInGoogleForm() {
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/";

  const boundGoogleSignIn = signInWithGoogle.bind(null, next);

  const [formState, formAction, isPending] = useActionState(
    boundGoogleSignIn,
    undefined,
  );

  return (
    <form action={formAction}>
      {formState?.errors && (
        <ErrorMessage
          id="form-error"
          errors={formState?.errors}
          className="pb-4"
        />
      )}
      <button
        type="submit"
        disabled={isPending}
        className="item-center flex w-full justify-center rounded border border-2 border-gray-200 py-2 text-sm font-medium text-gray-900 shadow-xs transition-colors hover:bg-gray-100"
      >
        <Icons.google className="mr-2 inline-block size-5" />
        Sign in with Google
      </button>
    </form>
  );
}
