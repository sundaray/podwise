import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Refund Policy | Podwise",
};

export default function RefundPolicy() {
  return (
    <section className="mx-auto max-w-7xl px-4 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-12 text-center text-4xl font-bold tracking-tight text-pretty text-gray-900">
          Refund Policy
        </h1>

        <p className="mb-7 leading-7 text-gray-700">
          This refund policy outlines our guidelines regarding plan purchases at
          www.podwise.org. Please read this policy carefully before making any
          purchases.
        </p>

        <h2 className="mt-7 mb-2 text-2xl font-semibold tracking-tight text-pretty text-gray-900">
          Plan purchases
        </h2>

        <p className="mb-4 leading-7 text-gray-700">
          At Podwise, we offer the following access plans:
        </p>

        <ul className="mb-7 list-disc space-y-2 pl-5 leading-7 text-gray-700">
          <li>
            <strong>Annual access ($49)</strong>: One-time payment for 12 months
            of access to all podcast summaries (free and premium), including all
            summaries published within that year.
          </li>
          <li>
            <strong>Lifetime access ($99)</strong>: One-time payment for
            unlimited access to all podcast summaries (free and premium) for the
            lifetime of the service.
          </li>
        </ul>

        <h2 className="mt-7 mb-2 text-2xl font-semibold tracking-tight text-pretty text-gray-900">
          No-refund policy
        </h2>

        <p className="mb-7 leading-7 text-gray-700">
          All plan purchases on podwise.org are{" "}
          <strong>final and non-refundable</strong> once the transaction is
          complete. When you purchase a plan, you are buying immediate access to
          our curated collection of podcast summaries.
        </p>

        <h2 className="mt-7 mb-2 text-2xl font-semibold tracking-tight text-pretty text-gray-900">
          Before making a purchase
        </h2>

        <p className="mb-7 leading-7 text-gray-700">
          We encourage you to carefully consider your purchase decision, as we
          do not provide refunds. If you have any questions about our service or
          how the plans work, please{" "}
          <Link href="/support" className="text-sky-600 hover:text-sky-700">
            contact our support team
          </Link>{" "}
          before making a purchase.
        </p>

        <h2 className="mt-7 mb-2 text-2xl font-semibold tracking-tight text-pretty text-gray-900">
          Plan renewals
        </h2>

        <p className="mb-4 leading-7 text-gray-700">
          Please note that our plans are not auto-renewing subscriptions:
        </p>

        <ul className="mb-7 list-disc space-y-2 pl-5 leading-7 text-gray-700">
          <li>
            For Annual Access plans, you will need to manually purchase a new
            plan when your current access period expires if you wish to continue
            using our premium services.
          </li>
          <li>
            Lifetime Access plans do not require renewal and will remain active
            for the lifetime of the service.
          </li>
        </ul>

        <h2 className="mt-7 mb-2 text-2xl font-semibold tracking-tight text-pretty text-gray-900">
          Technical issues
        </h2>

        <p className="mb-7 leading-7 text-gray-700">
          In the rare event of technical issues preventing access to podcast
          summaries after a successful purchase, please contact us immediately
          through our{" "}
          <Link href="/support" className="text-sky-600 hover:text-sky-700">
            support page
          </Link>
          . We will investigate and resolve any such technical issues promptly.
        </p>

        <p className="mb-7 leading-7 text-gray-700">
          We are committed to ensuring that you receive the service you&apos;ve
          paid for. Technical support is available to assist with any access
          problems you may encounter.
        </p>

        <h2 className="mt-7 mb-2 text-2xl font-semibold tracking-tight text-pretty text-gray-900">
          Policy updates
        </h2>

        <p className="leading-7 text-gray-700">
          We reserve the right to modify this refund policy at any time. Any
          changes will be effective immediately upon posting the updated policy
          on this page. Your continued use of our service after such changes
          constitutes your acceptance of the new policy.
        </p>
      </div>
    </section>
  );
}
