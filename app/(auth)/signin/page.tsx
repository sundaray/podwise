import Link from "next/link";
import { SignInGoogleForm } from "@/components/auth/sign-in-google-form";
import { SignInEmailPasswordForm } from "@/components/auth/signin-email-password-form";
import { libreBaskerville } from "@/app/layout";
import { Icons } from "@/components/icons";

export default function SignIn() {
  return (
      <div className="mx-auto max-w-[380px] px-4">
        <h2
          className={`${libreBaskerville.className} mt-4 text-center text-2xl font-semibold tracking-tight text-gray-900`}
        >
          WELCOME BACK
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
  );
}
