import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Podwise",
};


export default function PrivacyPolicy() {
  return (
    <section className="mx-auto max-w-7xl px-4 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-12 text-center text-4xl font-bold tracking-tight text-pretty text-gray-900">
          Privacy Policy
        </h1>

        <p className="mb-7 leading-7 text-gray-700">Welcome to Podwise!</p>

        <p className="mb-7 leading-7 text-gray-700">
          We understand that your privacy is critically important, and this
          privacy policy outlines the types of personal information we receive
          and collect when you use our service, as well as some of the steps we
          take to safeguard information.
        </p>

        <h2 className="mt-7 mb-2 text-2xl font-semibold tracking-tight text-pretty text-gray-900">
          Information we collect
        </h2>

        <p className="mb-4 leading-7 text-gray-700">
          When you use Podwise, we may collect the following types of
          information:
        </p>

        <ol className="mb-7 list-decimal space-y-3 pl-7 leading-7 text-gray-700">
          <li>
            <strong>Account information</strong>: We collect your email address
            when you sign in to access free podcast summaries (limited to 2 per
            day), subscribe to our newsletter, or when you purchase an Annual or
            Lifetime Access plan. This information is necessary to create your
            account, track your daily usage limits, send weekly (or occasional)
            updates about new podcast summaries and feature announcements,
            process purchases, and provide you access to our podcast summaries.
          </li>
          <li>
            <strong>Usage data</strong>: We may collect anonymous data about how
            you interact with our service, including which podcast summaries you
            view and how frequently you use the platform. This information helps
            us improve our service and content offerings.
          </li>
          <li>
            <strong>Technical information</strong>: We may collect information
            about your device and internet connection, including your IP
            address, browser type, and operating system. This helps us maintain
            and optimize our service.
          </li>
        </ol>

        <h2 className="mt-7 mb-2 text-2xl font-semibold tracking-tight text-pretty text-gray-900">
          Use of information
        </h2>

        <p className="mb-4 leading-7 text-gray-700">
          We use the information we collect to:
        </p>

        <ul className="mb-7 list-disc space-y-2 pl-7 leading-7 text-gray-700">
          <li>Provide, maintain, and improve our podcast summary service</li>
          <li>
            Process transactions and send related information, including
            confirmations and receipts
          </li>
          <li>
            Send you technical notices, updates, security alerts, and support
            messages
          </li>
          <li>
            Respond to your comments, questions, and customer service requests
          </li>
          <li>
            Develop new features and content based on user preferences and
            behavior
          </li>
          <li>
            Monitor and analyze trends, usage, and activities in connection with
            our service
          </li>
        </ul>

        <h2 className="mt-7 mb-2 text-2xl font-semibold tracking-tight text-pretty text-gray-900">
          Your choices
        </h2>

        <p className="mb-7 leading-7 text-gray-700">
          You have the choice to refrain from providing us with your email
          address, but please be aware that this will result in you being unable
          to purchase access plans, as we use email for account management,
          confirmation, and correspondence purposes.
        </p>

        <p className="mb-7 leading-7 text-gray-700">
          You may opt out of receiving promotional communications from us by
          following the instructions in those communications. If you opt out, we
          may still send you non-promotional communications, such as those about
          your account or our ongoing business relations.
        </p>

        <h2 className="mt-7 mb-2 text-2xl font-semibold tracking-tight text-pretty text-gray-900">
          Data security
        </h2>

        <p className="mb-7 leading-7 text-gray-700">
          We implement appropriate technical measures to protect the security of
          your personal information. However, please be aware that no method of
          transmission over the Internet or method of electronic storage is 100%
          secure.
        </p>

        <h2 className="mt-7 mb-2 text-2xl font-semibold tracking-tight text-pretty text-gray-900">
          Cookies
        </h2>

        <p className="mb-7 leading-7 text-gray-700">
          Podwise may use cookies to enhance your experience on our website.
          Cookies are small text files that are placed on your computer by
          websites that you visit. They are widely used to make websites work
          more efficiently and provide information to the owners of the site.
          Most web browsers allow you to control cookies through browser
          settings.
        </p>

        <h2 className="mt-7 mb-2 text-2xl font-semibold tracking-tight text-pretty text-gray-900">
          Third-party services
        </h2>

        <p className="mb-7 leading-7 text-gray-700">
          We use third-party services, such as payment processors, to facilitate
          our service. These third parties have their own privacy policies
          addressing how they use and process personal information. We encourage
          you to read their privacy policies.
        </p>

        <h2 className="mt-7 mb-2 text-2xl font-semibold tracking-tight text-pretty text-gray-900">
          Policy changes
        </h2>

        <p className="leading-7 text-gray-700">
          We may occasionally update this policy. If significant changes are
          made, we will notify you through a notice on the website. Your
          continued use of our services will signify your acceptance of the
          changes to this privacy policy.
        </p>
      </div>
    </section>
  );
}
