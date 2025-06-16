import type { ReactNode } from 'react';

type QuoteProps = {
  children: ReactNode;
  author?: string;
  source?: string;
};

export function Quote({ children, author, source }: QuoteProps) {
  return (
    <figure className="my-8 border-l-4 border-gray-300 pl-4 md:pl-6">
      <blockquote className="text-md whitespace-pre-line text-gray-700 italic md:text-lg">
        {children}
      </blockquote>
      {author && (
        <figcaption className="mt-4 text-sm text-gray-500">
          — {author}
          {source && <cite className="ml-1 not-italic">, {source}</cite>}
        </figcaption>
      )}
    </figure>
  );
}
