function filterPodcastsByTier<T extends { isPremium?: boolean }>(
  podcasts: T[],
  tier: "all" | "free" | "premium",
): T[] {
  if (tier === "all") {
    return podcasts;
  }

  return podcasts.filter((podcast) => {
    const isPremium = podcast.isPremium ?? false;
    return tier === "free" ? !isPremium : isPremium;
  });
}

function filterPodcastsByQuery<T extends { title: string }>(
  podcasts: T[],
  query: string,
): T[] {
  if (!query.trim()) {
    return podcasts;
  }

  const normalizedQuery = query.trim().toLowerCase();

  return podcasts.filter((podcast) =>
    podcast.title.toLowerCase().includes(normalizedQuery),
  );
}

function filterPodcasts<T extends { title: string; isPremium?: boolean }>(
  podcasts: T[],
  tier: "all" | "free" | "premium",
  query: string,
): T[] {
  const tierFiltered = filterPodcastsByTier(podcasts, tier);

  return filterPodcastsByQuery(tierFiltered, query);
}

export { filterPodcastsByTier, filterPodcastsByQuery, filterPodcasts };
