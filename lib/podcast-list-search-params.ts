import {
  parseAsInteger,
  parseAsString,
  parseAsArrayOf,
  createLoader,
} from "nuqs/server";

// Define all the search parameters for podcast listings
export const podcastListSearchParams = {
  page: parseAsInteger.withDefault(1),
  tier: parseAsString.withDefault("all"),
  query: parseAsString.withDefault(""),
  shows: parseAsArrayOf(parseAsString).withDefault([]),
};

// Create a loader function that handles parsing all parameters
export const loadPodcastListSearchParams = createLoader(
  podcastListSearchParams,
);

// Type for podcast filter values (for type safety)
export type PodcastType = "all" | "free" | "premium";
