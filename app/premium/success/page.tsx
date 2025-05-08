import Link from "next/link";
import { Icons } from "@/components/icons";
import { getCheckoutSession } from "@/lib/get-checkout-session";

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  // Get and await the search params
  const resolvedParams = await searchParams;
  const sessionId = resolvedParams.session_id as string;

  // If no session ID is provided, show error message
  if (!sessionId) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="mx-auto max-w-md px-4 text-center">
          <h2 className="mb-2 text-2xl font-semibold tracking-tight text-red-600">
            Invalid purchase verification
          </h2>
          <p className="mb-4 text-sm text-pretty text-gray-600">
            No purchase verification information was provided. If you&apos;ve
            just completed a purchase, please contact{" "}
            <Link
              href="/support"
              className="text-sky-600 underline hover:text-sky-700"
            >
              support
            </Link>
            .
          </p>
          <Link
            href="/podcasts"
            className="inline-flex items-center gap-1 rounded-full px-3 py-2 text-sm font-medium text-sky-700 transition-colors hover:bg-gray-100"
          >
            Browse podcasts
            <Icons.chevronRight className="size-4" />
          </Link>
        </div>
      </div>
    );
  }

  // Fetch the checkout session from Stripe to verify
  const { success, session, error } = await getCheckoutSession(sessionId);

  // If failed to retrieve the session, show error
  if (!success || !session) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="mx-auto max-w-md px-4 text-center">
          <h2 className="mb-2 text-2xl font-semibold tracking-tight text-red-600">
            Verification failed
          </h2>
          <p className="mb-4 text-sm text-pretty text-gray-600">
            We couldn&apos;t verify your purchase. If you believe this is an
            error, please contact{" "}
            <Link
              href="/support"
              className="text-sky-600 underline hover:text-sky-700"
            >
              support
            </Link>
            .
          </p>
          <Link
            href="/podcasts"
            className="inline-flex items-center gap-1 rounded-full px-3 py-2 text-sm font-medium text-sky-700 transition-colors hover:bg-gray-100"
          >
            Browse podcasts
            <Icons.chevronRight className="size-4" />
          </Link>
        </div>
      </div>
    );
  }

  // Get plan type from session metadata
  const planType = session.metadata?.planType;
  const isLifetime = planType === "lifetime";

  return (
    <div className="flex min-h-[70vh] items-center justify-center">
      <div className="mx-auto max-w-md px-4 text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <Icons.check className="size-8 text-green-600" />
        </div>

        <h2 className="mb-2 text-2xl font-semibold tracking-tight text-gray-900">
          {isLifetime
            ? "Lifetime Access Activated!"
            : "Annual Access Activated!"}
        </h2>

        <p className="mb-6 text-pretty text-gray-600">
          {isLifetime
            ? "You have successfully purchased lifetime access. You now have unlimited access to all current and future podcast summaries forever."
            : "You have successfully purchased annual access. You now have unlimited access to all podcast summaries for a year."}
        </p>

        <Link
          href="/podcasts"
          className="inline-flex items-center gap-2 rounded-full bg-sky-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-sky-700"
        >
          Browse podcasts
          <Icons.chevronRight className="size-4" />
        </Link>
      </div>
    </div>
  );
}
