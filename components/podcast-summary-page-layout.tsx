import Image from "next/image"
import { Frontmatter } from "@/types"
import { format, parseISO } from 'date-fns'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"


type PodcastSummaryPageLayoutProps = {
  children: React.ReactNode
  frontmatter: Frontmatter
} 

export function PodcastSummaryPageLayout({ children, frontmatter }: PodcastSummaryPageLayoutProps) {
  const { title, publishedAt, updatedAt, tags, image, podcastHost } = frontmatter

  const imageUrl = `https://podcast-summaries-dev.s3.amazonaws.com/podcast-thumbnails/${image}`

  const formattedDate = format(parseISO(publishedAt), 'MMMM d, yyyy')

  return (
          <div className="mx-auto max-w-3xl px-4 podcast-summary">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/" className="font-medium text-sky-600 hover:text-sky-600 hover:underline hover:underline-offset-2">Podcasts</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/podcasts/mel-robbins" className="text-sky-600 font-medium hover:text-sky-600 hover:underline hover:underline-offset-2">{podcastHost}</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
            </BreadcrumbList>
          </Breadcrumb>
          <article className="podcast-summary">
            <header>
              <h1 className="mt-7 mb-2">{title}</h1>
              <div className="text-gray-500 font-medium">
              Posted <time dateTime={parseISO(publishedAt).toISOString()}>{formattedDate}</time>
            </div>
              <Image
              src={imageUrl}
              alt={`Thumbnail for ${title}`}
              width={1280}
              height={720}
              sizes="(min-width: 768px) 50vw, 100vw"
              quality={100}
              priority
              className="w-full h-auto my-7"
              />
            </header>
            {children}
          </article>
          </div>
  ) 
}
