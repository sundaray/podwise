import React from "react";
import Link from "next/link";
import { FaUser } from "react-icons/fa6";
import { Icons } from "@/components/icons";
import { UserAccountNavClient } from "@/components/user-account-nav-client";

export async function UserAccountNav() {
  const user = null;

  if (!user) {
    return (
      <nav className="ml-auto flex hidden items-center md:block">
        <Link
          href="/premium"
          className="inline-flex mr-3 items-center rounded-full bg-yellow-400 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-purple-900"
        >
          {/* <Icons.star className="mr-2 size-3.5 text-purple-200" /> */}
          Go Premium
        </Link>

        <Link
          href="/signin"
          className="inline-flex items-center px-4 py-2 border rounded-full text-sm font-medium text-gray-700 transition-colors hover:text-gray-900 hover:bg-gray-100"
        >
          <FaUser className="mr-1 size-3 text-gray-400" />
          Sign in
        </Link>
      </nav>
    );
  }
  return <UserAccountNavClient user={user} />;
}
