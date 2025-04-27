"use client";

import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { useActionState } from "react";
import { useRef } from "react";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { ErrorMessage } from "@/components/auth/error-message";
import { SuccessMessage } from "@/components/success-message";

import { fetchYouTubeUploadDate } from "@/app/actions";
import { FetchYouTubeUploadDateFormSchema } from "@/schema";
import { convertYouTubeDateToISO } from "@/lib/convert-youtube-date";

export function VideoUploadDateForm() {
  const [lastResult, formAction, isPending] = useActionState(
    fetchYouTubeUploadDate,
    undefined,
  );

  const isoDateRef = useRef<HTMLInputElement>(null);

  const [form, fields] = useForm({
    lastResult,
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
    onValidate({ formData }) {
      return parseWithZod(formData, {
        schema: FetchYouTubeUploadDateFormSchema,
      });
    },
  });

  const successMessage = lastResult?.success ? lastResult.message : null;
  const uploadDate = lastResult?.uploadDate ? lastResult.uploadDate : null;

  // Convert the human-readable date to ISO format
  const isoDate = uploadDate ? convertYouTubeDateToISO(uploadDate) : null;

  // Function to copy ISO date to clipboard
  const copyISODate = () => {
    if (isoDateRef.current) {
      isoDateRef.current.select();
      document.execCommand("copy");
    }
  };

  return (
    <div className="px-4 sm:mx-auto sm:max-w-md">
      <h2 className="text-secondary-foreground text-2xl font-semibold tracking-tight">
        Fetch YouTube Video Upload Date
      </h2>
      <p className="text-muted-foreground mb-4 text-sm">
        Enter a YouTube video ID to fetch its upload date
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
          {/* YouTube Video ID field */}
          <div className="mt-4 grid gap-1">
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

          <Button type="submit" disabled={isPending}>
            {isPending ? (
              <>
                <Icons.loader className="mr-2 size-3 animate-spin" />
                Fetching...
              </>
            ) : (
              "Fetch Upload Date"
            )}
          </Button>
        </div>
      </form>

      {uploadDate && (
        <div className="mt-4 space-y-4">
          <div className="bg-muted rounded-md p-4">
            <h3 className="text-lg font-medium">Human-Readable Format</h3>
            <p className="mt-1">{uploadDate}</p>
          </div>

          <div className="bg-muted rounded-md p-4">
            <h3 className="text-lg font-medium">
              ISO 8601 Format (for storage)
            </h3>
            <div className="mt-1 flex items-center space-x-2">
              <Input
                ref={isoDateRef}
                readOnly
                value={isoDate || ""}
                className="font-mono text-sm"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={copyISODate}
              >
                <Icons.copy className="size-4" />
              </Button>
            </div>
            <p className="text-muted-foreground mt-2 text-xs">
              Use this format in your podcast list for the videoUploadedAt field
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
