import "server-only";

import { cache } from "react";
import { formatDistanceToNow, parseISO } from "date-fns";

export const getVideoDetails = cache(async (videoId: string) => {
  if (!videoId) return null;

  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=statistics,snippet&id=${videoId}&key=${process.env.YOUTUBE_API_KEY}`,
    );

    if (!response.ok) {
      throw new Error(`YouTube API error: ${response.status}`);
    }

    const data = await response.json();

    if (!data.items || data.items.length === 0) {
      return null;
    }

    const videoDetails = data.items[0];
    const viewCount = parseInt(videoDetails.statistics.viewCount, 10);
    const publishedAt = videoDetails.snippet.publishedAt;

    return {
      viewCount,
      publishedAt,
      formattedViewCount: formatViewCount(viewCount),
      formattedPublishedDate: formatPublishedDate(publishedAt),
    };
  } catch (error) {
    console.error("Failed to fetch video details:", error);
    return null;
  }
});

// Format large numbers to K/M format (e.g., 1000 => 1K)
function formatViewCount(count: number): string {
  if (count >= 1000000) {
    return `${Math.floor(count / 1000000)}M views`;
  } else if (count >= 1000) {
    return `${Math.floor(count / 1000)}K views`;
  } else {
    return `${count} views`;
  }
}

// Format date to relative time (e.g., "1 day ago", "2 weeks ago")
function formatPublishedDate(dateString: string): string {
  const date = parseISO(dateString);
  const distance = formatDistanceToNow(date, { addSuffix: false });

  // YouTube style formatting
  return `${distance} ago`;
}
