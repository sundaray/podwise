import React from "react";
import Link from "next/link";
import { UserAccountNavClient } from "@/components/user-account-nav-client";

export async function UserAccountNav() {
  const user = null;

  if (!user) {
    return (
      <nav className="ml-auto flex hidden items-center md:block">
        <Link
          href="/premium"
          className="mr-3 inline-flex items-center rounded-full bg-amber-400 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-amber-400 hover:text-gray-900"
        >
          Go Premium
        </Link>

        <Link
          href="/signin"
          className="inline-flex items-center rounded-full px-4 py-2 text-sm font-medium text-white bg-gray-900 transition-colors hover:bg-gray-900 hover:text-white"
        >
          Sign in
        </Link>
      </nav>
    );
  }
  return <UserAccountNavClient user={user} />;
}
