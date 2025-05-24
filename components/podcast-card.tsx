import Link from "next/link";
import { Icons } from "@/components/icons";
import { formatVideoUploadDate } from "@/lib/format-video-upload-date";

type PodcastCardProps = {
  podcast: {
    title: string;
    slug: string;
    image: string;
    podcastHost: string;
    videoId: string;
    isPremium: boolean;
    videoUploadedAt: string;
  };
  hostPath: string;
  index: number;
};

// const solidColorPlaceholder =
//   "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1 1' fill='%23F3F4F6'%3E%3Crect width='1' height='1'/%3E%3C/svg%3E";

export async function PodcastCard({
  podcast,
  hostPath,
  index,
}: PodcastCardProps) {
  const { title, slug, image, podcastHost, videoUploadedAt, isPremium } =
    podcast;

  const isAboveFold = index < 6;
  const formattedDate = formatVideoUploadDate(videoUploadedAt);

  return (
    <div className="group/card relative">
      {isPremium && (
        <div className="absolute top-0 right-0 z-10 flex w-auto items-center justify-center gap-1 bg-linear-to-b from-amber-400 to-amber-500 p-1">
          <Icons.lock className="size-3 text-gray-700" />
          <p className="text-xs font-medium text-gray-700">Premium</p>
        </div>
      )}
      <div className="relative aspect-[16/9] w-full bg-gray-100">
        <picture className="absolute inset-0 h-full w-full">
          <source
            type="image/webp"
            srcSet={`
        https://podcast-summaries-dev.s3.amazonaws.com/podcast-thumbnails/${hostPath}/${image.replace(".jpg", "-sm.webp")} 400w,
        https://podcast-summaries-dev.s3.amazonaws.com/podcast-thumbnails/${hostPath}/${image.replace(".jpg", "-md.webp")} 640w,
        https://podcast-summaries-dev.s3.amazonaws.com/podcast-thumbnails/${hostPath}/${image.replace(".jpg", "-lg.webp")} 800w,
        https://podcast-summaries-dev.s3.amazonaws.com/podcast-thumbnails/${hostPath}/${image.replace(".jpg", ".webp")} 1280w
      `}
            sizes="(min-width: 768px) 33vw, (min-width: 640px) 50vw, 100vw"
          />
          <source
            type="image/jpeg"
            srcSet={`
        https://podcast-summaries-dev.s3.amazonaws.com/podcast-thumbnails/${hostPath}/${image.replace(".jpg", "-sm.jpg")} 400w,
        https://podcast-summaries-dev.s3.amazonaws.com/podcast-thumbnails/${hostPath}/${image.replace(".jpg", "-md.jpg")} 640w,
        https://podcast-summaries-dev.s3.amazonaws.com/podcast-thumbnails/${hostPath}/${image.replace(".jpg", "-lg.jpg")} 800w,
        https://podcast-summaries-dev.s3.amazonaws.com/podcast-thumbnails/${hostPath}/${image} 1280w
      `}
            sizes="(min-width: 768px) 33vw, (min-width: 640px) 50vw, 100vw"
          />
          <img
            src={`https://podcast-summaries-dev.s3.amazonaws.com/podcast-thumbnails/${hostPath}/${image}`}
            alt={`Thumbnail of podcast titled ${title}`}
            width="1280"
            height="720"
            loading={isAboveFold ? "eager" : "lazy"}
            fetchPriority={isAboveFold ? "high" : "auto"}
            decoding={isAboveFold ? "auto" : "async"}
            className="h-full w-full object-cover transition-all group-hover/card:brightness-80"
          />
        </picture>
      </div>
      <h2 className="text-md mt-2 font-bold tracking-tight text-pretty text-gray-900 transition-colors group-hover/card:text-sky-700 md:text-lg">
        {title}
      </h2>

      {formattedDate && (
        <p className="mt-2 flex items-center text-sm font-medium text-gray-600 transition-colors group-hover/card:text-gray-500">
          <span>{podcastHost}</span>

          <span className="mx-1.5 text-gray-500">•</span>

          <span>{formattedDate}</span>
        </p>
      )}

      <Link
        href={`/podcasts/${hostPath}/${slug}`}
        prefetch={false}
        className="absolute inset-0"
        aria-label={`Read summary of ${title}`}
      />
    </div>
  );
}
