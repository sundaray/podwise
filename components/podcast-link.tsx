import Link from "next/link";

interface PodcastLinkProps {
  href: string;
  children: React.ReactNode;
}

export function PodcastLink({ href, children }: PodcastLinkProps) {
  return (
      <Link
        href={href}
        className="podcast-link w-full text-center block rounded-full my-7 px-6 py-3 font-medium bg-sky-600 text-white transition-colors hover:bg-sky-800 hover:text-white"
      >
        {children}
      </Link>
  );
}
