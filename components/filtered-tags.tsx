"use client";

import { TagGroup, TagList, Tag } from "react-aria-components";
import { formatTagForUrl } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { TagItem } from "./tag-card";

type FilteredTagsProps = {
  tags: TagItem[];
  query: string;
  className?: string;
};

export function FilteredTags({ tags, query, className }: FilteredTagsProps) {
  return (
    <div className={cn("filtered-tags", className)}>
      <TagGroup aria-label={`Search results for "${query}"`}>
        <TagList
          items={tags}
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
  );
}