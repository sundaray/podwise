import Image from "next/image";
import { Frontmatter } from "@/types";
import { format, parseISO } from "date-fns";
import { formatHostForUrl } from "@/lib/utils";
import { PodcastBreadcrumbs } from "@/components/podcast-breadcrumbs";
import { PodcastSummaryTags } from "@/components/podcast-summary-tags";
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

  return (
    <div className="mx-auto max-w-3xl px-4 md:px-8">
      <PodcastBreadcrumbs podcastHost={podcastHost} />
      <article className="podcast-summary">
        <header>
          <h1 className="my-7">{title}</h1>
          <div className="relative font-medium flex items-center pl-4 text-gray-700 before:absolute before:left-0 before:h-3 before:w-[1.5px] before:bg-sky-700">
            Posted
            <time
              dateTime={parseISO(publishedAt).toISOString()}
              className="ml-2"
            >
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
            className="my-7 h-auto w-full shadow-md"
            placeholder={solidColorPlaceholder}
          />
        </header>
        {children}
      </article>
      <PodcastSummaryTags tags={tags} />
      <ScrollToTop />
    </div>
  );
}
