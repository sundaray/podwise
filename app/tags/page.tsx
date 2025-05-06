import { PodcastSearch } from "@/components/podcast-search";
import { TagCard } from "@/components/tag-card";
import { getPodcastTags } from "@/lib/get-podcast-tags";
import { loadTagsListSearchParams } from "@/lib/tags-list-search-params";
import { FilteredTags } from "@/components/filtered-tags";
import { cn } from "@/lib/utils";
import type { SearchParams } from "nuqs/server";
import type { TagItem } from "@/components/tag-card";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tags | Podwise",
};

type TagsPageProps = {
  searchParams: SearchParams;
};

export default async function TagsPage({ searchParams }: TagsPageProps) {
  // Load query from search parameters
  const { query } = await loadTagsListSearchParams(searchParams);

  // Get all tags data
  const { tagsByLetter, letters } = getPodcastTags();

  // Filter tags if we have a query
  let filteredTags: TagItem[] = [];

  if (query && query.trim() !== "") {
    filteredTags = Array.from(tagsByLetter.entries()).flatMap(([_, tags]) =>
      tags.filter((tag) =>
        tag.name.toLowerCase().includes(query.toLowerCase()),
      ),
    );
  }

  // Status message for searches
  const statusMessage = query ? (
    <>
      Showing {filteredTags.length} tags matching &quot;{query}&quot;
    </>
  ) : null;

  // Decide which tags to render
  const isSearchMode = query && query.trim() !== "";
  const animationClass = "group-has-[[data-pending]]:animate-pulse";

  return (
    <div className="group mx-auto max-w-3xl px-4 md:px-8">
      <h1 className="mb-4 text-center text-4xl font-bold tracking-tight text-pretty text-gray-900">
        Podcast Summary Tags
      </h1>
      <p className="mb-12 text-center text-lg text-pretty text-gray-600">
        Click any tag to explore related podcast summaries.
      </p>

      <PodcastSearch placeholder="Search for tags" page="tags" />

      {isSearchMode && filteredTags.length > 0 && (
        <p className="mb-12 text-center text-sm font-medium text-pretty text-gray-500">
          {statusMessage}
        </p>
      )}

      {isSearchMode && filteredTags.length === 0 ? (
        <p className="text-center text-sm font-medium text-red-600">
          No tags found matching &quot;{query}&quot;
        </p>
      ) : isSearchMode ? (
        // For search results, directly render tags without letter grouping
        <FilteredTags
          tags={filteredTags}
          query={query}
          className={animationClass}
        />
      ) : (
        // For regular view, render each letter with its tags
        <div className={cn("space-y-12", animationClass)}>
          {letters.map((letter) => (
            <TagCard
              key={letter}
              letter={letter}
              tags={tagsByLetter.get(letter) || []}
            />
          ))}
        </div>
      )}
    </div>
  );
}
