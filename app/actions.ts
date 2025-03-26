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
      }),
    });

    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.error || "Failed to start ECS task");
    }
    
    // Return the successful response back to the client
    return {
        status: "success", // Add a status field to indicate success
        message: result.message || "Podcast summary creation started successfully!",
        ...submission.reply() // Include the original submission reply for form state
      };
    
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
  } 
}