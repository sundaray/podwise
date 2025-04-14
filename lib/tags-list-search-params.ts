import { parseAsString, createLoader } from "nuqs/server";

// Define search parameters for the tags page
export const tagsListSearchParams = {
  query: parseAsString.withDefault(""),
};

// Create a loader function that handles parsing all parameters
export const loadTagsListSearchParams = createLoader(
  tagsListSearchParams,
);

