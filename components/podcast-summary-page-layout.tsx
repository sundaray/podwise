"use client"

import { Frontmatter } from "@/types"

type PodcastSummaryPageLayoutProps = {
  children: React.ReactNode
  frontmatter: Frontmatter
} 

export function PodcastSummaryPageLayout({ children, frontmatter }: PodcastSummaryPageLayoutProps) {
  const { title, publishedAt, updatedAt, tags } = frontmatter

  return (
          <article className="podcast-summary">
            {children}
          </article>
  )
}
