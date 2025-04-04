import Link from "next/link";
import { Icons } from "@/components/icons";

export default function NotFound() {
  return (
    <>
      <div className="mx-auto max-w-xl px-4 text-center">
        <p className="mb-2 text-sm font-medium text-gray-500">404</p>
        <h2 className="mb-2 text-2xl font-semibold tracking-tight text-gray-900">
          Page not found
        </h2>
        <p className="mb-8 text-pretty text-gray-700">
          Sorry, we couldn&apos;t find the page you&apos;re looking for
        </p>
        <Link
          href="/"
          className="rounded-full bg-gray-100 px-4 py-2 text-sm font-medium text-sky-600 transition-colors hover:bg-gray-200 hover:text-sky-700"
        >
          Return Home
        </Link>
      </div>
    </>
  );
}
