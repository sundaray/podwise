import { Icons } from "@/components/icons";

const annualFeatures = [
  "Access to all current podcast summaries",
  "Everything published in the next 12 months",
  "Detailed transcripts and key takeaways",
  "Mobile-friendly access on all devices",
];

const lifetimeFeatures = [
  "Access to all current podcast summaries",
  "Everything we publish forever",
  "Detailed transcripts and key takeaways",
  "Mobile-friendly access on all devices",
  "Priority access to new content",
  "Exclusive bonus materials",
];

export default function Premium() {
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header Section */}
        <div className="mx-auto max-w-4xl sm:text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">
            Go Premium
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Unlock access to our complete library of podcast summaries
          </p>
        </div>

        {/* Price Double Notice */}
        <div className="mx-auto mt-8 max-w-3xl rounded-lg border border-amber-200 bg-amber-50 px-6 py-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-amber-400"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.178 2.63-1.516 2.63H3.72c-1.337 0-2.189-1.463-1.515-2.63L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-amber-800">
                Limited Time Offer
              </h3>
              <div className="mt-1 text-sm text-amber-700">
                <p>
                  Prices will double on June 1st, 2025. We're adding 400+ new
                  summaries in this month, bringing our total to 800+
                  summaries.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="mx-auto mt-16 max-w-2xl rounded-3xl ring-1 ring-gray-200 sm:mt-20 lg:mx-0 lg:flex lg:max-w-none">
          <div className="p-8 sm:p-10 lg:flex-auto">
            <h3 className="text-2xl font-semibold tracking-tight text-gray-900">
              Annual Membership
            </h3>
            <p className="mt-6 text-gray-600">
              Get access to all current summaries and everything we publish for
              the next 12 months.
            </p>
            <div className="mt-10 flex items-center gap-x-4">
              <h4 className="flex-none text-sm/6 font-semibold text-sky-600">
                What's included
              </h4>
              <div className="h-px flex-auto bg-gray-100" />
            </div>
            <ul
              role="list"
              className="mt-8 grid grid-cols-1 gap-4 text-sm/6 text-gray-600 sm:grid-cols-2 sm:gap-6"
            >
              {annualFeatures.map((feature) => (
                <li key={feature} className="flex gap-x-3">
                  <Icons.check
                    aria-hidden="true"
                    className="h-6 w-5 flex-none text-sky-600"
                  />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
          <div className="-mt-2 p-2 lg:mt-0 lg:w-full lg:max-w-md lg:shrink-0">
            <div className="rounded-2xl bg-gray-50 py-10 text-center ring-1 ring-gray-900/5 ring-inset lg:flex lg:flex-col lg:justify-center lg:py-16">
              <div className="mx-auto max-w-xs px-8">
                <p className="text-base font-semibold text-gray-600">
                  One-time payment
                </p>
                <p className="mt-6 flex items-baseline justify-center gap-x-2">
                  <span className="text-5xl font-semibold tracking-tight text-gray-900">
                    $49
                  </span>
                  <span className="text-sm/6 font-semibold tracking-wide text-gray-600">
                    USD
                  </span>
                </p>
                <a
                  href="#"
                  className="mt-10 block w-full rounded-md bg-sky-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-xs hover:bg-sky-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600"
                >
                  Purchase Annual
                </a>
                <p className="mt-6 text-xs/5 text-gray-600">
                  Access expires after one year
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto mt-8 max-w-2xl rounded-3xl ring-1 ring-gray-200 lg:mx-0 lg:flex lg:max-w-none">
          <div className="p-8 sm:p-10 lg:flex-auto">
            <h3 className="text-2xl font-semibold tracking-tight text-gray-900">
              Lifetime Membership
            </h3>
            <p className="mt-6 text-gray-600">
              Get unlimited access to all current and future podcast summaries
              forever.
            </p>
            <div className="mt-10 flex items-center gap-x-4">
              <h4 className="flex-none text-sm/6 font-semibold text-sky-600">
                What's included
              </h4>
              <div className="h-px flex-auto bg-gray-100" />
            </div>
            <ul
              role="list"
              className="mt-8 grid grid-cols-1 gap-4 text-sm/6 text-gray-600 sm:grid-cols-2 sm:gap-6"
            >
              {lifetimeFeatures.map((feature) => (
                <li key={feature} className="flex gap-x-3">
                  <Icons.check
                    aria-hidden="true"
                    className="h-6 w-5 flex-none text-sky-600"
                  />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
          <div className="-mt-2 p-2 lg:mt-0 lg:w-full lg:max-w-md lg:shrink-0">
            <div className="rounded-2xl bg-gray-50 py-10 text-center ring-1 ring-gray-900/5 ring-inset lg:flex lg:flex-col lg:justify-center lg:py-16">
              <div className="mx-auto max-w-xs px-8">
                <p className="text-base font-semibold text-gray-600">
                  Pay once, own it forever
                </p>
                <p className="mt-6 flex items-baseline justify-center gap-x-2">
                  <span className="text-5xl font-semibold tracking-tight text-gray-900">
                    $99
                  </span>
                  <span className="text-sm/6 font-semibold tracking-wide text-gray-600">
                    USD
                  </span>
                </p>
                <a
                  href="#"
                  className="mt-10 block w-full rounded-md bg-sky-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-xs hover:bg-sky-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-700"
                >
                  Purchase Lifetime
                </a>
                <p className="mt-6 text-xs/5 text-gray-600">Never expires</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
