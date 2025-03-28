import React from "react"
import Image, { ImageProps } from "next/image"
import Link, { LinkProps } from "next/link"
import type { MDXComponents } from "mdx/types"

import { cn } from "@/lib/utils"

type CustomLinkProps = React.HTMLAttributes<HTMLAnchorElement> &
  Partial<LinkProps>

function MDXImage(props: ImageProps) {
  return <Image {...props} alt={props.alt} className="rounded-lg" />
}


function CustomLink(props: CustomLinkProps) {
  const { href, ...rest } = props

  if (typeof href === "string") {
    if (href.startsWith("/")) {
      return (
        <Link href={href} {...rest}>
          {props.children}
        </Link>
      )
    }

    if (href.startsWith("#")) {
      return <a href={href} {...rest} />
    }

    return <a href={href} target="_blank" rel="noopener noreferrer" {...rest} />
  }

  return null
}

function slugify(str: string) {
  return str
    .toString()
    .toLowerCase()
    .trim() // Remove whitespace from both ends of a string
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/&/g, "-and-") // Replace & with 'and'
    .replace(/[^\w\-]+/g, "") // Remove all non-word characters except for -
    .replace(/\-\-+/g, "-") // Replace multiple - with single -
}

function createHeading(level: 1 | 2 | 3 | 4 | 5 | 6) {
  const Heading = ({ children }: { children: React.ReactNode }) => {
    // Convert ReactNode to string, handling non-string cases
    const contentString = React.Children.toArray(children)
      .map((child) => {
        if (typeof child === "string") {
          return child
        }
        return ""
      })
      .join("")

    let slug = slugify(contentString)
    return React.createElement(
      `h${level}`,
      { id: slug },
      [
        React.createElement("a", {
          href: `#${slug}`,
          key: `link-${slug}`,
          className: "anchor scroll-m-20",
        }),
      ],
      children
    )
  }

  Heading.displayName = `Heading${level}`

  return Heading
}

const defaultComponents = {
  h1: createHeading(1),
  h2: createHeading(2),
  h3: createHeading(3),
  h4: createHeading(4),
  h5: createHeading(5),
  h6: createHeading(6),
  a: CustomLink,
  Image: MDXImage,
}

export function useMDXComponents(components: MDXComponents): MDXComponents {
  // @ts-ignore
  return {
    ...defaultComponents,
    ...components,
    img: ({
      className,
      alt,
      ...props
    }: React.ImgHTMLAttributes<HTMLImageElement>) => (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        className={cn("rounded-lg border", className)}
        alt={alt}
        {...props}
      />
    ),
  }
}
