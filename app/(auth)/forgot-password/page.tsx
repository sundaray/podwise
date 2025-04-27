import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";
import { libreBaskerville } from "@/app/layout";

export default function ForgotPassword() {
  return (
    <div className="mx-auto max-w-[380px] px-4">
      <h2
        className={`${libreBaskerville.className} text-center text-2xl font-semibold tracking-tight text-gray-900`}
      >
        Forgot password?
      </h2>
      <p className="text-center text-sm text-gray-700 mt-2">
        Enter your email and request a password reset link
      </p>
      <div className="mt-8">
        <ForgotPasswordForm />
      </div>
    </div>
  );
}
