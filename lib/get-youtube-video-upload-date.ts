/**
 * Fetches the upload date of a YouTube video using the YouTube Data API v3
 * @param videoId The YouTube video ID
 * @returns A formatted string with the video's upload date and time
 */
export async function getYouTubeVideoUploadDate(
  videoId: string,
): Promise<string> {
  try {
    const apiKey = process.env.YOUTUBE_API_KEY;

    if (!apiKey) {
      throw new Error("YouTube API key is not configured");
    }

    // Make a request to the YouTube Data API videos.list endpoint
    const url = `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&key=${apiKey}&part=snippet`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(
        `YouTube API request failed with status: ${response.status}`,
      );
    }

    const data = await response.json();

    // Check if the video exists
    if (!data.items || data.items.length === 0) {
      throw new Error("Video not found");
    }

    // Get the publishedAt field from the snippet
    const publishedAt = data.items[0].snippet.publishedAt;

    return publishedAt;
  } catch (error) {
    console.error("Error fetching YouTube video upload date:", error);
    throw error;
  }
}
