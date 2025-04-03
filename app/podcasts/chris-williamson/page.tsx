import { chrisWilliamsonPodcastList } from "@/podcast-list/chris-williamson";
import { PodcastCard } from "@/components/podcast-card";
import { getVideoDetails } from "@/lib/get-video-details";

export default async function ChrisWilliamsonPodcastPage() {
  const host = "chris-williamson";

  // Fetch all video details in parallel
  const podcastsWithDetails = await Promise.all(
    chrisWilliamsonPodcastList.map(async (podcast) => {
      const videoDetails = await getVideoDetails(podcast.videoId);
      return {
        ...podcast,
        publishedAt: videoDetails?.publishedAt || null,
      };
    }),
  );

  // Sort podcasts by YouTube published date (newest first)
  const sortedPodcasts = [...podcastsWithDetails].sort((a, b) => {
    // If no publishedAt date is available, treat it as oldest
    const dateA = a.publishedAt ? new Date(a.publishedAt) : new Date(0);
    const dateB = b.publishedAt ? new Date(b.publishedAt) : new Date(0);

    // Sort in descending order (newest first)
    return dateB.getTime() - dateA.getTime();
  });

  return (
    <div className="container mx-auto max-w-5xl px-4">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 md:gap-10">
        {sortedPodcasts.map((podcast) => (
          <PodcastCard key={podcast.slug} podcast={podcast} hostPath={host} />
        ))}
      </div>
    </div>
  );
}
