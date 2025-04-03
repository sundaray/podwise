import { chrisWilliamsonPodcastList } from "@/podcast-list/chris-williamson";
import { PodcastCard } from "@/components/podcast-card";

export default function ChrisWilliamsonPodcastPage() {
  const host = "chris-williamson";

  return (
    <div className="mx-auto max-w-6xl px-4">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 md:gap-10">
        {chrisWilliamsonPodcastList.map((podcast) => (
          <PodcastCard key={podcast.slug} podcast={podcast} hostPath={host} />
        ))}
      </div>
    </div>
  );
}
