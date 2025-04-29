import type { Metadata } from "next";
import { doacPodcastList } from "@/podcast-list/doac";
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
    title: "The Diary Of A CEO Podcast Summaries",
    description:
      "Discover key insights and actionable takeaways from The Diary Of A CEO podcast episodes.",
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

export default async function DoacPodcastPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const host = "doac";

  const {
    page: currentPage,
    tier,
    query,
  } = await loadPodcastListSearchParams(searchParams);

  // Sort podcasts by video upload date
  const sortedPodcasts = [...doacPodcastList].sort((a, b) => {
    const dateA = a.videoUploadedAt ? new Date(a.videoUploadedAt) : new Date(0);
    const dateB = b.videoUploadedAt ? new Date(b.videoUploadedAt) : new Date(0);
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
        className={`${libreBaskerville.className} mb-8 text-center text-4xl font-semibold tracking-tight text-pretty text-gray-900`}
      >
        "The Diary Of a CEO" Podcast Summaries
      </h1>
      <p className="mx-auto mb-20 max-w-5xl text-center text-lg leading-7 font-medium text-balance text-gray-700">
      The Diary Of A CEO is a globally renowned podcast hosted by Steven Bartlett, a British entrepreneur, investor, and former CEO. Launched in 2017, the podcast offers raw, honest, and unfiltered conversations with some of the world’s most influential people, including CEOs, entrepreneurs, athletes, scientists, and thought leaders. Each episode dives deep into the personal and professional journeys of its guests, exploring topics such as business strategies, mental health, leadership, financial success, relationships, and societal issues. With a mission to uncover untold stories and actionable insights, The Diary Of A CEO combines compelling storytelling with practical wisdom, making it a must-listen for anyone seeking inspiration and growth.
      </p>
      <PodcastSearch
        placeholder="Search podcast summaries by title"
        page="podcasts"
      />

      <PodcastTabs />

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
