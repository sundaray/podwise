function generatePodcastList(): void {
  const fs = require("fs");
  const path = require("path");
  const matter = require("gray-matter");

  const podcastsDir = path.join(process.cwd(), "app/podcasts/chris-williamson");

  // Define the output file path - adjust this to your project structure
  const outputFilePath = path.join(
    process.cwd(),
    "podcast-list/chris-williamson.ts",
  );

  // Get all subdirectories (episode folders)
  const folders = fs
    .readdirSync(podcastsDir, { withFileTypes: true })
    .filter((dirent: { isDirectory: () => boolean }) => dirent.isDirectory())
    .map((dirent: { name: string }) => dirent.name);

  interface PodcastEntry {
    title: string;
    slug: string;
    tags: string[];
    image: string;
    podcastHost: string;
    videoId: string;
    isPremium: boolean;
    videoUploadedAt?: string;
  }

  const podcasts: PodcastEntry[] = folders
    .map((folder: string) => {
      const mdxPath = path.join(podcastsDir, folder, "page.mdx");

      if (!fs.existsSync(mdxPath)) return null;

      const content = fs.readFileSync(mdxPath, "utf8");
      const { data } = matter(content);

      return {
        title: data.title || "",
        slug: folder,
        tags: data.tags || [],
        image: data.image || "",
        podcastHost: data.podcastHost || "",
        videoId: data.videoId || "",
        isPremium: data.isPremium === true, // Ensure boolean value
        videoUploadedAt: data.videoUploadedAt || null, // Get the upload date
      };
    })
    .filter(Boolean) as PodcastEntry[];

  // Sort by upload date (newer videos first) if available
  podcasts.sort((a, b) => {
    if (!a.videoUploadedAt && !b.videoUploadedAt) return 0;
    if (!a.videoUploadedAt) return 1; // Items without dates go to the end
    if (!b.videoUploadedAt) return -1;
    return (
      new Date(b.videoUploadedAt).getTime() -
      new Date(a.videoUploadedAt).getTime()
    );
  });

  // Create the file content
  const fileContent = `// Auto-generated podcast list - DO NOT EDIT MANUALLY
// Generated on ${new Date().toISOString()}

export const chrisWilliamsonPodcastList = ${JSON.stringify(podcasts, null, 2)};
`;

  // Ensure the directory exists
  const outputDir = path.dirname(outputFilePath);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Write to file
  fs.writeFileSync(outputFilePath, fileContent);

  console.log(`✅ Successfully wrote podcast list to ${outputFilePath}`);
  console.log(`Found ${podcasts.length} podcasts`);
}

generatePodcastList();
