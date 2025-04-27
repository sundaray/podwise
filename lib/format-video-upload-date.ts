import "server-only";

import { parseISO } from "date-fns";

export function formatVideoUploadDate(dateString: string): string {
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
