import Link from "next/link";
import Image from "next/image";
import { getVideoDetails } from "@/lib/get-video-details";

type PodcastCardProps = {
  podcast: {
    title: string;
    slug: string;
    image: string;
    podcastHost: string;
    videoId: string;
  };
  hostPath: string;
};

const solidColorPlaceholder =
  "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1 1' fill='%23F3F4F6'%3E%3Crect width='1' height='1'/%3E%3C/svg%3E";

export async function PodcastCard({ podcast, hostPath }: PodcastCardProps) {
  const { title, slug, image, videoId } = podcast;

  const videoDetails = await getVideoDetails(videoId);

  return (
    <div className="group relative overflow-hidden">
      <div className="aspect-video overflow-hidden">
        <Image
          src={`https://podcast-summaries-dev.s3.amazonaws.com/podcast-thumbnails/${hostPath}/${image}`}
          alt={`Thumbnail for ${title}`}
          width={1280}
          height={720}
          sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, (min-width: 640px) 50vw, 100vw"
          quality={100}
          priority
          className="h-auto w-full object-cover transition-all duration-200 group-hover:brightness-80"
          placeholder={solidColorPlaceholder}
        />
      </div>

      <h2 className="text-md mt-2 font-bold tracking-tight text-gray-900 transition-colors group-hover:text-sky-600 md:text-lg">
        {title}
      </h2>

      {videoDetails && (
        <p className="mt-2 text-sm text-gray-500">
          {videoDetails.formattedViewCount} •{" "}
          {videoDetails.formattedPublishedDate}
        </p>
      )}

      <Link
        href={`/podcasts/${hostPath}/${slug}`}
        className="absolute inset-0"
        aria-label={`Read summary of ${title}`}
      />
    </div>
  );
}
