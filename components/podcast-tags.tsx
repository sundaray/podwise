"use client";

import React from "react";
import { TagGroup, TagList, Tag } from "react-aria-components";
import { getPodcastTags } from "@/lib/get-podcast-tags";
import { formatTagForUrl } from "@/lib/utils";
import { useQueryState, parseAsString } from "nuqs";
import { cn } from "@/lib/utils";

type PodcastTagsProps = {
  className: string;
};

export function PodcastTags({ className }: PodcastTagsProps) {
  // Get the search query from URL
  const [tagQuery] = useQueryState("tagQuery", parseAsString.withDefault(""));

  const { uniqueTagCount, tagsByLetter, letters } = getPodcastTags();

  // If no search query, render all tags by letter
  if (!tagQuery || tagQuery.trim() === "") {
    return (
      <div className={cn("space-y-12", className)}>
        {letters.map((letter) => (
          <div key={letter} id={`section-${letter}`}>
            {/* Letter heading */}
            <h2 className="mb-2 text-2xl font-semibold text-gray-700">
              {letter}
            </h2>

            {/* Semantic divider */}
            <hr className="mb-4 border-gray-200" aria-hidden="true" />

            {/* Tags starting with this letter */}
            <TagGroup aria-label={`Tags starting with ${letter}`}>
              <TagList
                items={tagsByLetter.get(letter)}
                className="flex flex-wrap gap-3"
              >
                {(item) => (
                  <Tag
                    key={item.id}
                    href={`/tags/${formatTagForUrl(item.name)}`}
                    className="cursor-pointer rounded-full bg-sky-100 px-2 py-1 text-sm font-medium text-sky-700 transition hover:bg-sky-700 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-700 focus-visible:ring-offset-2 md:px-4 md:py-2"
                  >
                    <span className="mr-2">{item.name}</span>
                    <span className="text-xs">{item.count}</span>
                  </Tag>
                )}
              </TagList>
            </TagGroup>
          </div>
        ))}
      </div>
    );
  }

  // If we have a search query, filter tags
  const filteredTags = Array.from(tagsByLetter.entries()).flatMap(
    ([letter, tags]) =>
      tags.filter((tag) =>
        tag.name.toLowerCase().includes(tagQuery.toLowerCase()),
      ),
  );

  if (filteredTags.length === 0) {
    return (
      <div className="py-8 text-center">
        <p className="text-xl text-gray-500">
          No tags found matching &quot;{tagQuery}&quot;
        </p>
      </div>
    );
  }

  // Get the first letter of the search query (uppercase)
  const searchFirstLetter = tagQuery.charAt(0).toUpperCase();

  return (
    <div className="search-results">
      <div className="tag-section">
        <h2 className="mb-2 text-2xl font-semibold text-gray-700">
          {searchFirstLetter}
        </h2>
        <hr className="mb-4 border-gray-200" aria-hidden="true" />

        <TagGroup aria-label={`Search results for "${tagQuery}"`}>
          <TagList items={filteredTags} className="flex flex-wrap gap-3">
            {(item) => (
              <Tag
                key={item.id}
                href={`/tags/${formatTagForUrl(item.name)}`}
                className="cursor-pointer rounded-full bg-sky-100 px-2 py-1 text-sm font-medium text-sky-700 transition hover:bg-sky-700 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-700 focus-visible:ring-offset-2 md:px-4 md:py-2"
              >
                <span className="mr-2">{item.name}</span>
                <span className="text-xs">{item.count}</span>
              </Tag>
            )}
          </TagList>
        </TagGroup>
      </div>
    </div>
  );
}
