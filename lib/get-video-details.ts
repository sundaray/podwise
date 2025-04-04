import "server-only";

import { parseISO } from "date-fns";

export const getVideoDetails = async (videoId: string) => {
  if (!videoId) return null;

  const sixHoursInSeconds = 6 * 60 * 60; // 21600

  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=statistics,snippet&id=${videoId}&key=${process.env.YOUTUBE_API_KEY}`,
      {
        // Configure Next.js fetch caching options
        next: {
          // Revalidate this data at most once every 6 hours (21600 seconds)
          revalidate: sixHoursInSeconds,
        },
      },
    );

    if (!response.ok) {
      console.error("YouTube API error: ", response);
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
};

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

function formatPublishedDate(dateString: string): string {
  const date = parseISO(dateString);
  const now = new Date();
  const diffInMilliseconds = now.getTime() - date.getTime();

  // Convert to various units
  const diffInSeconds = Math.floor(diffInMilliseconds / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  // YouTube-style formatting with specific thresholds
  if (diffInSeconds < 60) {
    return diffInSeconds === 1
      ? "1 second ago"
      : `${diffInSeconds} seconds ago`;
  } else if (diffInMinutes < 60) {
    return diffInMinutes === 1
      ? "1 minute ago"
      : `${diffInMinutes} minutes ago`;
  } else if (diffInHours < 24) {
    return diffInHours === 1 ? "1 hour ago" : `${diffInHours} hours ago`;
  } else if (diffInDays < 7) {
    return diffInDays === 1 ? "1 day ago" : `${diffInDays} days ago`;
  } else if (diffInDays < 30) {
    // YouTube tends to show weeks instead of exact days after 7 days
    const weeks = Math.floor(diffInDays / 7);
    return weeks === 1 ? "1 week ago" : `${weeks} weeks ago`;
  } else if (diffInDays < 365) {
    // For months
    const months = Math.floor(diffInDays / 30);
    return months === 1 ? "1 month ago" : `${months} months ago`;
  } else {
    // For years
    const years = Math.floor(diffInDays / 365);
    return years === 1 ? "1 year ago" : `${years} years ago`;
  }
}
