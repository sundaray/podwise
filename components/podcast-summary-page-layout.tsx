import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { Frontmatter } from "@/types";
import { format, parseISO } from "date-fns";
import { formatHostForUrl } from "@/lib/utils";
import { PodcastBreadcrumbs } from "@/components/podcast-breadcrumbs";
import { PodcastSummaryTags } from "@/components/podcast-summary-tags";
import { ScrollToTop } from "@/components/scroll-to-top";
import { getUserSession } from "@/lib/auth/session";
import type { Metadata } from "next";

type PodcastSummaryPageLayoutProps = {
  children: React.ReactNode;
  frontmatter: Frontmatter;
};

// Tiny 1x1 SVG for solid color #F3F4F6, URL-encoded for Data URL
const solidColorPlaceholder =
  "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1 1' fill='%23F3F4F6'%3E%3Crect width='1' height='1'/%3E%3C/svg%3E";

  
  export async function generateMetadata({
    frontmatter,
  }: {
    frontmatter: Frontmatter;
  }): Promise<Metadata> {
    const { title, description, publishedAt, tags, image, podcastHost, isPremium } = frontmatter;
    
    // Format the podcast host for the URL
    const formattedPodcastHost = formatHostForUrl(podcastHost);
    
    // Build image URL for social sharing
    const imageUrl = `https://podcast-summaries-dev.s3.amazonaws.com/podcast-thumbnails/${formattedPodcastHost}/${image}`;
    
    // Create base metadata
    const metadata: Metadata = {
      title: `${title} | ${podcastHost} Podcast Summary`,
      description: description, // Using the description directly from frontmatter
      keywords: tags,
      
      // Open Graph metadata (for Facebook, LinkedIn, etc.)
      openGraph: {
        title: title,
        description: description,
        type: 'article',
        publishedTime: publishedAt,
        images: [{
          url: imageUrl,
          width: 1280,
          height: 720,
          alt: `Thumbnail for ${title}`,
        }],
      },
      
      // Twitter metadata
      twitter: {
        card: 'summary_large_image',
        title: title,
        description: description,
        images: [imageUrl],
      },
    };
    
    // Add noindex directive for premium content
    if (isPremium) {
      metadata.robots = {
        index: false,
        follow: true,
      };
    }
    
    return metadata;
  }


export async function PodcastSummaryPageLayout({
  children,
  frontmatter,
}: PodcastSummaryPageLayoutProps) {
  const {
    title,
    description,
    publishedAt,
    tags,
    image,
    podcastHost,
    isPremium,
  } = frontmatter;

  // Get user session
  const { user } = await getUserSession();
  const isAuthenticated = !!user;

  // Check if the user has premium access
  const hasPremiumAccess =
    user && (user.annualAccessStatus || user.lifetimeAccessStatus);

  // If this is a premium podcast and the user is authenticated but doesn't have premium access, redirect to premium page
  if (isPremium && isAuthenticated && !hasPremiumAccess) {
    redirect("/premium");
  }

  const formattedPodcastHost = formatHostForUrl(podcastHost);

  const imageUrl = `https://podcast-summaries-dev.s3.amazonaws.com/podcast-thumbnails/${formattedPodcastHost}/${image}`;

  const formattedDate = format(parseISO(publishedAt), "MMMM d, yyyy");

  const headersList = await headers();

  // Default to false if header is not present
  const limitReachedStr = headersList.get("x-limit-reached") || "false";
  const limitReached = limitReachedStr === "true";

  return (
    <div className="mx-auto max-w-3xl px-4 md:px-8">
      <PodcastBreadcrumbs podcastHost={podcastHost} />
      <article className="podcast-summary relative">
        <header>
          <h1 className="my-7">{title}</h1>
          <div className="relative flex items-center pl-4 font-medium text-gray-700 before:absolute before:left-0 before:h-3 before:w-[1.5px] before:bg-sky-700">
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

        {/* Conditional paywall overlay based on authentication status */}
        {limitReached && (
          <div className="absolute inset-0 z-10 flex flex-col items-center bg-white/70 p-6 text-center backdrop-blur-sm">
            <h2 className="mb-2 text-2xl font-semibold">
              Daily Free Reading Limit Reached
            </h2>

            {!isAuthenticated ? (
              /* Unauthenticated User Message */
              <>
                <p className="mb-2 text-pretty text-gray-700">
                  Unauthenticated users can read only 1 free summary per day.
                </p>
                <p className="mb-6 text-pretty text-gray-700">
                  Sign in to read 2 free summaries per day, or go premium for
                  unlimited access to all summaries.
                </p>
                <div className="flex gap-4">
                  <Link
                    href="/premium"
                    className="inline-flex items-center rounded-full bg-linear-to-b from-amber-400 to-amber-500 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-amber-400 hover:text-gray-900"
                  >
                    Go Premium
                  </Link>
                  <Link
                    href="/signin"
                    className="inline-flex items-center rounded-full bg-gray-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-900 hover:text-white"
                  >
                    Sign in
                  </Link>
                </div>
              </>
            ) : (
              /* Authenticated User Message */
              <>
                <p className="mb-2 text-pretty">
                  Authenticated users can read only 2 free summaries per day.
                </p>
                <p className="mb-6 text-pretty">
                  For unlimited access to both free and premium summaries,
                  upgrade to premium.
                </p>
                <Link
                  href="/premium"
                  className="inline-flex items-center rounded-full bg-linear-to-b from-amber-400 to-amber-500 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-amber-400 hover:text-gray-900"
                >
                  Go Premium
                </Link>
              </>
            )}
          </div>
        )}
      </article>
      <PodcastSummaryTags tags={tags} />
      <ScrollToTop />
    </div>
  );
}
