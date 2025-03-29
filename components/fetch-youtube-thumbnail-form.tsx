"use client";

import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { useActionState } from "react";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
  const thumbnailUrl = lastResult?.thumbnailUrl;

  return (
    <div className="px-4 sm:mx-auto sm:max-w-md">
      <h2 className="text-secondary-foreground text-2xl font-semibold tracking-tight">
        Fetch YouTube Thumbnail
      </h2>
      <p className="text-muted-foreground text-sm mb-4">
        Enter a YouTube video ID to fetch and save its thumbnail
      </p>
      <form
        id={form.id}
        onSubmit={form.onSubmit}
        action={formAction}
        noValidate
        aria-describedby={
          successMessage ? "form-success" : form.errors ? "form-error" : undefined
        }
      >
        <SuccessMessage id="form-success" message={successMessage} />
        <ErrorMessage id="form-error" errors={form.errors} />
        <div className="grid gap-4">
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

          <Button type="submit" disabled={isPending} className="mt-2">
            {isPending ? (
              <>
                <Icons.loader className="size-3 animate-spin mr-2" />
                Fetching...
              </>
            ) : (
              "Fetch Thumbnail"
            )}
          </Button>
        </div>
      </form>
      
      {thumbnailUrl && (
        <div className="mt-6">
          <h3 className="text-secondary-foreground text-lg font-medium mb-2">Fetched Thumbnail</h3>
          <div className="rounded-md overflow-hidden">
            <img 
              src={thumbnailUrl} 
              alt="YouTube Thumbnail" 
              className="w-full h-auto"
            />
          </div>
          <p className="text-muted-foreground text-xs mt-2">
            S3 Path: {lastResult?.s3Path}
          </p>
        </div>
      )}
    </div>
  );
}