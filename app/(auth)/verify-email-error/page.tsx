import Link from "next/link";

import { Icons } from "@/components/icons";

export default function VerifyEmailError() {
  return (
    <div className="mx-auto max-w-md px-4 text-center">
      <h2 className="mb-2 text-xl font-semibold tracking-tight text-red-600">
        Email Verification Failed
      </h2>
      <p className="text-muted-foreground mb-4 text-sm text-pretty">
        Something went wrong while verifying your email. Please try again or
        request a new verification link.
      </p>
      <Link
        href="/signin"
        className="text-primary inline-flex items-center gap-1 p-2 text-sm font-semibold transition-colors hover:text-blue-500"
      >
        Back to sign in
        <Icons.arrowRight className="size-4" />
      </Link>
    </div>
  );
}
