import type { Metadata } from "next";
import Link from "next/link";
import { getAllBlogPosts } from "@/lib/blog";
import { Icons } from "@/components/icons";

export const metadata: Metadata = {
  title: "Blog | podwise.org",
};

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function BlogPage() {
  const posts = getAllBlogPosts();

  return (
    <div className="bg-white px-4 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-12 text-center text-4xl font-bold tracking-tight text-gray-900">
          Blog
        </h1>

        <div className="space-y-4">
          {posts.map((post) => (
            <article
              key={post.slug}
              className="group relative rounded-lg p-6 transition-colors hover:bg-gray-100"
            >
              <time
                dateTime={post.publishedAt}
                className="text-sm font-medium text-gray-500"
              >
                {formatDate(post.publishedAt)}
              </time>

              <h2 className="mt-2 text-xl font-semibold text-gray-900">
                {post.title}
              </h2>

              <div className="mt-4">
                <span className="text-sm font-medium text-sky-600 transition-all group-hover:text-sky-700">
                  Read more{" "}
                  <Icons.arrowRight className="inline-block size-4 text-sky-600 transition-transform group-hover:translate-x-0.5 group-hover:text-sky-700" />
                </span>
              </div>

              <Link href={`/blog/${post.slug}`} className="absolute inset-0">
                <span className="sr-only">Read {post.title}</span>
              </Link>
            </article>
          ))}

          {posts.length === 0 && (
            <div className="py-12 text-center">
              <p className="text-gray-500">No blog posts found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
