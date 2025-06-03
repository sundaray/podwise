"use client";

import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { useActionState } from "react";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { ErrorMessage } from "@/components/auth/error-message";
import { SuccessMessage } from "@/components/success-message";

import { uploadBlogImage } from "@/app/actions";
import { BlogImageUploadFormSchema } from "@/schema";

export function BlogImageUploadForm() {
  const [lastResult, formAction, isPending] = useActionState(
    uploadBlogImage,
    undefined,
  );

  const [form, fields] = useForm({
    lastResult,
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
    onValidate({ formData }) {
      return parseWithZod(formData, {
        schema: BlogImageUploadFormSchema,
      });
    },
  });

  const successMessage = lastResult?.success ? lastResult.message : null;

  return (
    <div className="px-4 sm:mx-auto sm:max-w-md">
      <h2 className="text-secondary-foreground text-2xl font-semibold tracking-tight">
        Upload Blog Image
      </h2>
      <p className="text-muted-foreground mb-4 text-sm">
        Upload an image to process and save for blog use
      </p>
      <form
        id={form.id}
        onSubmit={form.onSubmit}
        action={formAction}
        noValidate
        aria-describedby={
          successMessage
            ? "form-success"
            : form.errors
              ? "form-error"
              : undefined
        }
      >
        <SuccessMessage id="form-success" message={successMessage} />
        <ErrorMessage id="form-error" errors={form.errors} />
        <div className="grid gap-2">
          {/* File upload field */}
          <div className="mt-4 grid gap-1">
            <Label htmlFor="image">Image file (PNG or JPG)</Label>
            <Input
              id="image"
              type="file"
              name="image"
              accept="image/png,image/jpeg,image/jpg"
              aria-invalid={fields.image.errors ? "true" : undefined}
              aria-describedby={fields.image.errors ? "image-error" : undefined}
            />
            <ErrorMessage id="image-error" errors={fields.image.errors} />
          </div>

          <Button type="submit" disabled={isPending}>
            {isPending ? (
              <>
                <Icons.loader className="mr-2 size-3 animate-spin" />
                Processing...
              </>
            ) : (
              "Process and Upload Image"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
