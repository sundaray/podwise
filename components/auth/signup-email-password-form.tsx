"use client";

import { useState, useActionState } from "react";
import Link from "next/link";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { ErrorMessage } from "@/components/auth/error-message";

import { signUpWithEmailAndPassword } from "@/app/credentials-signup-actions";
import { SignUpEmailPasswordFormSchema } from "@/schema";

export function SignUpEmailPasswordForm({ next }: { next: string }) {
  const boundSignUpWithEmailAndPassword = signUpWithEmailAndPassword.bind(
    null,
    next,
  );

  const [lastResult, formAction, isPending] = useActionState(
    boundSignUpWithEmailAndPassword,
    undefined,
  );

  const [form, fields] = useForm({
    lastResult,
    // Validate when field loses focus
    shouldValidate: "onBlur",
    // Re-validate as user types
    shouldRevalidate: "onInput",
    onValidate({ formData }) {
      return parseWithZod(formData, {
        schema: SignUpEmailPasswordFormSchema,
      });
    },
  });

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  function togglePasswordVisibility() {
    setIsPasswordVisible((prevState) => !prevState);
  }

  return (
    <form
      id={form.id}
      onSubmit={form.onSubmit}
      action={formAction}
      noValidate
      aria-describedby={form.errors ? "form-error" : undefined}
    >
      {form.errors && (
        <ErrorMessage id="form-error" errors={form.errors} className="pb-4" />
      )}
      <div className="grid gap-2">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            name="email"
            className="mt-2"
            defaultValue={lastResult?.initialValue?.email as string}
            aria-invalid={fields.email.errors ? "true" : undefined}
            aria-describedby={fields.email.errors ? "email-error" : undefined}
          />
          <ErrorMessage
            id="email-error"
            errors={fields.email.errors}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              type={isPasswordVisible ? "text" : "password"}
              name="password"
              className="mt-2"
              defaultValue={lastResult?.initialValue?.password as string}
              aria-invalid={fields.password.errors ? "true" : undefined}
              aria-describedby={
                fields.password.errors ? "password-error" : undefined
              }
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              aria-label={isPasswordVisible ? "Hide password" : "Show password"}
              aria-pressed={isPasswordVisible}
              className="absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-lg text-gray-500 outline-offset-0 transition-colors hover:text-gray-600 focus:z-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-sky-600 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isPasswordVisible ? (
                <Icons.eyeOff size={16} strokeWidth={2} aria-hidden="true" />
              ) : (
                <Icons.eye size={16} strokeWidth={2} aria-hidden="true" />
              )}
            </button>
          </div>
          <ErrorMessage
            id="password-error"
            errors={fields.password.errors}
            className="mt-1"
          />
        </div>
        <Button
          type="submit"
          disabled={isPending}
          className="h-10 rounded-full"
        >
          {isPending ? (
            <>
              <Icons.loader className="size-3 animate-spin" />
              Signing up...
            </>
          ) : (
            "Sign up"
          )}
        </Button>
        <div className="mt-6 text-center text-sm font-medium">
          <span className="text-gray-500">Already have an account? </span>
          <Link
            href="/signin"
            className="text-sky-600 transition-colors hover:text-sky-700"
          >
            Sign in
          </Link>
        </div>
      </div>
    </form>
  );
}
