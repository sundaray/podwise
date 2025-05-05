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
          My name is Hemanta Sundaray. I am a software engineer based out of
          Odisha, India.
        </p>

        <p className="mb-7 text-gray-700">
          I love listening to podcasts, but they are a big time sink. So I
          thought why not use AI to extract the key takeaways. And this is how
          the idea for Podwise was born.
        </p>

        <p className="mb-7 text-gray-700">
          Podwise contains summaries of worlds best podcasts, so that you can
          get the key insights without spending hours listening to them.
          Currently there are 400+ summaries. I will keep adding new summaries
          as and when new podcast episodes are released. I will also keep on
          adding new podcast shows that I find interesting.
        </p>

        <p className="mb-7 text-gray-700">
          Every Friday, I send an email with 5 best ideas I found for that week.
          If you want to get notified, subscribe below:
        </p>

        <SubscriptionForm />
      </div>
    </div>
  );
}
