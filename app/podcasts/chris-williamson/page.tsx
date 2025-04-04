import { Suspense } from "react";
import { chrisWilliamsonPodcastList } from "@/podcast-list/chris-williamson";
import { PodcastCard } from "@/components/podcast-card";
import { PodcastPagination } from "@/components/podcast-pagination";
import { PodcastSearch } from "@/components/podcast-search";
import { PodcastTabs } from "@/components/podcast-tabs";
import { getVideoDetails } from "@/lib/get-video-details";
import { filterPodcasts } from "@/lib/podcast-filters";
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

  const {
    page: currentPage,
    tier,
    query,
  } = await loadPodcastListSearchParams(searchParams);

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

  // Filter podcasts based on type
  const filteredPodcasts = filterPodcasts(
    sortedPodcasts,
    tier as "all" | "free" | "premium",
    query,
  );

  // Pagination calculations
  const totalPodcasts = filteredPodcasts.length;
  const totalPages = Math.ceil(totalPodcasts / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedPodcasts = filteredPodcasts.slice(startIndex, endIndex);

  // Create user-friendly status message
  let statusMessage = `Showing ${paginatedPodcasts.length} of ${totalPodcasts} podcast${totalPodcasts !== 1 ? "s" : ""}`;

  if (tier !== "all") {
    statusMessage += ` (${tier} only)`;
  }

  if (query) {
    statusMessage += ` matching "${query}"`;
  }

  return (
    <div className="group container mx-auto max-w-6xl space-y-6 px-4 md:space-y-10">
      <Suspense>
        <PodcastSearch />
      </Suspense>

      <Suspense>
        <PodcastTabs />
      </Suspense>

      {(tier !== "all" || query) && totalPodcasts > 0 && (
        <p className="text-center text-pretty text-gray-700">{statusMessage}</p>
      )}

      {paginatedPodcasts.length > 0 ? (
        <div className="group grid grid-cols-1 gap-6 group-has-[[data-pending]]:animate-pulse sm:grid-cols-2 md:grid-cols-3 md:gap-10">
          {paginatedPodcasts.map((podcast) => (
            <PodcastCard key={podcast.slug} podcast={podcast} hostPath={host} />
          ))}
        </div>
      ) : (
        <p className="text-center text-red-600">No podcasts found</p>
      )}
      <Suspense>
        <PodcastPagination totalPages={totalPages} />
      </Suspense>
    </div>
  );
}
