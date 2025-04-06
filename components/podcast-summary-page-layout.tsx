"use client";

import Image from "next/image";
import { Frontmatter } from "@/types";
import { format, parseISO } from "date-fns";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { TagGroup, TagList, Tag, Label } from "react-aria-components";
import { formatHostForUrl, formatTagForUrl } from "@/lib/utils";
import { ScrollToTop } from "@/components/scroll-to-top";

type PodcastSummaryPageLayoutProps = {
  children: React.ReactNode;
  frontmatter: Frontmatter;
};

// Tiny 1x1 SVG for solid color #F3F4F6, URL-encoded for Data URL
const solidColorPlaceholder =
  "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1 1' fill='%23F3F4F6'%3E%3Crect width='1' height='1'/%3E%3C/svg%3E";

export function PodcastSummaryPageLayout({
  children,
  frontmatter,
}: PodcastSummaryPageLayoutProps) {
  const { title, publishedAt, tags, image, podcastHost } = frontmatter;

  const formattedPodcastHost = formatHostForUrl(podcastHost);

  const imageUrl = `https://podcast-summaries-dev.s3.amazonaws.com/podcast-thumbnails/${formattedPodcastHost}/${image}`;

  const formattedDate = format(parseISO(publishedAt), "MMMM d, yyyy");

  const tagItems = tags.map((tagName) => {
    const trimmedName = tagName.trim();
    return {
      id: trimmedName,
      name: trimmedName,
    };
  });

  return (
    <div className="podcast-summary mx-auto max-w-3xl px-4 md:px-8">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink
              href="/"
              className="font-medium text-sky-700 hover:text-sky-700"
            >
              Home
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator className="text-gray-500" />
          <BreadcrumbItem>
            <BreadcrumbLink
              href="/podcasts"
              className="font-medium text-sky-700 hover:text-sky-700"
            >
              Podcasts
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator className="text-gray-500"/>
          <BreadcrumbItem>
            <BreadcrumbLink
              href={`/podcasts/${formattedPodcastHost}`}
              className="font-medium text-sky-700 hover:text-sky-700"
            >
              {podcastHost}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator className="text-gray-500"/>
        </BreadcrumbList>
      </Breadcrumb>
      <article className="podcast-summary">
        <header>
          <h1 className="my-7">{title}</h1>
          <div className="text-gray-700">
            Posted{" "}
            <time dateTime={parseISO(publishedAt).toISOString()}>
              {formattedDate}
            </time>
          </div>
          <Image
            src={imageUrl}
            alt={`Thumbnail for ${title}`}
            width={1280}
            height={720}
            sizes="(min-width: 768px) 50vw, 100vw"
            quality={100}
            priority
            className="my-7 h-auto w-full"
            placeholder={solidColorPlaceholder}
          />
        </header>
        {children}
      </article>
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
      <ScrollToTop />
    </div>
  );
}
