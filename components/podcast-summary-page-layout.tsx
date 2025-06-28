import Link from "next/link";
import { headers } from "next/headers";
import { Frontmatter } from "@/types";
import { format, parseISO } from "date-fns";
import { formatHostForUrl } from "@/lib/utils";
import { PodcastBreadcrumbs } from "@/components/podcast-breadcrumbs";
import { PodcastSummaryTags } from "@/components/podcast-summary-tags";
import { ScrollToTop } from "@/components/scroll-to-top";
import { getUserSession } from "@/lib/auth/session";
import type { Metadata } from "next";
import { SubscriptionForm } from "@/components/subscription/subscription-form";
import { Article, WithContext } from "schema-dts";

type PodcastSummaryPageLayoutProps = {
  children: React.ReactNode;
  frontmatter: Frontmatter;
};

export async function generateMetadata({
  frontmatter,
}: {
  frontmatter: Frontmatter;
}): Promise<Metadata> {
  const {
    title,
    description,
    publishedAt,
    tags,
    image,
    podcastHost,
    isPremium,
  } = frontmatter;

  // Format the podcast host for the URL
  const formattedPodcastHost = formatHostForUrl(podcastHost);

  // Build image URL for social sharing
  const imageUrl = `https://podcast-summaries-dev.s3.amazonaws.com/podcast-thumbnails/${formattedPodcastHost}/${image}`;

  // Create base metadata
  const metadata: Metadata = {
    title: `${title} | ${podcastHost} Podcast Summary`,
    description: description,
    keywords: tags,
  };

  return metadata;
}

export async function PodcastSummaryPageLayout({
  children,
  frontmatter,
}: PodcastSummaryPageLayoutProps) {
  const { title, publishedAt, tags, image, podcastHost, isPremium } =
    frontmatter;

  // Get user session
  const { user } = await getUserSession();
  const isAuthenticated = !!user;

  // Check if the user has premium access
  const hasPremiumAccess =
    user && (user.annualAccessStatus || user.lifetimeAccessStatus);

  const formattedPodcastHost = formatHostForUrl(podcastHost);

  const formattedDate = format(parseISO(publishedAt), "MMMM d, yyyy");

  const headersList = await headers();

  // Default to false if header is not present
  const limitReachedStr = headersList.get("x-limit-reached") || "false";
  const limitReached = limitReachedStr === "true";

  const showPaywall = isPremium && (!isAuthenticated || !hasPremiumAccess);

  const jsonLd: WithContext<Article> | null = isPremium
    ? {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: title,
        description: frontmatter.description,
        image: `https://podcast-summaries-dev.s3.amazonaws.com/podcast-thumbnails/${formattedPodcastHost}/${image}`,
        datePublished: publishedAt,
        isAccessibleForFree: false,
        hasPart: {
          "@type": "WebPageElement",
          isAccessibleForFree: false,
          cssSelector: ".premium-content",
        },
      }
    : null;

  return (
    <div className="mx-auto max-w-3xl px-4 md:px-8">
      {isPremium && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
          }}
        />
      )}
      <PodcastBreadcrumbs podcastHost={podcastHost} />
      <article className="podcast-summary relative">
        <header>
          <h1 className="my-7">{title}</h1>
          <div className="relative flex items-center pl-4 text-gray-600 before:absolute before:left-0 before:h-3 before:w-[1.5px] before:bg-sky-600">
            Posted
            <time
              dateTime={parseISO(publishedAt).toISOString()}
              className="ml-2"
            >
              {formattedDate}
            </time>
          </div>
          <div className="relative my-7 aspect-[16/9] w-full bg-gray-100">
            <picture className="absolute inset-0 h-full w-full">
              <source
                type="image/webp"
                srcSet={`
        https://podcast-summaries-dev.s3.amazonaws.com/podcast-thumbnails/${formattedPodcastHost}/${image.replace(".jpg", "-sm.webp")} 400w,
        https://podcast-summaries-dev.s3.amazonaws.com/podcast-thumbnails/${formattedPodcastHost}/${image.replace(".jpg", "-md.webp")} 640w,
        https://podcast-summaries-dev.s3.amazonaws.com/podcast-thumbnails/${formattedPodcastHost}/${image.replace(".jpg", "-lg.webp")} 800w,
        https://podcast-summaries-dev.s3.amazonaws.com/podcast-thumbnails/${formattedPodcastHost}/${image.replace(".jpg", ".webp")} 1280w
      `}
                sizes="(min-width: 768px) 33vw, (min-width: 640px) 50vw, 100vw"
              />
              <source
                type="image/jpeg"
                srcSet={`
        https://podcast-summaries-dev.s3.amazonaws.com/podcast-thumbnails/${formattedPodcastHost}/${image.replace(".jpg", "-sm.jpg")} 400w,
        https://podcast-summaries-dev.s3.amazonaws.com/podcast-thumbnails/${formattedPodcastHost}/${image.replace(".jpg", "-md.jpg")} 640w,
        https://podcast-summaries-dev.s3.amazonaws.com/podcast-thumbnails/${formattedPodcastHost}/${image.replace(".jpg", "-lg.jpg")} 800w,
        https://podcast-summaries-dev.s3.amazonaws.com/podcast-thumbnails/${formattedPodcastHost}/${image} 1280w
      `}
                sizes="(min-width: 768px) 33vw, (min-width: 640px) 50vw, 100vw"
              />
              <img
                src={`https://podcast-summaries-dev.s3.amazonaws.com/podcast-thumbnails/${formattedPodcastHost}/${image}`}
                alt={`Thumbnail of podcast titled ${title}`}
                width="1280"
                height="720"
                loading="eager"
                className="h-full w-full object-cover"
              />
            </picture>
          </div>
        </header>
        {/* Content wrapper with conditional styling */}
        <div className={`${showPaywall ? "relative" : ""}`}>
          {/* Content preview wrapper */}
          <div className={showPaywall ? "max-h-80 overflow-hidden" : ""}>
            <div className={isPremium ? "premium-content" : ""}>{children}</div>
          </div>

          {/* Gradient fade overlay */}
          {showPaywall && (
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent from-20% via-white/80 via-60% to-white" />
          )}
        </div>

        {/* Paywall CTA - positioned where the white gradient starts */}
        {showPaywall && (
          <div className="mx-auto max-w-md px-4 text-center">
            <h2 className="mb-2 text-xl font-bold text-gray-900">
              Continue Reading
            </h2>
            <p className="mb-4 text-sm text-gray-700">
              Get unlimited access to all premium summaries.
            </p>
            <Link
              href="/premium"
              className="inline-flex items-center justify-center rounded-full bg-gradient-to-b from-amber-400 to-amber-500 px-4 py-2 text-sm font-medium text-gray-900 transition-colors hover:from-amber-300 hover:to-amber-400"
            >
              Go Premium
            </Link>
          </div>
        )}

        {/* Conditional paywall for FREE summary pages */}
        {limitReached && !isPremium && (
          <div className="absolute inset-0 z-10 flex flex-col items-center bg-white/70 p-6 text-center backdrop-blur-sm">
            <h2 className="mb-2 text-2xl font-bold text-pretty">
              Daily Free Reading Limit Reached
            </h2>

            {!isAuthenticated ? (
              /* Unauthenticated User Message */
              <>
                <p className="mb-2 text-pretty text-gray-600">
                  Unauthenticated users can read only 1 free summary per day.
                </p>
                <p className="mb-6 text-pretty text-gray-600">
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
      <SubscriptionForm />
      <ScrollToTop />
    </div>
  );
}
