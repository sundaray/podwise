import Link from "next/link"
 
import { Icons } from "@/components/icons"
 
export default async function AuthError() {
  return (
    <div className="mx-auto max-w-lg px-4 text-center">
      <h1 className="text-xl font-bold text-red-600">Sign-in Unsuccessful</h1>
      <p className="text-secondary-foreground mt-2 text-sm">Please try again</p>
      <div>
        <Link
          href="/signin"
          className="mt-4 inline-flex items-center gap-1 rounded-md bg-blue-50 px-2 py-1 text-sm font-semibold text-blue-500 hover:text-blue-600"
        >
          Return to sign in
          <Icons.arrowRight className="size-4" />
        </Link>
      </div>
    </div>
  )
}