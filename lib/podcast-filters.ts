function filterPodcastsByTier<T extends { isPremium?: boolean }>(
  podcasts: T[],
  tier: "all" | "free" | "premium",
): T[] {
  // If type is "all" or invalid, return all podcasts without filtering
  if (tier === "all") {
    return podcasts;
  }

  // For "free" or "premium" types, filter the podcasts accordingly
  return podcasts.filter((podcast) => {
    // If the podcast doesn't have the isPremium property defined,
    // treat it as a free podcast (isPremium = false) for safety
    const isPremium = podcast.isPremium ?? false;

    // For "free" tier, include podcasts where isPremium is false
    // For "premium" tier, include podcasts where isPremium is true
    return tier === "free" ? !isPremium : isPremium;
  });
}

function isValidPodcastType(tier: string): tier is "all" | "free" | "premium" {
  return ["all", "free", "premium"].includes(tier);
}

export { filterPodcastsByTier, isValidPodcastType };
