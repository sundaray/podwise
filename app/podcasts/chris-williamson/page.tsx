import type { Metadata } from "next";
import { chrisWilliamsonPodcastList } from "@/podcast-list/chris-williamson";
import { PodcastCard } from "@/components/podcast-card";
import { PodcastPagination } from "@/components/podcast-pagination";
import { PodcastSearch } from "@/components/podcast-search";
import { PodcastTabs } from "@/components/podcast-tabs";
import { filterPodcasts } from "@/lib/podcast-filters";
import { loadPodcastListSearchParams } from "@/lib/podcast-list-search-params";
import type { SearchParams } from "nuqs/server";
import { libreBaskerville } from "@/app/layout";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: SearchParams;
}): Promise<Metadata> {
  const { page, tier, query } = await loadPodcastListSearchParams(searchParams);

  // Base metadata
  const metadata: Metadata = {
    title: "Chris Williamson: Modern Wisdom Podcast Summaries",
    description:
      "Discover key insights and actionable takeaways from Chris Williamson's Modern Wisdom podcast episodes.",
    alternates: {
      canonical: `https://podwise.org/podcasts/chris-williamson${
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

export default async function ChrisWilliamsonPodcastPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const host = "chris-williamson";

  const {
    page: currentPage,
    tier,
    query,
    shows,
  } = await loadPodcastListSearchParams(searchParams);

  // Sort podcasts by video upload date
  const sortedPodcasts = [...chrisWilliamsonPodcastList].sort((a, b) => {
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
      {tier !== "all" && <em>{tier}</em>} podcast summaries
      {query ? ` matching "${query}"` : ""}
    </>
  );

  return (
    <div className="group mx-auto max-w-6xl px-4">
      <h1
        className={`mb-8 text-center text-4xl font-bold tracking-tight text-pretty text-gray-900`}
      >
        Chris Williamson: "Modern Wisdom" Podcast Summaries
      </h1>
      <p className="mx-auto mb-20 max-w-5xl text-center text-lg/7 leading-7 font-medium text-balance text-gray-600">
        Chris Williamson is the host of the popular podcast "Modern Wisdom",
        where he interviews world-class thinkers exploring how to live a better
        life. With a tagline of "Life is hard. This podcast will help," the show
        covers topics ranging from psychology, philosophy, and relationships to
        performance, productivity, and modern culture.
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
        <p className="text-center text-red-600">No podcasts found</p>
      )}
      <PodcastPagination totalPages={totalPages} />
    </div>
  );
}
