export function YouTubeEmbed({ videoId }: { videoId: string }) {  
    return (
      <div className="relative w-full pb-[56.25%] mb-7">
        <iframe
          className="absolute top-0 left-0 w-full h-full rounded-lg"
          src={`https://www.youtube.com/embed/${videoId}`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }