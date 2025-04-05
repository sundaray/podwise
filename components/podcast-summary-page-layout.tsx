import Image from "next/image";
import Link from "next/link";
import { Frontmatter } from "@/types";
import { format, parseISO } from "date-fns";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { formatHostForUrl } from "@/lib/utils";
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
  const { title, publishedAt, updatedAt, tags, image, podcastHost } =
    frontmatter;

  const formattedPodcastHost = formatHostForUrl(podcastHost);

  console.log("Podcast host: ", formattedPodcastHost);

  const imageUrl = `https://podcast-summaries-dev.s3.amazonaws.com/podcast-thumbnails/${formattedPodcastHost}/${image}`;

  const formattedDate = format(parseISO(publishedAt), "MMMM d, yyyy");

  return (
    <div className="podcast-summary mx-auto max-w-3xl px-4 md:px-8">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink
              href="/"
              className="font-medium text-sky-600 hover:text-sky-600 hover:underline hover:underline-offset-2"
            >
              Home
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink
              href={`/podcasts/${formattedPodcastHost}`}
              className="font-medium text-sky-600 hover:text-sky-600 hover:underline hover:underline-offset-2"
            >
              {podcastHost}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
        </BreadcrumbList>
      </Breadcrumb>
      <article className="podcast-summary">
        <header>
          <h1 className="my-7">{title}</h1>
          <div className="font-medium text-gray-500">
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
      <div className="mt-7 flex items-center">
        <span className="mr-4 font-semibold text-gray-900">Tags:</span>
        <ul className="flex flex-wrap gap-3">
          {tags.map((tag) => (
            <li key={tag}>
              <Link
                href={`/tags/${tag.toLowerCase()}`}
                className="rounded-full border bg-gray-100 px-2 py-1 text-sm font-medium text-gray-700 transition hover:bg-gray-200 hover:text-gray-900 md:px-4 md:py-2"
              >
                {tag}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <ScrollToTop />
    </div>
  );
}
