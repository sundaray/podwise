export interface PodcastHost {
    id: string;
    name: string;
  }
  
  export const podcastHosts: PodcastHost[] = [
    { id: 'chris-williamson', name: 'Modern Wisdom by Chris Williamson' },
    { id: 'daily-stoic', name: 'Daily Stoic by Ryan Holiday' },
    { id: 'doac', name: 'The Diary Of a CEO by Steven Bartlett' },
    { id: 'jack-neel', name: 'The Jack Neel Podcast' },
    { id: 'jay-shetty', name: 'On Purpose with Jay Shetty' },
    { id: 'lewis-howes', name: 'The School of Greatness by Lewis Howes' },
    { id: 'mel-robbins', name: 'The Mel Robbins Podcast' },
    { id: 'rangan-chatterjee', name: 'Feel Better, Live More by Rangan Chatterjee' },
    { id: 'scott-d-clary', name: 'Success Story by Scott D. Clary' },
    { id: 'simon-sinek', name: 'A Bit of Optimism by Simon Sinek' },
    { id: 'tim-ferriss', name: 'The Tim Ferriss Show' },
  ];
  
  // Helper function to get podcast name by ID
  export function getPodcastNameById(id: string): string | undefined {
    const podcast = podcastHosts.find(host => host.id === id);
    return podcast?.name;
  }