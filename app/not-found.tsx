import Link from "next/link";
import { Icons } from "@/components/icons";

export default function NotFound() {
  return (
    <>
      <div className="mx-auto mt-32 max-w-xl px-4 text-center">
        <p className="mb-2 text-sm font-medium text-gray-500">404</p>
        <h2 className="mb-2 text-2xl font-semibold tracking-tight text-gray-900">
          Page not found
        </h2>
        <p className="mb-4 text-pretty text-sm text-gray-600">
          Sorry, we couldn&apos;t find the page you&apos;re looking for.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-1 rounded-full px-3 py-2 text-sm font-medium text-sky-600 transition-colors hover:bg-gray-100 hover:text-sky-700"
        >
          Return home
          <Icons.chevronRight className="size-4" />
        </Link>
      </div>
    </>
  );
}
