import Image from "next/image"
import { Frontmatter } from "@/types"


type PodcastSummaryPageLayoutProps = {
  children: React.ReactNode
  frontmatter: Frontmatter
} 

export function PodcastSummaryPageLayout({ children, frontmatter }: PodcastSummaryPageLayoutProps) {
  const { title, publishedAt, updatedAt, tags, image } = frontmatter

  const imageUrl = `https://podcast-summaries-dev.s3.amazonaws.com/podcast-thumbnails/${image}`

  return (
          <article className="mx-auto max-w-3xl px-4 podcast-summary">
            <header>
              <Image
              src={imageUrl}
              alt={`Thumbnail for ${title}`}
              width={1280}
              height={720}
              sizes="(min-width: 768px) 50vw, 100vw"
              quality={100}
              priority
              className="w-full h-auto"
              />
              <h1>{title}</h1>
            </header>
            {children}
          </article>
  ) 
}
