// lib/middleware/is-podcast-summary-page.ts
export function isPodcastSummaryPage(path: string): boolean {
  const pathSegments = path.split("/").filter(Boolean);
  return pathSegments.length === 3 && pathSegments[0] === "podcasts";
}
