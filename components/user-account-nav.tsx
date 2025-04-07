import React from "react";
import Link from "next/link";
import { FaUser } from "react-icons/fa6";
import { UserAccountNavClient } from "@/components/user-account-nav-client";

export async function UserAccountNav() {
  const user = null;

  if (!user) {
    return (
      <Link
        href="/signin"
        className="ml-auto inline-flex items-center rounded-full px-2 py-1 text-sm font-medium text-gray-700 transition-colors hover:text-gray-900"
      >
        <FaUser className="mr-1 size-3 text-gray-500" />
        Sign in
      </Link>
    );
  }
  return <UserAccountNavClient user={user} />;
}
