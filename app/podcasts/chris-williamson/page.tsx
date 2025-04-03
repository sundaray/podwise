import Link from "next/link";
import Image from "next/image";
import { chrisWilliamsonPodcastList } from "@/podcast-list/chris-williamson";

export default function ChrisWilliamsonPodcastPage() {
  const host = "chris-williamson"; // This could be dynamic if needed

  // Tiny 1x1 SVG for solid color #F3F4F6, URL-encoded for Data URL
  const solidColorPlaceholder =
    "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1 1' fill='%23F3F4F6'%3E%3Crect width='1' height='1'/%3E%3C/svg%3E";

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">Chris Williamson Podcasts</h1>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {chrisWilliamsonPodcastList.map((podcast) => (
          <div key={podcast.slug} className="group relative overflow-hidden">
            <div className="aspect-video overflow-hidden">
              <Image
                src={`https://podcast-summaries-dev.s3.amazonaws.com/podcast-thumbnails/${host}/${podcast.image}`}
                alt={`Thumbnail for ${podcast.title}`}
                width={1280}
                height={720}
                sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, (min-width: 640px) 50vw, 100vw"
                quality={100}
                className="h-full w-full object-cover transition-all duration-300 group-hover:brightness-70"
                placeholder={solidColorPlaceholder}
              />
            </div>

            <h2 className="mt-3 text-lg font-bold text-gray-900 transition-colors duration-300 group-hover:text-sky-600">
              {podcast.title}
            </h2>

            <Link
              href={`/podcasts/${host}/${podcast.slug}`}
              className="absolute inset-0"
              aria-label={`Read summary of ${podcast.title}`}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
