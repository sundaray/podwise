import React from 'react';

export function PodcastDisclaimer({ youTubeLink }: { youTubeLink: string }) {
  return (
    <div className="p-4 border-l border-l-4 border-gray-500 text-gray-700 text-sm">
      <p>
        Please note this is an AI-generated summary that aims to capture the key takeaways from the discussion. That being said, AI might miss subtle points or even make minor errors. Therefore, I recommend listening to the{' '}
        <a 
          href={youTubeLink} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-sky-700 hover:text-sky-500 cursor-pointer"
        >
          original podcast episode
        </a>{' '}
        for the full authentic conversation and complete context.
      </p>
    </div>
  );
}

