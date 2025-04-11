"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

type NavItemProps = {
  href: string;
  title: string;
};

export function NavItem({ href, title }: NavItemProps) {
  const pathname = usePathname();
  const isActive = href === pathname;

  return (
    <Link
      className={cn(
        "relative p-2 text-sm font-medium text-gray-700 transition-colors hover:text-gray-900",
        isActive && "text-primary",
      )}
      href={href}
    >
      {title}
    </Link>
  );
}
