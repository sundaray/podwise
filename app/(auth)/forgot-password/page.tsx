import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";

export default function ForgotPassword() {
  return (
    <div className="mx-auto max-w-[380px] px-4">
      <h2
        className="text-center text-2xl font-semibold tracking-tight text-gray-900"
      >
        Forgot password?
      </h2>
      <p className="text-center text-gray-600 mt-2">
        Enter your email and request a password reset link
      </p>
      <div className="mt-12">
        <ForgotPasswordForm />
      </div>
    </div>
  );
}
