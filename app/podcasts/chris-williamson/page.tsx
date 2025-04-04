import { Suspense } from "react";
import { chrisWilliamsonPodcastList } from "@/podcast-list/chris-williamson";
import { PodcastCard } from "@/components/podcast-card";
import { PodcastPagination } from "@/components/podcast-pagination";
import { getVideoDetails } from "@/lib/get-video-details";
import { loadPodcastListSearchParams } from "@/lib/search-params";
import type { SearchParams } from "nuqs/server";

const ITEMS_PER_PAGE = 9;

type ChrisWilliamsonPodcastPageProps = {
  params: { host: string };
  searchParams: SearchParams;
};

export default async function ChrisWilliamsonPodcastPage({
  searchParams,
}: ChrisWilliamsonPodcastPageProps) {
  const host = "chris-williamson";

  const { page: currentPage } = await loadPodcastListSearchParams(searchParams);

  // Fetch and sort data (consider caching)
  const podcastsWithDetails = await Promise.all(
    chrisWilliamsonPodcastList.map(async (podcast) => {
      const videoDetails = await getVideoDetails(podcast.videoId);
      return {
        ...podcast,
        publishedAt: videoDetails?.publishedAt || null,
      };
    }),
  );

  const sortedPodcasts = [...podcastsWithDetails].sort((a, b) => {
    const dateA = a.publishedAt ? new Date(a.publishedAt) : new Date(0);
    const dateB = b.publishedAt ? new Date(b.publishedAt) : new Date(0);
    return dateB.getTime() - dateA.getTime();
  });

  // Pagination calculations
  const totalPodcasts = sortedPodcasts.length;
  const totalPages = Math.ceil(totalPodcasts / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedPodcasts = sortedPodcasts.slice(startIndex, endIndex);

  return (
    <div className="group container mx-auto max-w-5xl px-4">
      <div className="grid grid-cols-1 gap-6 group-has-[[data-pending]]:animate-pulse sm:grid-cols-2 md:grid-cols-3 md:gap-10">
        {paginatedPodcasts.map((podcast) => (
          <PodcastCard key={podcast.slug} podcast={podcast} hostPath={host} />
        ))}
      </div>

      {/* Render Pagination Component wrapped in Suspense */}
      <Suspense
        fallback={<div className="bg-muted w-full animate-pulse rounded" />}
      >
        <PodcastPagination totalPages={totalPages} />
      </Suspense>
    </div>
  );
}
