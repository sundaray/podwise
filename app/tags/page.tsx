import { Suspense } from "react";
import { PodcastSearch } from "@/components/podcast-search";
import { TagCard } from "@/components/tag-card";
import { getPodcastTags } from "@/lib/get-podcast-tags";
import { loadTagsListSearchParams } from "@/lib/tags-list-search-params";
import { formatTagForUrl } from "@/lib/utils";
import { TagGroup, TagList, Tag } from "react-aria-components";
import { FilteredTags } from "@/components/filtered-tags";
import { cn } from "@/lib/utils";
import type { SearchParams } from "nuqs/server";
import type { TagItem } from "@/components/tag-card";

type TagsPageProps = {
  searchParams: SearchParams;
};

export default async function TagsPage({ searchParams }: TagsPageProps) {
  // Load query from search parameters
  const { query } = await loadTagsListSearchParams(searchParams);

  // Get all tags data
  const { uniqueTagCount, tagsByLetter, letters } = getPodcastTags();

  // Filter tags if we have a query
  let filteredTags: TagItem[] = [];

  if (query && query.trim() !== "") {
    filteredTags = Array.from(tagsByLetter.entries()).flatMap(
      ([letter, tags]) =>
        tags.filter((tag) =>
          tag.name.toLowerCase().includes(query.toLowerCase()),
        ),
    );
  }

  // Status message for searches
  const statusMessage = query ? (
    <>
      Showing {filteredTags.length} tags matching "{query}"
    </>
  ) : null;

  // Decide which tags to render
  const isSearchMode = query && query.trim() !== "";
  const animationClass = "group-has-[[data-pending]]:animate-pulse";

  return (
    <div className="group mx-auto max-w-3xl px-4 md:px-8">
      <h1 className="mb-2 text-center text-4xl font-bold tracking-tight text-pretty">
        Podcast Summary Tags
      </h1>
      <p className="mb-8 text-center text-pretty text-gray-700">
        Click any tag to explore related podcast summaries.
      </p>

      <Suspense>
        <PodcastSearch placeholder="Search for tags" />
      </Suspense>

      {isSearchMode && filteredTags.length > 0 && (
        <p className="mb-10 text-center text-sm font-medium text-pretty text-gray-500">
          {statusMessage}
        </p>
      )}

      {isSearchMode && filteredTags.length === 0 ? (
        <p className="py-8 text-center text-xl text-gray-500">
          No tags found matching "{query}"
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
