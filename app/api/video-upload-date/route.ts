import { NextRequest, NextResponse } from "next/server";
import { getYouTubeVideoUploadDate } from "@/lib/get-youtube-video-upload-date";
import { convertYouTubeDateToISO } from "@/lib/convert-youtube-date";

export async function POST(request: NextRequest) {
  try {
    const { videoId } = await request.json();

    if (!videoId) {
      return NextResponse.json(
        { error: "Missing required field: videoId" },
        { status: 400 },
      );
    }

    // Get upload date from YouTube
    const uploadDate = await getYouTubeVideoUploadDate(videoId);

    // Convert to ISO format
    const uploadDateISO = convertYouTubeDateToISO(uploadDate);

    // Return success response with both formats
    return NextResponse.json({
      success: true,
      uploadDate,
      uploadDateISO,
    });
  } catch (error) {
    console.error("Error fetching upload date:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 },
    );
  }
}
