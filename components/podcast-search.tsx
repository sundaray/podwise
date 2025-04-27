"use client";

import { useTransition } from "react";
import { useDebouncedCallback } from "use-debounce";
import { useQueryState, parseAsString } from "nuqs";

import { Input } from "@/components/ui/input";
import { Icons } from "@/components/icons";

type PodcastSearchProps = {
  placeholder: string;
  page: string;
};

export function PodcastSearch({ placeholder, page }: PodcastSearchProps) {
  const [isPending, startTransition] = useTransition();

  // Set up query parameter for search term
  const [query, setQuery] = useQueryState(
    "query",
    parseAsString.withDefault("").withOptions({
      startTransition,
      shallow: false,
    }),
  );

  // Set up access to page parameter just to reset it
  const [_, setPage] = useQueryState(
    "page",
    parseAsString.withDefault("1").withOptions({
      startTransition,
      shallow: false,
    }),
  );

  // Handle search with debounce
  const handleSearch = useDebouncedCallback((term: string) => {
    setQuery(term);

    // Only reset page if we're using the podcast search
    if (page === "podcasts") {
      setPage("1");
    }
  }, 250);

  return (
    <div
      className="group/search relative mx-auto mb-20 max-w-2xl"
      data-pending={isPending ? "" : undefined}
    >
      <Icons.search className="absolute top-1/2 left-4 size-5 -translate-y-1/2 text-gray-500 transition-colors group-has-[:focus]/search:text-gray-700 group-has-[:hover]/search:text-gray-700" />
      <Input
        className="h-12 rounded-full bg-gray-100 px-10 ring-gray-100"
        type="search"
        placeholder={placeholder}
        defaultValue={query || ""}
        onChange={(e) => handleSearch(e.target.value)}
        aria-label={placeholder}
      />
    </div>
  );
}
