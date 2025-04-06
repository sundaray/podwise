export function PodcastDisclaimer({ youTubeLink }: { youTubeLink: string }) {
  return (
    <div className="border-l border-l-4 border-gray-500 bg-gray-100 p-4 text-sm text-gray-700">
      <p className="text-pretty">
        Please note this is an AI-generated summary that aims to capture the key
        takeaways from the discussion. That being said, AI might miss subtle
        points or even make minor errors. Therefore, I recommend listening to
        the{" "}
        <a
          href={youTubeLink}
          target="_blank"
          rel="noopener noreferrer"
          className="cursor-pointer text-sky-700 hover:text-sky-500"
        >
          original podcast episode
        </a>{" "}
        for the full authentic conversation and complete context.
      </p>
    </div>
  );
}
