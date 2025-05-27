import { andrewHubermanPodcastList } from "@/podcast-list/andrew-huberman";
import { chrisWilliamsonPodcastList } from "@/podcast-list/chris-williamson";
import { dailyStoicPodcastList } from "@/podcast-list/daily-stoic";
import { doacPodcastList } from "@/podcast-list/doac";
import { edMylettPodcastList } from "@/podcast-list/ed-mylett";
import { jackNeelPodcastList } from "@/podcast-list/jack-neel";
import { jayShettyPodcastList } from "@/podcast-list/jay-shetty";
import { lewisHowesPodcastList } from "@/podcast-list/lewis-howes";
import { melRobbinsPodcastList } from "@/podcast-list/mel-robbins";
import { nathanBarryPodcastList } from "@/podcast-list/nathan-barry";
import { paulMillerdPodcastList } from "@/podcast-list/paul-millerd";
import { ranganChatterjeePodcastList } from "@/podcast-list/rangan-chatterjee";
import { scottDClaryPodcastList } from "@/podcast-list/scott-d-clary";
import { simonSinekPodcastList } from "@/podcast-list/simon-sinek";
import { timFerrissPodcastList } from "@/podcast-list/tim-ferriss";

export function getPodcastTags() {
  const allPodcasts = [
    ...andrewHubermanPodcastList,
    ...chrisWilliamsonPodcastList,
    ...dailyStoicPodcastList,
    ...doacPodcastList,
    ...edMylettPodcastList,
    ...jackNeelPodcastList,
    ...jayShettyPodcastList,
    ...lewisHowesPodcastList,
    ...melRobbinsPodcastList,
    ...nathanBarryPodcastList,
    ...paulMillerdPodcastList,
    ...ranganChatterjeePodcastList,
    ...scottDClaryPodcastList,
    ...simonSinekPodcastList,
    ...timFerrissPodcastList,
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
