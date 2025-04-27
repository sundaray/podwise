import Link from "next/link"
import { libreBaskerville } from "@/app/layout";
import { Icons } from "@/components/icons"
 
export default async function AuthError() {
  return (
    <div className="mx-auto max-w-md px-4 text-center">
      <h2
        className={`${libreBaskerville.className} mb-2 text-2xl font-semibold tracking-tight text-red-700`}
      >
        Sign-in unsuccessful</h2>
      <p className="mb-4 text-sm text-pretty text-gray-700">
        Please try again</p>
      <div>
      <Link
        href="/signin"
        className="inline-flex items-center gap-1 rounded-full px-3 py-2 text-sm font-medium text-sky-700 transition-colors hover:bg-gray-100"
      >
        Back to sign in
        <Icons.chevronRight className="size-4" />
      </Link>
      </div>
    </div>
  )
}