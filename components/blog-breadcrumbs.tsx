"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export function BlogBreadcrumbs() {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink
            href="/"
            className="font-medium text-sky-600 transition-colors hover:text-sky-700"
          >
            Home
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator className="text-gray-500" />
        <BreadcrumbItem>
          <BreadcrumbLink
            href="/blog"
            className="font-medium text-sky-600 transition-colors hover:text-sky-700"
          >
            Blog
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator className="text-gray-500" />
      </BreadcrumbList>
    </Breadcrumb>
  );
}
