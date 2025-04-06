// lib/get-podcast-tags.ts
import { chrisWilliamsonPodcastList } from "@/podcast-list/chris-williamson";
// Import other podcast lists as needed

export function getPodcastTags() {
  // Combine all podcast lists
  const allPodcasts = [
    ...chrisWilliamsonPodcastList,
    // Add other podcast lists as needed
  ];

  // Create a Map to track tag counts
  const tagCountMap = new Map<string, number>();

  // Count occurrences of each tag
  allPodcasts.forEach((podcast) => {
    if (podcast.tags && Array.isArray(podcast.tags)) {
      podcast.tags.forEach((tag) => {
        const trimmedTag = tag.trim();
        const currentCount = tagCountMap.get(trimmedTag) || 0;
        tagCountMap.set(trimmedTag, currentCount + 1);
      });
    }
  });

  // Group by first letter using a Map
  const tagsByLetter = new Map<
    string,
    Array<{ id: string; name: string; count: number }>
  >();

  // Convert the Map to an array of [tag, count] and sort alphabetically by tag
  Array.from(tagCountMap.entries())
    .sort(([tagA], [tagB]) => tagA.localeCompare(tagB))
    .forEach(([tag, count]) => {
      const firstLetter = tag.charAt(0).toUpperCase();

      if (!tagsByLetter.has(firstLetter)) {
        tagsByLetter.set(firstLetter, []);
      }

      // Include the count in our tag object
      tagsByLetter.get(firstLetter)?.push({
        id: tag,
        name: tag,
        count: count,
      });
    });

  return {
    uniqueTagCount: tagCountMap.size,
    tagsByLetter,
    letters: Array.from(tagsByLetter.keys()).sort(),
  };
}
