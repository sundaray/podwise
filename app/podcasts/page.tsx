// app/podcasts/page.tsx
import type { Metadata } from "next";
import { PodcastCard } from "@/components/podcast-card";
import { PodcastPagination } from "@/components/podcast-pagination";
import { PodcastSearch } from "@/components/podcast-search";
import { PodcastTabs } from "@/components/podcast-tabs";
import { PodcastFilter } from "@/components/podcast-filter";
import { filterPodcasts } from "@/lib/podcast-filters";
import { loadPodcastListSearchParams } from "@/lib/podcast-list-search-params";
import type { SearchParams } from "nuqs/server";
import { libreBaskerville } from "@/app/layout";

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

export async function generateMetadata({
  searchParams,
}: {
  searchParams: SearchParams;
}): Promise<Metadata> {
  const { page, tier, query, shows } = await loadPodcastListSearchParams(searchParams);

  // Base metadata
  const metadata: Metadata = {
    title: "All Podcast Summaries | Podwise",
    description:
      "Discover key insights and actionable takeaways from top podcasts, all summarized for quick reading.",
    alternates: {
      canonical: `https://podwise.org/podcasts${
        page > 1 ? `?page=${page}` : ""
      }`,
    },
  };

  // Add noindex for filtered or searched pages
  if (tier !== "all" || query || (shows && shows.length > 0)) {
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

// Helper function to get all podcasts
function getAllPodcasts() {
  return [
    ...chrisWilliamsonPodcastList,
    ...dailyStoicPodcastList,
    ...doacPodcastList,
    ...jackNeelPodcastList,
    ...jayShettyPodcastList,
    ...lewisHowesPodcastList,
    ...melRobbinsPodcastList,
    ...ranganChatterjeePodcastList,
    ...scottDClaryPodcastList,
    ...simonSinekPodcastList,
    ...timFerrissPodcastList,
  ];
}

// Helper function to get host path by podcast
function getHostPathForPodcast(podcast: any) {
  // Map podcast to its host path based on which array it belongs to
  // This assumes each podcast has a unique slug across all hosts
  if (chrisWilliamsonPodcastList.some(p => p.slug === podcast.slug)) return "chris-williamson";
  if (dailyStoicPodcastList.some(p => p.slug === podcast.slug)) return "daily-stoic";
  if (doacPodcastList.some(p => p.slug === podcast.slug)) return "doac";
  if (jackNeelPodcastList.some(p => p.slug === podcast.slug)) return "jack-neel";
  if (jayShettyPodcastList.some(p => p.slug === podcast.slug)) return "jay-shetty";
  if (lewisHowesPodcastList.some(p => p.slug === podcast.slug)) return "lewis-howes";
  if (melRobbinsPodcastList.some(p => p.slug === podcast.slug)) return "mel-robbins";
  if (ranganChatterjeePodcastList.some(p => p.slug === podcast.slug)) return "rangan-chatterjee";
  if (scottDClaryPodcastList.some(p => p.slug === podcast.slug)) return "scott-d-clary";
  if (simonSinekPodcastList.some(p => p.slug === podcast.slug)) return "simon-sinek";
  if (timFerrissPodcastList.some(p => p.slug === podcast.slug)) return "tim-ferriss";
  return ""; // Default fallback
}

export default async function AllPodcastsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const {
    page: currentPage,
    tier,
    query,
    shows,
  } = await loadPodcastListSearchParams(searchParams);

  // Get all podcasts
  const allPodcasts = getAllPodcasts();

  // Sort podcasts by video upload date
  const sortedPodcasts = [...allPodcasts].sort((a, b) => {
    const dateA = a.videoUploadedAt ? new Date(a.videoUploadedAt) : new Date(0);
    const dateB = b.videoUploadedAt ? new Date(b.videoUploadedAt) : new Date(0);
    return dateB.getTime() - dateA.getTime();
  });

  // Filter podcasts based on type, query, and selected shows
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
      {shows && shows.length > 0 ? ` from ${shows.length} selected podcast${shows.length > 1 ? 's' : ''}` : ""}
    </>
  );

  return (
    <div className="group mx-auto max-w-6xl px-4">
      <h1
        className={`${libreBaskerville.className} mb-8 text-center text-4xl font-semibold tracking-tight text-pretty text-gray-900`}
      >
        All Podcast Summaries
      </h1>
      <p className="mx-auto mb-20 max-w-5xl text-center text-lg leading-7 font-medium text-balance text-gray-700">
        Podwise offers detailed summaries of top podcasts to help you extract key insights without spending hours listening. Browse our collection of thoughtfully crafted summaries from popular podcasts covering topics such as personal development, business, health, psychology, and more. These summaries capture the essential points, actionable advice, and profound ideas from each episode.
      </p>
      
      <PodcastSearch
        placeholder="Search podcast summaries by title"
        page="podcasts"
      />

      <div className="flex items-center justify-between mb-6">
        <PodcastTabs />
        <PodcastFilter />
      </div>

      {(tier !== "all" || query || (shows && shows.length > 0)) && totalPodcasts > 0 && (
        <p className="mb-10 text-center text-sm font-medium text-pretty text-gray-500">
          {statusMessage}
        </p>
      )}

      {paginatedPodcasts.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 border-b pb-10 group-has-[[data-pending]]:animate-pulse sm:grid-cols-2 md:grid-cols-3 md:gap-10">
          {paginatedPodcasts.map((podcast) => (
            <PodcastCard 
              key={podcast.slug} 
              podcast={podcast} 
              hostPath={getHostPathForPodcast(podcast)} 
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