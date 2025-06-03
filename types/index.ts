export type Frontmatter = {
  title: string;
  description: string;
  publishedAt: string;
  updatedAt?: string;
  tags: string[];
  published: boolean;
  image: string;
  podcastHost: string;
  isPremium: boolean;
};

export type BlogFrontmatter = {
  title: string;
  description: string;
  publishedAt: string;
  updatedAt?: string;
  tags?: string[];
  image: string;
};
