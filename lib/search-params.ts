import { parseAsIndex } from "nuqs";
import { createLoader } from "nuqs/server";

export const paginationParams = {
  page: parseAsIndex, // Default to first page (index 0)
};

export const loadSearchParams = createLoader(paginationParams);
