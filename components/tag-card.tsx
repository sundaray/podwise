"use client";

import { TagGroup, TagList, Tag } from "react-aria-components";
import { formatTagForUrl } from "@/lib/utils";
import { cn } from "@/lib/utils";

export type TagItem = {
  id: string;
  name: string;
  count: number;
};

type TagCardProps = {
  letter: string;
  tags: TagItem[];
  className?: string;
};

export function TagCard({ letter, tags, className }: TagCardProps) {
  return (
    <div className={cn("tag-section", className)} id={`section-${letter}`}>
      {/* Letter heading */}
      <h2 className="mb-2 text-2xl font-semibold text-gray-700">{letter}</h2>

      {/* Semantic divider */}
      <hr className="mb-4 border-gray-200" aria-hidden="true" />

      {/* Tags starting with this letter */}
      <TagGroup aria-label={`Tags starting with ${letter}`}>
        <TagList items={tags} className="flex flex-wrap gap-3">
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
