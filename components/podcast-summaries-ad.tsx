import Link from "next/link";

export function PodcastSummariesAd() {
  return (
    <div className="podcast-summaries-ad flex flex-col items-center space-y-4 rounded-xl bg-sky-600 p-6">
      <h3 className="mt-0 text-center text-3xl font-bold text-pretty text-white">
        Best Ideas from the World&apos;s Best Podcasts
      </h3>
      <p className="text-md text-center text-sky-200">
        Love podcasts but short on time? I extract the key takeaways from
        hour-long episodes, so you can learn faster and apply ideas immediately.
      </p>
      <Link
        href="/podcasts"
        className="cta-link w-fit rounded-full bg-sky-700 px-6 py-3 font-medium text-white"
      >
        Explore all podcast summaries
      </Link>
    </div>
  );
}
