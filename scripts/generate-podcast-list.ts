function generatePodcastList(): void {
  const fs = require("fs");
  const path = require("path");
  const matter = require("gray-matter");

  const podcastsDir = path.join(process.cwd(), "app/podcasts/chris-williamson");

  // Get all subdirectories (episode folders)
  const folders = fs
    .readdirSync(podcastsDir, { withFileTypes: true })
    .filter((dirent: { isDirectory: () => boolean }) => dirent.isDirectory())
    .map((dirent: { name: string }) => dirent.name);

  interface PodcastEntry {
    title: string;
    slug: string;
    image: string;
    podcastHost: string;
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
        image: data.image || "",
        podcastHost: data.podcastHost || "",
      };
    })
    .filter(Boolean) as PodcastEntry[];

  // Log the array to console in a format ready to copy-paste
  console.log(
    "export const chrisWilliamsonPodcastList = " +
      JSON.stringify(podcasts, null, 2),
  );
}

generatePodcastList();
