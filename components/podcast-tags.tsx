"use client";

import React from "react";
import { TagGroup, TagList, Tag } from "react-aria-components";
import { getPodcastTags } from "@/lib/get-podcast-tags";
import { formatTagForUrl } from "@/lib/utils";

export function PodcastTags() {
  const { uniqueTagCount, tagsByLetter, letters } = getPodcastTags();

  return (
    <div className="podcast-tags-container mx-auto max-w-4xl px-4 md:px-8">
      <h1 className="mb-4 text-center text-4xl font-bold tracking-tight text-pretty">
        Podcast Summary Tags
      </h1>
      <p className="mb-8 text-center text-pretty text-gray-700">
        Click any tag to explore related podcast summaries.
      </p>

      <div className="tag-sections space-y-12">
        {letters.map((letter) => (
          <div key={letter} className="tag-section" id={`section-${letter}`}>
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
                    <span className="mr-1">{item.name}</span>
                    <span className="inline-flex size-5 items-center justify-center rounded-full bg-sky-200 p-1 text-xs font-medium text-sky-500">
                      {item.count}
                    </span>
                  </Tag>
                )}
              </TagList>
            </TagGroup>
          </div>
        ))}
      </div>
    </div>
  );
}
