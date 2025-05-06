import Link from "next/link";
import { notFound } from "next/navigation";
import { PodcastCard } from "@/components/podcast-card";
import { PodcastPagination } from "@/components/podcast-pagination";
import { PodcastSearch } from "@/components/podcast-search";
import { PodcastTabs } from "@/components/podcast-tabs";
import { filterPodcasts } from "@/lib/podcast-filters";
import { loadPodcastListSearchParams } from "@/lib/podcast-list-search-params";
import { formatTagForDisplay } from "@/lib/utils";
import type { SearchParams } from "nuqs/server";
import { Icons } from "@/components/icons";

// Import all podcast lists
import { chrisWilliamsonPodcastList } from "@/podcast-list/chris-williamson";
import { dailyStoicPodcastList } from "@/podcast-list/daily-stoic";
import { doacPodcastList } from "@/podcast-list/doac";
import { jackNeelPodcastList } from "@/podcast-list/jack-neel";
import { jayShettyPodcastList } from "@/podcast-list/jay-shetty";
import { lewisHowesPodcastList } from "@/podcast-list/lewis-howes";
import { melRobbinsPodcastList } from "@/podcast-list/mel-robbins";
import { ranganChatterjeePodcastList } from "@/podcast-list/rangan-chatterjee";
import { scottDClaryPodcastList } from "@/podcast-list/scott-d-clary";
import { simonSinekPodcastList } from "@/podcast-list/simon-sinek";
import { timFerrissPodcastList } from "@/podcast-list/tim-ferriss";

const ITEMS_PER_PAGE = 9;

// Combine all podcast lists into one array
function getAllPodcasts() {
  return [
    ...chrisWilliamsonPodcastList.map((podcast) => ({
      ...podcast,
      hostPath: "chris-williamson",
    })),
    ...dailyStoicPodcastList.map((podcast) => ({
      ...podcast,
      hostPath: "daily-stoic",
    })),
    ...doacPodcastList.map((podcast) => ({
      ...podcast,
      hostPath: "doac",
    })),
    ...jackNeelPodcastList.map((podcast) => ({
      ...podcast,
      hostPath: "jack-neel",
    })),
    ...jayShettyPodcastList.map((podcast) => ({
      ...podcast,
      hostPath: "jay-shetty",
    })),
    ...lewisHowesPodcastList.map((podcast) => ({
      ...podcast,
      hostPath: "lewis-howes",
    })),
    ...melRobbinsPodcastList.map((podcast) => ({
      ...podcast,
      hostPath: "mel-robbins",
    })),
    ...ranganChatterjeePodcastList.map((podcast) => ({
      ...podcast,
      hostPath: "rangan-chatterjee",
    })),
    ...scottDClaryPodcastList.map((podcast) => ({
      ...podcast,
      hostPath: "scott-d-clary",
    })),
    ...simonSinekPodcastList.map((podcast) => ({
      ...podcast,
      hostPath: "simon-sinek",
    })),
    ...timFerrissPodcastList.map((podcast) => ({
      ...podcast,
      hostPath: "tim-ferriss",
    })),
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
    shows,
  } = await loadPodcastListSearchParams(searchParams);

  // Get all podcasts and filter by the current tag
  const allPodcasts = getAllPodcasts();

  const podcastsWithTag = allPodcasts.filter((podcast) =>
    podcast.tags.some((tag) => tag.toLowerCase() === normalizedTagName),
  );

  // Sort podcasts by video upload date
  const sortedPodcasts = [...podcastsWithTag].sort((a, b) => {
    const dateA = a.videoUploadedAt ? new Date(a.videoUploadedAt) : new Date(0);
    const dateB = b.videoUploadedAt ? new Date(b.videoUploadedAt) : new Date(0);
    return dateB.getTime() - dateA.getTime();
  });

  // Apply additional filters (tier and search query)
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
      {tier !== "all" && tier} podcast summaries tagged with &quot;
      {tagName}&quot;{query ? ` matching "${query}"` : ""}
    </>
  );

  return (
    <div className="group container mx-auto max-w-6xl px-4">
      <div className="mb-12 text-center">
        <Link
          href="/tags"
          className="inline-flex items-center gap-1 rounded-full px-3 py-2 text-sm font-medium text-sky-600 transition-colors hover:bg-gray-100 hover:text-sky-700"
        >
          <Icons.chevronLeft className="size-4 text-gray-500" />
          All Tags
        </Link>
        <h1 className="mt-6 mb-4 text-4xl font-bold tracking-tight text-gray-900">
          Tag: <span className="text-sky-600">{tagName}</span>
        </h1>
        <p className="text-lg text-pretty text-gray-600">
          Found {totalPodcasts} podcast{" "}
          {totalPodcasts === 1 ? "summary" : "summaries"} tagged with &quot;
          {tagName}&quot;
        </p>{" "}
      </div>
      <PodcastSearch
        placeholder="Search podcast summaries by tag"
        page="tags"
      />

      <PodcastTabs className="mb-10" />

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

      <PodcastPagination totalPages={totalPages} />
    </div>
  );
}
