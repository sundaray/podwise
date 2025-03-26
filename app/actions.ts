"use server";

import { redirect } from "next/navigation";
import { parseWithZod } from "@conform-to/zod";
import { CreatePodcastSummaryFormSchema } from "@/schema";

export async function createPodcastSummary(
  prevState: unknown,
  formData: FormData,
) {
  // Parse and validate form data using zod schema
  const submission = parseWithZod(formData, {
    schema: CreatePodcastSummaryFormSchema,
  });

  // Return validation errors if any
  if (submission.status !== "success") {
    return submission.reply();
  }

  // Extract form data
  const { videoId, videoTitle, podcastSlug } = submission.value;

  let errorOccurred = false;

  try {
        console.log("Creating podcast summary for:", {
      videoId,
      videoTitle,
      podcastSlug,
    });
    
    // We'll leave this empty for now as mentioned in your instructions
    
  } catch (error) {
    errorOccurred = true;
    if (error instanceof Error) {
      console.error(`[createPodcastSummary] error: `, error.message);
    } else {
      console.error(`[createPodcastSummary] error: `, error);
    }
    return submission.reply({
      formErrors: ["Something went wrong. Please try again."],
    });
  } finally {
    if (!errorOccurred) {
      // Redirect to a success page or dashboard
      redirect("/podcast-summaries");
    }
  }
}