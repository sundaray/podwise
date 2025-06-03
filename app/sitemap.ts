import type { MetadataRoute } from "next";
import { freePodcastPaths } from "@/lib/podcast/free-podcast-paths";
import { getAllBlogPosts } from "@/lib/blog";

// Extract unique podcast show paths
function extractPodcastShowPaths(paths: string[]): string[] {
  const showPaths = new Set<string>();

  paths.forEach((path) => {
    // Extract the podcast show path (e.g., /podcasts/chris-williamson)
    const match = path.match(/^(\/podcasts\/[^\/]+)/);
    if (match) {
      showPaths.add(match[1]);
    }
  });

  return Array.from(showPaths);
}

export default function sitemap(): MetadataRoute.Sitemap {
  const domain = "https://www.podwise.org";
  const currentDate = new Date();

  // Get unique podcast show paths
  const podcastShowPaths = extractPodcastShowPaths(freePodcastPaths);

  // Get all blog posts
  const blogPosts = getAllBlogPosts();

  // Create sitemap entries for podcast show pages
  const showEntries = podcastShowPaths.map((path) => ({
    url: `${domain}${path}`,
    lastModified: currentDate,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  // Create sitemap entries for individual podcast pages
  const podcastEntries = freePodcastPaths.map((path) => ({
    url: `${domain}${path}`,
    lastModified: currentDate,
    changeFrequency: "weekly" as const,
    priority: 0.5,
  }));

  // Create sitemap entries for individual blog posts
  const blogPostEntries = blogPosts.map((post) => ({
    url: `${domain}/blog/${post.slug}`,
    lastModified: new Date(post.publishedAt),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  // Add static pages
  const staticPages = [
    {
      url: domain,
      lastModified: currentDate,
      changeFrequency: "daily" as const,
      priority: 1.0,
    },
    {
      url: `${domain}/about`,
      lastModified: currentDate,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    {
      url: `${domain}/blog`,
      lastModified: currentDate,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
    {
      url: `${domain}/tags`,
      lastModified: currentDate,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    },
    {
      url: `${domain}/podcasts`,
      lastModified: currentDate,
      changeFrequency: "daily" as const,
      priority: 0.9,
    },
  ];

  // Combine all entries
  return [
    ...staticPages,
    ...showEntries,
    ...podcastEntries,
    ...blogPostEntries,
  ];
}
