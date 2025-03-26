import { z } from "zod";

export const CreatePodcastSummaryFormSchema = z.object({
  videoId: z
    .string({ required_error: "YouTube video ID is required" }),
  
  videoTitle: z
    .string({ required_error: "YouTube video title is required" }),
  
  podcastSlug: z
    .string({ required_error: "Podcast slug is required" })
});

