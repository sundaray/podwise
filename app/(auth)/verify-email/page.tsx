import Link from "next/link"
 
import { Icons } from "@/components/icons"
 
export default function VerifyEmail() {
  return (
    <div className="mx-auto max-w-md px-4 text-center">
      <h2 className="text-secondary-foreground mb-2 text-2xl font-semibold tracking-tight">
        Verify your email
      </h2>
      <p className="text-muted-foreground mb-4 text-pretty text-sm">
        We&apos;ve sent you a verification link.
      </p>
      <Link
        href="/signin"
        className="text-primary inline-flex items-center gap-1 p-2 text-sm font-semibold transition-colors hover:text-blue-500"
      >
        Back to sign in
        <Icons.arrowRight className="size-4" />
      </Link>
    </div>
  )
}