"use client";

import { formatTagForUrl } from "@/lib/utils";
import { TagGroup, TagList, Tag, Label } from "react-aria-components";

type PodcastSummaryTagsProps = {
  tags: string[];
};

export function PodcastSummaryTags({ tags }: PodcastSummaryTagsProps) {
  const tagItems = tags.map((tagName) => {
    const trimmedName = tagName.trim();
    return {
      id: trimmedName,
      name: trimmedName,
    };
  });

  return (
    <div className="mt-7 flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
      <Label className="shrink-0 font-semibold text-gray-900">Tags:</Label>
      <TagGroup aria-label="Podcast Tags">
        <TagList items={tagItems} className="flex flex-wrap gap-3">
          {(item) => (
            <Tag
              key={item.id}
              href={`/tags/${formatTagForUrl(item.name)}`}
              className="cursor-pointer rounded-full border border-sky-200 bg-sky-100 px-2 py-1 text-sm font-medium text-sky-700 transition hover:border-sky-700 hover:bg-sky-700 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-700 focus-visible:ring-offset-2 md:px-4 md:py-2"
            >
              {item.name}
            </Tag>
          )}
        </TagList>
      </TagGroup>
    </div>
  );
}