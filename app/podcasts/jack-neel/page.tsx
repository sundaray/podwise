import type { Metadata } from "next";
import { jackNeelPodcastList } from "@/podcast-list/jack-neel";
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
    title: "The Jack Neel Podcast",
    description:
      "Discover key insights and actionable takeaways from the Jack Neel podcast episodes.",
    alternates: {
      canonical: `https://podwise.org/podcasts/jack-neel${
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

export default async function JackNeelPodcastPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const host = "jack-neel";

  const {
    page: currentPage,
    tier,
    query,
    shows,
  } = await loadPodcastListSearchParams(searchParams);

  // Sort podcasts by video upload date
  const sortedPodcasts = [...jackNeelPodcastList].sort((a, b) => {
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
      <h1
        className={`${libreBaskerville.className} mb-6 text-center text-4xl font-semibold tracking-tight text-pretty text-gray-900`}
      >
        The Jack Neel Podcast
      </h1>
      <p className="mx-auto mb-20 max-w-5xl text-center text-lg/7 leading-7 font-medium text-balance text-gray-700">
        The Jack Neel Podcast dives into the fascinating worlds of crime,
        business, and psychology through in-depth interviews with a diverse
        range of guests, from entrepreneurs and influencers to controversial
        figures. Each episode explores compelling stories and insights, covering
        topics like high-stakes entrepreneurship, personal transformation,
        societal issues, and the psychological underpinnings of success and
        controversy. With a focus on raw, thought-provoking discussions, the
        podcast offers listeners a unique blend of entertainment and education,
        perfect for those intrigued by the intersections of human behavior,
        ambition, and real-world challenges.
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
        <p className="text-center text-sm font-medium text-red-600">No podcasts found</p>
      )}
      <PodcastPagination totalPages={totalPages} />
    </div>
  );
}
