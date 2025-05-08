"use client";

import { useActionState } from "react";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { ErrorMessage } from "@/components/auth/error-message";
import { createLifetimeCheckoutSession } from "@/app/premium-actions";

const formSchema = z.object({});

export function LifetimeAccessForm() {
  const [lastResult, formAction, isPending] = useActionState(
    createLifetimeCheckoutSession,
    undefined,
  );

  const [form, fields] = useForm({
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, {
        schema: formSchema,
      });
    },
  });

  return (
    <form id={form.id} onSubmit={form.onSubmit} action={formAction} noValidate>
      {form.errors && (
        <ErrorMessage id="form-error" errors={form.errors} className="pb-4" />
      )}
      <Button
        type="submit"
        className="mt-10 block w-full rounded-full bg-sky-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-xs hover:bg-sky-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-700"
        disabled={isPending}
      >
        {isPending ? (
          <div className="flex items-center justify-center">
          <Icons.loader className="mr-2 size-4 animate-spin" />
            Processing...
          </div>
        ) : (
          "Purchase Lifetime"
        )}
      </Button>
    </form>
  );
}
