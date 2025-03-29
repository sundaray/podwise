import "server-only"
import path from "path";

/**
 * Get the highest resolution thumbnail URL for a YouTube video
 */
export async function getYouTubeThumbnail(videoId: string): Promise<{ url: string; extension: string }> {
  const apiKey = process.env.YOUTUBE_API_KEY;
  
  const apiUrl = `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&key=${apiKey}&part=snippet`;
  
  const response = await fetch(apiUrl);

  if (!response.ok) {
    throw new Error(`YouTube API error: ${response.status} ${response.statusText}`);
  }
  
  const data = await response.json();

  if (!data.items || data.items.length === 0) {
    throw new Error(`No video found with ID: ${videoId}`);
  }
  
  const thumbnails = data.items[0].snippet.thumbnails;
  
  // Get the highest resolution thumbnail
  // Priority: maxres -> standard -> high -> medium -> default
  let thumbnailUrl: string;
  
  if (thumbnails.maxres) {
    thumbnailUrl = thumbnails.maxres.url;
    console.log("Using maxres thumbnail");
  } else if (thumbnails.standard) {
    thumbnailUrl = thumbnails.standard.url;
    console.log("Using standard thumbnail");
  } else if (thumbnails.high) {
    thumbnailUrl = thumbnails.high.url;
    console.log("Using high thumbnail");
  } else if (thumbnails.medium) {
    thumbnailUrl = thumbnails.medium.url;
    console.log("Using medium thumbnail");
  } else {
    thumbnailUrl = thumbnails.default.url;
    console.log("Using default thumbnail");
  }
  
  // Extract the file extension from the URL
  const parsedUrl = new URL(thumbnailUrl);
  const extension = path.extname(parsedUrl.pathname);
  
  console.log(`Detected thumbnail extension: ${extension}`);
  
  return {
    url: thumbnailUrl,
    extension: extension || ".jpg" // Default to .jpg if no extension found
  };
}