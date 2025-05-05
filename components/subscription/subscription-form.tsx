"use client";

import { useActionState } from "react";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { ErrorMessage } from "@/components/auth/error-message";

import { subscribeToNewsletter } from "@/app/subscription-actions";
import { SubscriptionFormSchema } from "@/schema";

export function SubscriptionForm() {
  const [lastResult, formAction, isPending] = useActionState(
    subscribeToNewsletter,
    undefined,
  );

  const [form, fields] = useForm({
    lastResult,
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
    onValidate({ formData }) {
      return parseWithZod(formData, {
        schema: SubscriptionFormSchema,
      });
    },
  });

  return (
    <div className="rounded-xl border border-gray-200 bg-gray-100 p-8">
      <h2 className="mb-2 text-center text-2xl font-bold text-gray-900">
        5-idea Friday
      </h2>
      <p className="text-md mb-6 text-center text-gray-600">
        5 ideas from the world's best thinkers delivered to your inbox every
        Friday.
      </p>
      <form
        id={form.id}
        onSubmit={form.onSubmit}
        action={formAction}
        noValidate
        className="flex flex-row gap-x-4"
      >
        {form.errors && (
          <ErrorMessage id="form-error" errors={form.errors} className="pb-4" />
        )}

        <div className="relative flex-grow">
          {/* INPUT --------------------------------------------------------- */}
          <Input
            id="email"
            type="email"
            name="email"
            placeholder="Email"
            defaultValue={lastResult?.initialValue?.email as string}
            className="peer h-12 w-full rounded-full pl-5 placeholder:opacity-0"
            aria-invalid={fields.email.errors ? "true" : undefined}
            aria-describedby={fields.email.errors ? "email-error" : undefined}
          />

          {/* FLOATING LABEL ------------------------------------------------ */}
          <label
            htmlFor="email"
            className="pointer-events-none absolute -top-2.5 left-4 bg-gray-100 px-0.5 text-sm transition-all peer-placeholder-shown:top-[11px] peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-gray-600"
          >
            Email
          </label>

          {/* FIELD ERROR --------------------------------------------------- */}
          <ErrorMessage
            id="email-error"
            errors={fields.email.errors}
            className="mt-1 ml-5"
          />

          {/* SUBMIT BUTTON (perfectly centred now) ------------------------ */}
          <Button
            type="submit"
            disabled={isPending}
            className="absolute top-1.5 right-2 rounded-full"
          >
            {isPending ? (
              <Icons.loader className="size-4 animate-spin" />
            ) : (
              "Subscribe"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
