import Link from "next/link";
import { Icons } from "@/components/icons";
import type { Metadata } from "next";
import { ranganChatterjeePodcastList } from "@/podcast-list/rangan-chatterjee";
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
  searchParams: Promise<SearchParams>;
}): Promise<Metadata> {
  const awaitedSearchParams = await searchParams;
  const { page, tier, query } =
    await loadPodcastListSearchParams(awaitedSearchParams);

  // Base metadata
  const metadata: Metadata = {
    title: "Feel Better, Live More by Rangan Chatterjee",
    description:
      "Discover key insights and actionable takeaways from the Feel Better, Live More podcast episodes.",
    alternates: {
      canonical: `https://podwise.org/podcasts/rangan-chatterjee${
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

export default async function RanganChatterjeePodcastPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const host = "rangan-chatterjee";
  const awaitedSearchParams = await searchParams;
  const {
    page: currentPage,
    tier,
    query,
    shows,
  } = await loadPodcastListSearchParams(awaitedSearchParams);

  // Sort podcasts by video upload date
  const sortedPodcasts = [...ranganChatterjeePodcastList].sort((a, b) => {
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
      <Link
        href="/podcasts"
        className="mx-auto flex w-fit items-center justify-center gap-1 rounded-full px-3 py-2 text-sm font-medium text-sky-600 transition-colors hover:bg-gray-100 hover:text-sky-700"
      >
        <Icons.chevronLeft className="size-4 text-gray-500" />
        All podcast summaries
      </Link>
      <h1 className="my-6 text-center text-4xl font-bold tracking-tight text-pretty text-gray-900">
        Feel Better, Live More by Dr. Rangan Chatterjee
      </h1>
      <p className="mx-auto mb-20 max-w-5xl text-center text-lg/7 text-balance text-gray-700">
        Feel Better, Live More, hosted by Dr. Rangan Chatterjee, a medical
        doctor with over 21 years of experience and author of six bestselling
        books, is the UK and Europe&apos;s #1 health podcast. Each episode
        offers practical, science-backed insights on nutrition, movement, sleep,
        and mental health, featuring interviews with leading experts and
        inspiring personalities. The podcast aims to empower listeners with
        simple yet effective strategies to improve their health and wellbeing.
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
