import { PodcastTags } from "@/components/podcast-tags";
import { PodcastSearch } from "@/components/podcast-search";

export default function TagsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 md:px-8">
      <h1 className="mb-2 text-center text-4xl font-bold tracking-tight text-pretty">
        Podcast Summary Tags
      </h1>
      <p className="mb-8 text-center text-pretty text-gray-700">
        Click any tag to explore related podcast summaries.
      </p>
      
      <PodcastSearch placeholder="Search for tags" paramName="tagQuery" />
      
      <PodcastTags />
    </div>
  );
}

