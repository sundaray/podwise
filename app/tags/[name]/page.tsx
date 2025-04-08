import { Suspense } from "react";
import { notFound } from "next/navigation";
import { PodcastCard } from "@/components/podcast-card";
import { PodcastPagination } from "@/components/podcast-pagination";
import { PodcastSearch } from "@/components/podcast-search";
import { PodcastTabs } from "@/components/podcast-tabs";
import { getVideoDetails } from "@/lib/get-video-details";
import { filterPodcasts } from "@/lib/podcast-filters";
import { loadPodcastListSearchParams } from "@/lib/search-params";
import { formatTagForUrl, formatTagForDisplay } from "@/lib/utils";
import type { SearchParams } from "nuqs/server";

// Import all podcast lists
import { chrisWilliamsonPodcastList } from "@/podcast-list/chris-williamson";
// Import other podcast lists as you add them
// import { melRobbinsPodcastList } from "@/podcast-list/mel-robbins";
// import { jayShettyPodcastList } from "@/podcast-list/jay-shetty";

const ITEMS_PER_PAGE = 9;

// Combine all podcast lists into one array
function getAllPodcasts() {
  return [
    ...chrisWilliamsonPodcastList.map((podcast) => ({
      ...podcast,
      hostPath: "chris-williamson",
    })),
    // Add other podcast lists as you create them
    // ...melRobbinsPodcastList.map(podcast => ({
    //   ...podcast,
    //   hostPath: "mel-robbins"
    // })),
  ];
}

// Get all unique tags across all podcasts
function getAllUniqueTags() {
  const allPodcasts = getAllPodcasts();
  const tagSet = new Set<string>();

  allPodcasts.forEach((podcast) => {
    podcast.tags.forEach((tag) => tagSet.add(tag));
  });

  return Array.from(tagSet);
}

// Generate static params for all tags
export async function generateStaticParams() {
  const tags = getAllUniqueTags();

  return tags.map((tag) => ({
    name: formatTagForUrl(tag),
  }));
}

type TagPageProps = {
  params: { name: string };
  searchParams: SearchParams;
};

export default async function TagPage({ params, searchParams }: TagPageProps) {
  const { name } = params;
  const tagName = formatTagForDisplay(name);

  // Check if tag exists, if not return 404
  const allTags = getAllUniqueTags();
  const normalizedTagName = tagName.toLowerCase();
  const tagExists = allTags.some(
    (tag) => tag.toLowerCase() === normalizedTagName,
  );

  if (!tagExists) {
    notFound();
  }

  const {
    page: currentPage,
    tier,
    query,
  } = await loadPodcastListSearchParams(searchParams);

  // Get all podcasts and filter by the current tag
  const allPodcasts = getAllPodcasts();
  const podcastsWithTag = allPodcasts.filter((podcast) =>
    podcast.tags.some((tag) => tag.toLowerCase() === normalizedTagName),
  );

  // Fetch video details for each podcast
  const podcastsWithDetails = await Promise.all(
    podcastsWithTag.map(async (podcast) => {
      const videoDetails = await getVideoDetails(podcast.videoId);
      return {
        ...podcast,
        publishedAt: videoDetails?.publishedAt || null,
      };
    }),
  );

  // Sort podcasts by publish date
  const sortedPodcasts = [...podcastsWithDetails].sort((a, b) => {
    const dateA = a.publishedAt ? new Date(a.publishedAt) : new Date(0);
    const dateB = b.publishedAt ? new Date(b.publishedAt) : new Date(0);
    return dateB.getTime() - dateA.getTime();
  });

  // Apply additional filters (tier and search query)
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
  const statusMessage = (
    <>
      Showing {paginatedPodcasts.length} of {totalPodcasts}{" "}
      {tier !== "all" && <em>{tier}</em>} podcast summaries tagged with "
      {tagName}"{query ? ` matching "${query}"` : ""}
    </>
  );

  return (
    <div className="group container mx-auto max-w-6xl px-4">
      <div className="mb-8 text-center">
        <h1 className="mb-2 text-4xl font-bold tracking-tight">
          Tag: <span className="text-sky-700">{tagName}</span>
        </h1>
        <p className="text-gray-700 text-pretty">
          Found {totalPodcasts} podcast{" "}
          {totalPodcasts === 1 ? "summary" : "summaries"} tagged with "{tagName}
          "
        </p>
      </div>

      <Suspense>
        <PodcastSearch />
      </Suspense>

      <Suspense>
        <PodcastTabs />
      </Suspense>

      {(tier !== "all" || query) && totalPodcasts > 0 && (
        <p className="mb-10 text-center text-sm font-medium text-pretty text-gray-500">
          {statusMessage}
        </p>
      )}

      {paginatedPodcasts.length > 0 ? (
        <div className="group grid grid-cols-1 gap-6 border-b pb-10 group-has-[[data-pending]]:animate-pulse sm:grid-cols-2 md:grid-cols-3 md:gap-10">
          {paginatedPodcasts.map((podcast) => (
            <PodcastCard
              key={podcast.slug}
              podcast={podcast}
              hostPath={podcast.hostPath}
            />
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
