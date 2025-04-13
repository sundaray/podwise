import { z } from "zod";

export const CreatePodcastSummaryFormSchema = z.object({
  videoId: z.string({ required_error: "YouTube video ID is required" }),

  videoTitle: z.string({ required_error: "YouTube video title is required" }),

  podcastSlug: z.string({ required_error: "Podcast slug is required" }),

  podcastHost: z.enum(
    ["mel-robbins", "joe-rogan", "jay-shetty", "chris-williamson"],
    {
      required_error: "Podcast host is required",
    },
  ),
});

export const FetchYouTubeThumbnailFormSchema = z.object({
  videoId: z.string({ required_error: "YouTube video ID is required" }),

  podcastSlug: z.string({ required_error: "Podcast slug is required" }),

  podcastHost: z.enum(
    [
      "mel-robbins",
      "chris-williamson",
      "jay-shetty",
      "lewis-howes",
      "doac",
      "jack-neel",
      "simon-sinek",
      "tim-ferriss",
    ],
    {
      required_error: "Podcast host is required",
    },
  ),
});
