import { BlogFrontmatter } from "@/types";
import { format, parseISO } from "date-fns";
import { BlogBreadcrumbs } from "@/components/blog-breadcrumbs";
import { ScrollToTop } from "@/components/scroll-to-top";
import type { Metadata } from "next";

type BlogPageLayoutProps = {
  children: React.ReactNode;
  frontmatter: BlogFrontmatter;
};

export async function generateMetadata({
  frontmatter,
}: {
  frontmatter: BlogFrontmatter;
}): Promise<Metadata> {
  const { title, description, publishedAt, tags, image } = frontmatter;

  // Build image URL for social sharing
  const imageUrl = `https://podcast-summaries-dev.s3.amazonaws.com/blog-images/${image}`;

  // Create base metadata
  const metadata: Metadata = {
    title: `${title}`,
    description: description,
    keywords: tags,

    // Open Graph metadata (for Facebook, LinkedIn, etc.)
    openGraph: {
      title: title,
      description: description,
      type: "article",
      publishedTime: publishedAt,
      images: [
        {
          url: imageUrl,
          width: 1280,
          height: 720,
          alt: `Thumbnail for ${title}`,
        },
      ],
    },

    // Twitter metadata
    twitter: {
      card: "summary_large_image",
      title: title,
      description: description,
      images: [imageUrl],
    },
  };

  return metadata;
}

export async function BlogPageLayout({
  children,
  frontmatter,
}: BlogPageLayoutProps) {
  const { title, publishedAt, tags, image } = frontmatter;

  const formattedDate = format(parseISO(publishedAt), "MMMM d, yyyy");

  return (
    <div className="mx-auto max-w-3xl px-4 md:px-8">
      <BlogBreadcrumbs />
      <article className="podcast-summary relative">
        <header>
          <h1 className="my-7">{title}</h1>
          <div className="relative pl-4 text-gray-600 before:absolute before:left-0 before:h-full before:w-[1.5px] before:bg-sky-600">
            <div className="mb-1">By Hemanta Sundaray</div>
            <div className="flex items-center">
              Posted
              <time
                dateTime={parseISO(publishedAt).toISOString()}
                className="ml-2"
              >
                {formattedDate}
              </time>
            </div>
          </div>
          <div className="relative my-7 aspect-[16/9] w-full bg-gray-100">
            <picture className="absolute inset-0 h-full w-full">
              <source
                type="image/webp"
                srcSet={`
        https://podcast-summaries-dev.s3.amazonaws.com/blog-images/${image.replace(".jpg", "-sm.webp")} 400w,
        https://podcast-summaries-dev.s3.amazonaws.com/blog-images/${image.replace(".jpg", "-md.webp")} 640w,
        https://podcast-summaries-dev.s3.amazonaws.com/blog-images/${image.replace(".jpg", "-lg.webp")} 800w,
        https://podcast-summaries-dev.s3.amazonaws.com/blog-images/${image.replace(".jpg", ".webp")} 1280w
      `}
                sizes="(min-width: 768px) 33vw, (min-width: 640px) 50vw, 100vw"
              />
              <source
                type="image/jpeg"
                srcSet={`
        https://podcast-summaries-dev.s3.amazonaws.com/blog-images/${image.replace(".jpg", "-sm.jpg")} 400w,
        https://podcast-summaries-dev.s3.amazonaws.com/blog-images/${image.replace(".jpg", "-md.jpg")} 640w,
        https://podcast-summaries-dev.s3.amazonaws.com/blog-images/${image.replace(".jpg", "-lg.jpg")} 800w,
        https://podcast-summaries-dev.s3.amazonaws.com/blog-images/${image} 1280w
      `}
                sizes="(min-width: 768px) 33vw, (min-width: 640px) 50vw, 100vw"
              />
              <img
                src={`https://podcast-summaries-dev.s3.amazonaws.com/blog-images/${image}`}
                alt={`Thumbnail of podcast titled ${title}`}
                width="1280"
                height="720"
                loading="eager"
                className="h-full w-full object-cover"
              />
            </picture>
          </div>
        </header>
        {children}
      </article>
      <ScrollToTop />
    </div>
  );
}
