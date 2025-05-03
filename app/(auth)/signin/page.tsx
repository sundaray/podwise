import { SignInGoogleForm } from "@/components/auth/sign-in-google-form";
import { SignInEmailPasswordForm } from "@/components/auth/signin-email-password-form";
import { libreBaskerville } from "@/app/layout";

export default function SignIn() {
  return (
    <div className="mx-auto max-w-[380px] px-4">
      <h2
        className={`${libreBaskerville.className} text-center text-3xl font-medium tracking-tight text-gray-900`}
      >
        Welcome
      </h2>
      <p className="mt-1 text-center text-sm text-gray-600">
        Sign in to your account
      </p>
      <div className="mt-10 grid gap-4">
        <SignInGoogleForm />
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-sm text-gray-600">
            <span className="bg-background px-2">Or continue with</span>
          </div>
        </div>
        <SignInEmailPasswordForm />
      </div>
    </div>
  );
}
