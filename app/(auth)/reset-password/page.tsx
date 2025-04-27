import { ResetPasswordForm } from "@/components/auth/reset-password-form";
import { libreBaskerville } from "@/app/layout";

export default function ResetPassword() {
  return (
    <div className="mx-auto max-w-[380px] px-4">
      <h2
        className={`${libreBaskerville.className} text-center text-2xl font-semibold tracking-tight text-gray-900`}
      >
        Reset password
      </h2>
      <p className="text-center text-sm text-gray-700 mt-2">
        Enter your new password
      </p>
      <div className="mt-8">
        <ResetPasswordForm />
      </div>
    </div>
  );
}
