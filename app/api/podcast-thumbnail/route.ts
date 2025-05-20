import { NextRequest, NextResponse } from "next/server";
import { getYouTubeThumbnail } from "@/lib/get-youtube-thumbnail";
import { downloadThumbnail } from "@/lib/download-thumbnail";
import { uploadThumbnailsToS3 } from "@/lib/upload-thumbnails-to-s3";
import { processThumbnail } from "@/lib/process-thumbnail";

export async function POST(request: NextRequest) {
  try {
    const { videoId, podcastHost, podcastSlug } = await request.json();

    if (!videoId || !podcastHost || !podcastSlug) {
      return NextResponse.json(
        {
          error:
            "Missing required fields: videoId, podcastHost, and podcastSlug are required",
        },
        { status: 400 },
      );
    }

    console.log(`Getting thumbnail for video ID: ${videoId}`);

    // Get thumbnail URL from YouTube
    const { url: thumbnailUrl, extension } = await getYouTubeThumbnail(videoId);

    // Download the thumbnail
    const thumbnailBuffer = await downloadThumbnail(thumbnailUrl);
    console.log(`Downloaded thumbnail from: ${thumbnailUrl}`);

    // Process the thumbnail to create WebP variations
    const processedImages = await processThumbnail(thumbnailBuffer);
    console.log("Created WebP variations of the thumbnail");

    // Upload all images to S3
    const uploadResults = await uploadThumbnailsToS3(
      processedImages,
      podcastSlug,
      extension,
      podcastHost,
    );

    // Return success response with thumbnail URLs and paths
    return NextResponse.json({
      success: true,
      message: "Thumbnail processed and uploaded successfully",
      thumbnailUrl,
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
    });
  } catch (error) {
    console.error("Error processing thumbnail:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 },
    );
  }
}
