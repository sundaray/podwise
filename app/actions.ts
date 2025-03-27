"use server";

import chalk from "chalk"
import { parseWithZod } from "@conform-to/zod";
import { CreatePodcastSummaryFormSchema } from "@/schema";
import { SubmissionResult } from "@conform-to/dom";

type PodcastSummaryResult = SubmissionResult<string[]> & {
    success?:boolean,
    message?: string;
};

export async function createPodcastSummary(
  prevState: unknown,
  formData: FormData,
):Promise<PodcastSummaryResult> {
  // Parse and validate form data using zod schema
  const submission = parseWithZod(formData, {
    schema: CreatePodcastSummaryFormSchema,
  });

  // Return validation errors if any
  if (submission.status !== "success") {
    return submission.reply();
  }

  // Extract form data
  const { videoId, videoTitle, podcastSlug, podcastHost } = submission.value;

  try {
    
    // Call the route handler to initiate the ECS task
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/create-podcast-summary`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        videoId,
        videoTitle,
        podcastSlug,
        podcastHost
      }),
    });

    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.error || "Failed to start ECS task");
    }

    return {
        ...submission.reply({resetForm: true}),
        success: true,
        message: result.message
      };
    
    
  } catch (error) {
    if (error instanceof Error) {
      console.error(chalk.red("[createPodcastSummary] error: "), error.message);
    } else {
      console.error(chalk.red("[createPodcastSummary] error: "), error);
    }
    return submission.reply({
      formErrors: ["Something went wrong. Please try again."],
    });
  } 
}