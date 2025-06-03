"use server";

import chalk from "chalk";
import { parseWithZod } from "@conform-to/zod";
import {
  CreatePodcastSummaryFormSchema,
  FetchYouTubeThumbnailFormSchema,
} from "@/schema";
import { BlogImageUploadFormSchema } from "@/schema";
import { processBlogImage } from "@/lib/process-blog-image";
import { uploadBlogImagesToS3 } from "@/lib/upload-blog-images-to-s3";

import { SubmissionResult } from "@conform-to/dom";

type PodcastSummaryResult = SubmissionResult<string[]> & {
  success?: boolean;
  message?: string;
};

export async function createPodcastSummary(
  prevState: unknown,
  formData: FormData,
): Promise<PodcastSummaryResult> {
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
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/create-podcast-summary`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          videoId,
          videoTitle,
          podcastSlug,
          podcastHost,
        }),
      },
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || "Failed to start ECS task");
    }

    return {
      ...submission.reply({ resetForm: true }),
      success: true,
      message: result.message,
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

type ThumbnailResult = SubmissionResult<string[]> & {
  success?: boolean;
  message?: string;
};

export async function fetchYouTubeThumbnail(
  prevState: unknown,
  formData: FormData,
): Promise<ThumbnailResult> {
  // Parse and validate form data
  const submission = parseWithZod(formData, {
    schema: FetchYouTubeThumbnailFormSchema,
  });

  if (submission.status !== "success") {
    return submission.reply();
  }

  const { videoId, podcastHost, podcastSlug } = submission.value;

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/podcast-thumbnail`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ videoId, podcastHost, podcastSlug }),
      },
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || "Failed to fetch YouTube thumbnail");
    }

    return {
      ...submission.reply({ resetForm: true }),
      success: true,
      message: "Successfully fetched and saved YouTube thumbnail",
    };
  } catch (error) {
    if (error instanceof Error) {
      console.error(
        chalk.red("[fetchYouTubeThumbnail] error: "),
        error.message,
      );
    } else {
      console.error(chalk.red("[fetchYouTubeThumbnail] error: "), error);
    }
    return submission.reply({
      formErrors: ["Something went wrong. Please try again."],
    });
  }
}

import { FetchYouTubeUploadDateFormSchema } from "@/schema";

// Type for the result of the fetchYouTubeUploadDate action
type UploadDateResult = SubmissionResult & {
  success?: boolean;
  message?: string;
  uploadDate?: string;
};

export async function fetchYouTubeUploadDate(
  prevState: unknown,
  formData: FormData,
): Promise<UploadDateResult> {
  // Parse and validate form data
  const submission = parseWithZod(formData, {
    schema: FetchYouTubeUploadDateFormSchema,
  });

  if (submission.status !== "success") {
    return submission.reply();
  }

  const { videoId } = submission.value;

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/video-upload-date`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ videoId }),
      },
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || "Failed to fetch YouTube upload date");
    }

    return {
      ...submission.reply(),
      success: true,
      message: "Successfully fetched YouTube video upload date",
      uploadDate: result.uploadDate,
    };
  } catch (error) {
    if (error instanceof Error) {
      console.error(
        chalk.red("[fetchYouTubeUploadDate] error: "),
        error.message,
      );
    } else {
      console.error(chalk.red("[fetchYouTubeUploadDate] error: "), error);
    }
    return submission.reply({
      formErrors: ["Something went wrong. Please try again."],
    });
  }
}

type BlogImageResult = SubmissionResult & {
  success?: boolean;
  message?: string;
  paths?: {
    jpg: {
      original: string;
      large: string;
      medium: string;
      small: string;
      srcset: string;
    };
    webp: {
      original: string;
      large: string;
      medium: string;
      small: string;
      srcset: string;
    };
  };
};

export async function uploadBlogImage(
  prevState: unknown,
  formData: FormData,
): Promise<BlogImageResult> {
  // Parse and validate form data
  const submission = parseWithZod(formData, {
    schema: BlogImageUploadFormSchema,
  });

  if (submission.status !== "success") {
    return submission.reply();
  }

  const { image } = submission.value;

  try {
    // Get the original filename without extension
    const originalName = image.name.replace(/\.[^/.]+$/, "");

    // Convert file to buffer
    const arrayBuffer = await image.arrayBuffer();
    const imageBuffer = Buffer.from(arrayBuffer);

    console.log(`Processing blog image: ${image.name}`);

    // Process the image to create JPG and WebP variations
    const processedImages = await processBlogImage(imageBuffer);
    console.log("Created JPG and WebP variations of the blog image");

    // Upload all images to S3
    const uploadResults = await uploadBlogImagesToS3(
      processedImages,
      originalName,
    );

    console.log(`Successfully uploaded blog image: ${originalName}`);

    return {
      ...submission.reply({ resetForm: true }),
      success: true,
      message: `Successfully processed and uploaded image: ${originalName}`,
      paths: {
        jpg: {
          original: uploadResults.originalJpg,
          large: uploadResults.jpgLarge,
          medium: uploadResults.jpgMedium,
          small: uploadResults.jpgSmall,
          srcset: uploadResults.jpgSrcset,
        },
        webp: {
          original: uploadResults.webpOriginal,
          large: uploadResults.webpLarge,
          medium: uploadResults.webpMedium,
          small: uploadResults.webpSmall,
          srcset: uploadResults.webpSrcset,
        },
      },
    };
  } catch (error) {
    if (error instanceof Error) {
      console.error(chalk.red("[uploadBlogImage] error: "), error.message);
    } else {
      console.error(chalk.red("[uploadBlogImage] error: "), error);
    }
    return submission.reply({
      formErrors: ["Something went wrong. Please try again."],
    });
  }
}
