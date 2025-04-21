import Link from "next/link";

import { Icons } from "@/components/icons";

export default function VerifyPasswordReset() {
  return (
    <div className="mx-auto max-w-md px-4 text-center">
      <h2 className="text-secondary-foreground mb-2 text-xl font-semibold tracking-tight">
        Password reset request received
      </h2>
      <p className="text-muted-foreground mb-4 text-sm text-pretty">
        If an account exists with the email address you provided, we&apos;ll
        send a password reset link. Please check your email inbox, including
        your spam folder.
      </p>
      <Link
        href="/signin"
        className="inline-flex items-center gap-1 p-2 text-sm font-semibold text-blue-600 transition-colors hover:text-blue-500"
      >
        Back to sign in
        <Icons.arrowRight className="size-4" />
      </Link>
    </div>
  );
}
