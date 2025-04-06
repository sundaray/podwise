"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { formatHostForUrl } from "@/lib/utils";

type PodcastBreadcrumbsProps = {
  podcastHost: string;
};

export function PodcastBreadcrumbs({ podcastHost }: PodcastBreadcrumbsProps) {
  const formattedPodcastHost = formatHostForUrl(podcastHost);
  
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink
            href="/"
            className="font-medium text-sky-700 transition-colors hover:text-sky-500"
          >
            Home
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator className="text-gray-500" />
        <BreadcrumbItem>
          <BreadcrumbLink
            href="/podcasts"
            className="font-medium text-sky-700 transition-colors hover:text-sky-500"
          >
            Podcasts
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator className="text-gray-500" />
        <BreadcrumbItem>
          <BreadcrumbLink
            href={`/podcasts/${formattedPodcastHost}`}
            className="font-medium text-sky-700 transition-colors hover:text-sky-500"
          >
            {podcastHost}
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator className="text-gray-500" />
      </BreadcrumbList>
    </Breadcrumb>
  );
}