import type { Metadata } from "next";
import { timFerrissPodcastList } from "@/podcast-list/tim-ferriss";
import { PodcastCard } from "@/components/podcast-card";
import { PodcastPagination } from "@/components/podcast-pagination";
import { PodcastSearch } from "@/components/podcast-search";
import { PodcastTabs } from "@/components/podcast-tabs";
import { filterPodcasts } from "@/lib/podcast-filters";
import { loadPodcastListSearchParams } from "@/lib/podcast-list-search-params";
import type { SearchParams } from "nuqs/server";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: SearchParams;
}): Promise<Metadata> {
  const { page, tier, query } = await loadPodcastListSearchParams(searchParams);

  // Base metadata
  const metadata: Metadata = {
    title: "The Tim Ferriss Show",
    description:
      "Discover key insights and actionable takeaways from The Tim Ferriss Show podcast episodes.",
    alternates: {
      canonical: `https://podwise.org/podcasts/tim-ferriss${
        page > 1 ? `?page=${page}` : ""
      }`,
    },
  };

  // Add noindex for filtered or searched pages
  if (tier !== "all" || query) {
    return {
      ...metadata,
      robots: {
        index: false,
        follow: true,
      },
    };
  }

  return metadata;
}

const ITEMS_PER_PAGE = 9;

export default async function TimFerrissPodcastPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const host = "tim-ferriss";

  const {
    page: currentPage,
    tier,
    query,
    shows,
  } = await loadPodcastListSearchParams(searchParams);

  // Sort podcasts by video upload date
  const sortedPodcasts = [...timFerrissPodcastList].sort((a, b) => {
    const dateA = a.videoUploadedAt ? new Date(a.videoUploadedAt) : new Date(0);
    const dateB = b.videoUploadedAt ? new Date(b.videoUploadedAt) : new Date(0);
    return dateB.getTime() - dateA.getTime();
  });

  // Filter podcasts based on type
  const filteredPodcasts = filterPodcasts(
    sortedPodcasts,
    tier as "all" | "free" | "premium",
    query,
    shows,
  );

  // Pagination calculations
  const totalPodcasts = filteredPodcasts.length;
  const totalPages = Math.ceil(totalPodcasts / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedPodcasts = filteredPodcasts.slice(startIndex, endIndex);

  // Create user-friendly status message
  const statusMessage = (
    <>
      Showing {paginatedPodcasts.length} of {totalPodcasts}{" "}
      {tier !== "all" && tier} podcast summaries
      {query ? ` matching "${query}"` : ""}
    </>
  );

  return (
    <div className="group mx-auto max-w-6xl px-4">
      <h1 className="mb-6 text-center text-4xl font-semibold tracking-tight text-pretty text-gray-900">
        The Tim Ferriss Show
      </h1>
      <p className="mx-auto mb-20 max-w-5xl text-center text-lg/7 leading-7 font-medium text-balance text-gray-700">
        The Tim Ferriss Show, hosted by five-time #1 New York Times bestselling
        author Tim Ferriss, is the first podcast to exceed 900 million
        downloads. Often called &quot;the Oprah of audio,&quot; Tim deconstructs
        world-class performers from diverse fields—including business, sports,
        art, and academia—to extract the tactics, tools, and routines listeners
        can apply to their own lives. Each episode features deep-diving
        conversations that uncover the guests&apos; favorite books, morning
        routines, exercise habits, time-management tricks, and much more.
      </p>
      <PodcastSearch
        placeholder="Search podcast summaries by title"
        page="podcasts"
      />

      <PodcastTabs className="mb-10" />

      {(tier !== "all" || query) && totalPodcasts > 0 && (
        <p className="mb-10 text-center text-sm font-medium text-pretty text-gray-500">
          {statusMessage}
        </p>
      )}

      {paginatedPodcasts.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 border-b pb-10 group-has-[[data-pending]]:animate-pulse sm:grid-cols-2 md:grid-cols-3 md:gap-10">
          {paginatedPodcasts.map((podcast) => (
            <PodcastCard key={podcast.slug} podcast={podcast} hostPath={host} />
          ))}
        </div>
      ) : (
        <p className="text-center text-sm font-medium text-red-600">
          No podcasts found
        </p>
      )}
      <PodcastPagination totalPages={totalPages} />
    </div>
  );
}
