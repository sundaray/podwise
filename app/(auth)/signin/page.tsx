import Link from "next/link";
import { SignInGoogleForm } from "@/components/auth/sign-in-google-form";
import { SignInEmailPasswordForm } from "@/components/auth/signin-email-password-form";
import { libreBaskerville } from "@/app/layout";
import { Icons } from "@/components/icons";

export default function SignIn() {
  return (
    <>
      <div className="mx-auto mt-20 max-w-[380px] px-4">
        <svg
          width="25"
          height="25"
          viewBox="40 60 55 85"
          xmlns="http://www.w3.org/2000/svg"
          className="mx-auto text-sky-700"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M79.43 86C76.6635 79.0001 72.5528 72.6098 67.3301 67.19L91 65.58C85.7145 71.4716 81.7673 78.4379 79.43 86ZM76.77 98.11L82.6501 97.3C82.6501 84.21 93.8901 64.5 105.65 60.54C105.65 64.7 105.44 87.29 105.44 99.69C105.44 133.17 87.84 145.92 47.5 146.36C52.73 141.28 60.35 133.1 60.35 122.11C60.35 109.43 56.6701 100.45 44.7401 99.58L44.3 60.63H46.76C63.33 64.67 76.77 83.93 76.77 98.11ZM96.0801 81.56C89.16 81.56 88.83 92.09 96.2 92.09C102.93 92.09 103 81.56 96.0801 81.56ZM94.5801 109.42L87.84 109.79L89.53 118.87L91.96 119.34L94.5801 109.42ZM85.74 132.53L87.74 133.53L90.2601 124.92L83.71 124.61L85.74 132.53ZM83.3301 110L76.53 110.37L78.34 118.84L81.0801 118.99L83.3301 110ZM75.3301 132.86L77.74 133.08L79.52 124.39L73.18 124.1L75.3301 132.86ZM67.5101 119L70.2901 118.48L72.1601 110.66L66.1601 110.98L67.5101 119ZM60.3 79.17C49.3 79.17 48.7701 95.92 60.4901 95.92C71.2001 95.92 71.2701 79.17 60.3 79.17ZM55.53 122.55C55.53 132.16 49.1201 137.8 45.3101 141.43L44.85 104.69C53.33 105.35 55.53 112.62 55.53 122.55Z"
            fill="currentColor"
          />
        </svg>
        <h2
          className={`${libreBaskerville.className} mt-4 text-center text-2xl font-semibold tracking-tight text-gray-900`}
        >
          PODWISE
        </h2>
        <p className="text-center text-sm text-gray-700">
          Sign in to your account
        </p>
        <div className="mt-8 grid gap-4">
          <SignInGoogleForm />
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-sm text-gray-500">
              <span className="bg-background px-2">Or continue with</span>
            </div>
          </div>
          <SignInEmailPasswordForm />
        </div>
      </div>
      <Link
        href="/"
        className="absolute top-4 left-4 inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:rounded-full hover:bg-gray-100 lg:top-10 lg:left-10"
      >
        <Icons.chevronLeft size={14} className="mr-1 text-gray-700" />
        Home
      </Link>
    </>
  );
}
