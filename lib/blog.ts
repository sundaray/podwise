import fs from "fs";
import path from "path";
import matter from "gray-matter";

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  publishedAt: string;
  tags: string[];
  image: string;
}

export function getAllBlogPosts(): BlogPost[] {
  const blogDir = path.join(process.cwd(), "app", "blog");

  // Get all directories in the blog folder
  const slugs = fs
    .readdirSync(blogDir, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);

  const posts: BlogPost[] = [];

  for (const slug of slugs) {
    try {
      const postPath = path.join(blogDir, slug, "page.mdx");

      // Check if page.mdx exists
      if (!fs.existsSync(postPath)) {
        continue;
      }

      const fileContent = fs.readFileSync(postPath, "utf8");
      const { data: frontmatter } = matter(fileContent);

      posts.push({
        slug,
        title: frontmatter.title || "",
        description: frontmatter.description || "",
        publishedAt: frontmatter.publishedAt || "",
        tags: frontmatter.tags || [],
        image: frontmatter.image,
      });
    } catch (error) {
      console.warn(`Error reading blog post ${slug}:`, error);
    }
  }

  // Sort by publishedAt date (newest first)
  return posts.sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );
}
