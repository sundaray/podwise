import { ResetPasswordForm } from "@/components/auth/reset-password-form";

export default function ResetPassword() {
  return (
    <div className="mx-auto max-w-[380px] px-4">
      <h2
        className="text-center text-2xl font-semibold tracking-tight text-gray-900"
      >
        Reset password
      </h2>
      <p className="text-center text-sm text-gray-600 mt-2">
        Enter your new password
      </p>
      <div className="mt-12">
        <ResetPasswordForm />
      </div>
    </div>
  );
}
