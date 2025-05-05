import { SubscriptionForm } from "@/components/subscription/subscription-form";

export default function Podwise() {
  return (
    <div className="bg-white px-4 lg:px-8">
      <div className="mx-auto max-w-3xl text-base leading-7 text-gray-700">
        <h1 className="text-center text-4xl font-bold tracking-tight text-gray-900">
          About
        </h1>

        <p className="mt-12 mb-7 text-gray-700">Hello! Welcome to Podwise!</p>

        <p className="mb-7 text-gray-700">
          My name is Hemanta Sundaray, a software engineer based in Odisha,
          India.
        </p>

        <p className="mb-7 text-gray-700">
          I'm an avid podcast listener, but let's face it, they can be a major
          time sink. That's why I created Podwise: to use AI to extract the key
          takeaways so you can get the insights without spending hours
          listening.
        </p>

        <p className="mb-7 text-gray-700">
          Podwise contains summaries of the world's best podcasts, with
          currently 400+ summaries and growing. I keep adding new summaries as
          episodes release and continually expand my collection with interesting
          new shows.
        </p>

        <p className="mb-7 text-gray-700">
          Every Friday, I send an email with the 5 best ideas I discovered that
          week. Want to stay updated? Subscribe below:
        </p>

        <SubscriptionForm />
      </div>
    </div>
  );
}
