function filterPodcastsByType<T extends { isPremium?: boolean }>(
    podcasts: T[],
    type: "all" | "free" | "premium"
  ): T[] {
    // If type is "all" or invalid, return all podcasts without filtering
    if (type === "all") {
      return podcasts;
    }
    
    // For "free" or "premium" types, filter the podcasts accordingly
    return podcasts.filter(podcast => {
      // If the podcast doesn't have the isPremium property defined,
      // treat it as a free podcast (isPremium = false) for safety
      const isPremium = podcast.isPremium ?? false;
      
      // For "free" type, include podcasts where isPremium is false
      // For "premium" type, include podcasts where isPremium is true
      return type === "free" ? !isPremium : isPremium;
    });
  }
  
  function isValidPodcastType(type: string): type is "all" | "free" | "premium" {
    return ["all", "free", "premium"].includes(type);
  }
  
  export { filterPodcastsByType, isValidPodcastType };