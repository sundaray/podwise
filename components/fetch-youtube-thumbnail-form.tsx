"use client";

import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { useActionState } from "react";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Icons } from "@/components/icons";
import { ErrorMessage } from "@/components/error-message";
import { SuccessMessage } from "@/components/success-message";

import { fetchYouTubeThumbnail } from "@/app/actions";
import { FetchYouTubeThumbnailFormSchema } from "@/schema";

export function FetchYouTubeThumbnailForm() {
  const [lastResult, formAction, isPending] = useActionState(
    fetchYouTubeThumbnail,
    undefined,
  );

  const [form, fields] = useForm({
    lastResult,
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
    onValidate({ formData }) {
      return parseWithZod(formData, {
        schema: FetchYouTubeThumbnailFormSchema,
      });
    },
  });

  const successMessage = lastResult?.success ? lastResult.message : null;

  return (
    <div className="px-4 sm:mx-auto sm:max-w-md">
      <h2 className="text-secondary-foreground text-2xl font-semibold tracking-tight">
        Fetch YouTube Thumbnail
      </h2>
      <p className="text-muted-foreground mb-4 text-sm">
        Enter a YouTube video ID to fetch and save its thumbnail
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
        <div className="grid gap-4">
          {/* YouTube Video ID field */}
          <div className="grid gap-2">
            <Label htmlFor="videoId">YouTube video ID</Label>
            <Input
              id="videoId"
              type="text"
              name="videoId"
              defaultValue={lastResult?.initialValue?.videoId as string}
              aria-invalid={fields.videoId.errors ? "true" : undefined}
              aria-describedby={
                fields.videoId.errors ? "videoId-error" : undefined
              }
            />
            <ErrorMessage id="videoId-error" errors={fields.videoId.errors} />
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
              aria-describedby={
                fields.podcastSlug.errors ? "podcastSlug-error" : undefined
              }
            />
            <ErrorMessage
              id="podcastSlug-error"
              errors={fields.podcastSlug.errors}
            />
          </div>

          {/* Podcast host field */}
          <div className="grid gap-2">
            <Label htmlFor="podcastHost">Podcast host</Label>
            <Select name="podcastHost">
              <SelectTrigger
                id="podcastHost"
                className="w-full"
                aria-invalid={fields.podcastHost.errors ? "true" : undefined}
                aria-describedby={
                  fields.podcastHost.errors ? "podcastHost-error" : undefined
                }
              >
                <SelectValue placeholder="Select a host" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mel-robbins">Mel Robbins</SelectItem>
                <SelectItem value="chris-williamson">Chris Williamson</SelectItem>
                <SelectItem value="tim-ferriss">Tim Ferriss</SelectItem>
              </SelectContent>
            </Select>
            <ErrorMessage
              id="podcastHost-error"
              errors={fields.podcastHost.errors}
            />
          </div>

          <Button type="submit" disabled={isPending} className="mt-2">
            {isPending ? (
              <>
                <Icons.loader className="mr-2 size-3 animate-spin" />
                Fetching...
              </>
            ) : (
              "Fetch Thumbnail"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
