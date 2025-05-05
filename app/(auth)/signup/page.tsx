import { SignUpGoogleForm } from "@/components/auth/sign-up-google-form";
import { SignUpEmailPasswordForm } from "@/components/auth/signup-email-password-form";

export default function SignUp() {
  return (
    <div className="mx-auto max-w-[380px] px-4">
      <h2 className="text-center text-2xl font-semibold tracking-tight text-gray-900">
        Welcome
      </h2>
      <p className="mt-2 text-center text-sm text-gray-600">Create a new account</p>
      <div className="mt-12 grid gap-4">
        <SignUpGoogleForm />
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-sm text-gray-600">
            <span className="bg-background px-2">Or continue with</span>
          </div>
        </div>
        <SignUpEmailPasswordForm />
      </div>
    </div>
  );
}
