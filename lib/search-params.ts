import { parseAsInteger, createLoader } from "nuqs/server";

export const podcastListSearchParams = {
  page: parseAsInteger.withDefault(1),
};

export const loadPodcastListSearchParams = createLoader(
  podcastListSearchParams,
);
