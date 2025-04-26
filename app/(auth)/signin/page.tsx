import { SignInGoogleForm } from "@/components/auth/sign-in-google-form";
import { SignInEmailPasswordForm } from "@/components/auth/signin-email-password-form";

export default function SignIn() {
  return (
    <div className="px-4 sm:mx-auto sm:max-w-sm">
      <h2 className="text-center text-2xl font-[var(--font-libre-baskerville)] font-semibold tracking-tight text-gray-900">
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
  );
}
