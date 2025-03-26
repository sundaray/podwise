"use client";

import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { useActionState } from "react";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { ErrorMessage } from "@/components/error-message";
import { SuccessMessage } from "@/components/success-message"

import { createPodcastSummary } from "@/app/actions";
import { CreatePodcastSummaryFormSchema } from "@/schema";

export function CreatePodcastSummaryForm() {

  // Set up form state using useActionState
  const [lastResult, formAction, isPending] = useActionState(
    createPodcastSummary,
    undefined,
  );

  // Configure form with validation
  const [form, fields] = useForm({
    lastResult,
    // Validate when field loses focus
    shouldValidate: "onBlur",
    // Re-validate as user types
    shouldRevalidate: "onInput",
    onValidate({ formData }) {
      return parseWithZod(formData, {
        schema: CreatePodcastSummaryFormSchema,
      });
    },
  });

  const successMessage = lastResult?.success ? lastResult.message : null;

  return (
    <div className="px-4 sm:mx-auto sm:max-w-md">
      <h2 className="text-secondary-foreground text-2xl font-semibold tracking-tight">
        Create Podcast Summary
      </h2>
      <p className="text-muted-foreground mb-10 text-sm">
        Enter the YouTube video details to create a podcast summary
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
        {successMessage && <SuccessMessage id="form-success" message={successMessage} />}
        {form.errors && <ErrorMessage id="form-error" errors={form.errors} />}
        <div className="mt-4 grid gap-4">
          {/* YouTube Video ID field */}
          <div className="grid gap-2">
            <Label htmlFor="videoId">YouTube video ID</Label>
            <Input
              id="videoId"
              type="text"
              name="videoId"
              defaultValue={lastResult?.initialValue?.videoId as string}
              aria-invalid={fields.videoId.errors ? "true" : undefined}
              aria-describedby={fields.videoId.errors ? "videoId-error" : undefined}
            />
            <ErrorMessage id="videoId-error" errors={fields.videoId.errors} />
          </div>

          {/* YouTube video title field */}
          <div className="grid gap-2">
            <Label htmlFor="videoTitle">YouTube video title</Label>
            <Input
              id="videoTitle"
              type="text"
              name="videoTitle"
              defaultValue={lastResult?.initialValue?.videoTitle as string}
              aria-invalid={fields.videoTitle.errors ? "true" : undefined}
              aria-describedby={fields.videoTitle.errors ? "videoTitle-error" : undefined}
            />
            <ErrorMessage id="videoTitle-error" errors={fields.videoTitle.errors} />
          </div>

          {/* Podcast slug field */}
          <div className="grid gap-2">
            <Label htmlFor="podcastSlug">Podcast slug</Label>
            <Input
              id="podcastSlug"
              type="text"
              name="podcastSlug"
              defaultValue={lastResult?.initialValue?.podcastSlug as string}
              aria-invalid={fields.podcastSlug.errors ? "true" : undefined}
              aria-describedby={fields.podcastSlug.errors ? "podcastSlug-error" : undefined}
            />
            <ErrorMessage id="podcastSlug-error" errors={fields.podcastSlug.errors} />
          </div>

          {/* Submit button */}
          <Button type="submit" disabled={isPending} className="mt-2">
            {isPending ? (
              <>
                <Icons.loader className="size-3 animate-spin mr-2" />
                Creating...
              </>
            ) : (
              "Create Summary"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}