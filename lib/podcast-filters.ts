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

function filterPodcastsByShows<T extends { podcastHost: string }>(
  podcasts: T[],
  shows: string[] | null,
): T[] {
  if (!shows || shows.length === 0) {
    return podcasts;
  }

  // Direct mapping from show ID to actual podcastHost field value
  const showToHostMap: Record<string, string> = {
    "andrew-huberman": "Andrew Huberman",
    "chris-williamson": "Chris Williamson",
    "daily-stoic": "Daily Stoic",
    doac: "The Diary Of A CEO",
    "jack-neel": "Jack Neel",
    "jay-shetty": "Jay Shetty",
    "lewis-howes": "Lewis Howes",
    "mel-robbins": "Mel Robbins",
    "nathan-barry": "Nathan Barry",
    "rangan-chatterjee": "Dr Rangan Chatterjee",
    "scott-d-clary": "Scott D. Clary",
    "simon-sinek": "Simon Sinek",
    "tim-ferriss": "Tim Ferriss",
  };

  return podcasts.filter((podcast) => {
    // Check if any of the selected shows match this podcast's host
    return shows.some((showId) => {
      const hostName = showToHostMap[showId];
      return hostName && podcast.podcastHost === hostName;
    });
  });
}

function filterPodcasts<
  T extends { title: string; isPremium?: boolean; podcastHost: string },
>(
  podcasts: T[],
  tier: "all" | "free" | "premium",
  query: string,
  shows: string[] | null,
): T[] {
  // Apply filters in sequence
  let filtered = filterPodcastsByTier(podcasts, tier);
  filtered = filterPodcastsByQuery(filtered, query);
  filtered = filterPodcastsByShows(filtered, shows);

  return filtered;
}

export {
  filterPodcastsByTier,
  filterPodcastsByQuery,
  filterPodcastsByShows,
  filterPodcasts,
};
