import Link from "next/link";
import { Icons } from "@/components/icons";

export default function SubscriptionSuccessful() {
  return (
    <div className="mx-auto max-w-md px-4 text-center">
      <h2 className="mb-2 text-2xl font-semibold tracking-tight text-gray-900">
        Subscription successful
      </h2>
      <p className="mb-4 text-sm text-pretty text-gray-600">
        You have successfully subscribed to the "5-idea Friday" newsletter. Your
        first email will arrive this Friday.
      </p>
      <Link
        href="/podcasts"
        className="inline-flex items-center gap-1 rounded-full px-3 py-2 text-sm font-medium text-sky-600 transition-colors hover:bg-gray-100 hover:text-sky-700"
      >
        Browse podcasts
        <Icons.chevronRight className="size-4" />
      </Link>
    </div>
  );
}
