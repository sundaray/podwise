import { NextRequest, NextResponse } from "next/server";
import { getYouTubeThumbnail } from "@/lib/get-youtube-thumbnail";
import { downloadThumbnail } from "@/lib/download-thumbnail";
import { uploadThumbnailToS3 } from "@/lib/upload-thumbnail-to-s3";

export async function POST(request: NextRequest) {
  try {
    const { videoId, podcastHost, podcastSlug } = await request.json();
    
    if (!videoId || !podcastHost || !podcastSlug) {
      return NextResponse.json(
        { error: "Missing required fields: videoId, podcastHost, and podcastSlug are required" },
        { status: 400 }
      );
    }
    
    console.log(`Getting thumbnail for video ID: ${videoId}`);
    
    // Get thumbnail from YouTube
    const { url: thumbnailUrl, extension } = await getYouTubeThumbnail(videoId);
    
    // Download the thumbnail
    const thumbnailBuffer = await downloadThumbnail(thumbnailUrl);
    console.log(`Downloaded thumbnail from: ${thumbnailUrl}`);
    
    // Upload to S3
    const s3Path = await uploadThumbnailToS3(thumbnailBuffer, podcastSlug, extension, podcastHost);
    
    // Return success response with thumbnail URL and S3 path
    return NextResponse.json({ 
      success: true, 
      thumbnailUrl, 
      s3Path 
    });
    
  } catch (error) {
    console.error("Error processing thumbnail:", error);
    
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error occurred" },
      { status: 500 }
    );
  }
}