"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Popover,
  PopoverButton,
  PopoverBackdrop,
  PopoverPanel,
} from "@headlessui/react";
import clsx from "clsx";
import { cn } from "@/lib/utils";

function MobileNavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isActive = pathname === href;
  return (
    <PopoverButton
      as={Link}
      href={href}
      className={cn(
        "flex w-fit items-center text-gray-700 rounded-full px-4 py-2 font-medium transition-colors",
        "hover:text-gray-900",
        isActive && "bg-gray-100 text-gray-900",
      )}
    >
      {children}
    </PopoverButton>
  );
}

function MobileNavIcon({ open }: { open: boolean }) {
  return (
    <svg
      aria-hidden="true"
      className="h-3.5 w-3.5 overflow-visible stroke-gray-700"
      fill="none"
      strokeWidth={2}
      strokeLinecap="round"
    >
      <path
        d="M0 1H14M0 7H14M0 13H14"
        className={clsx(
          "origin-center transition",
          open && "scale-90 opacity-0",
        )}
      />
      <path
        d="M2 2L12 12M12 2L2 12"
        className={clsx(
          "origin-center transition",
          !open && "scale-90 opacity-0",
        )}
      />
    </svg>
  );
}

export function MobileNav() {
  return (
    <Popover className="ml-auto md:hidden">
      <PopoverButton
        className="relative z-10 flex size-8 items-center justify-center focus:not-data-focus:outline-hidden"
        aria-label="Toggle Navigation"
      >
        {({ open }) => <MobileNavIcon open={open} />}
      </PopoverButton>
      <PopoverBackdrop
        transition
        className="fixed inset-0 bg-gray-300/50 duration-150 data-closed:opacity-0 data-enter:ease-out data-leave:ease-in"
      />
      <PopoverPanel
        transition
        className="text-md absolute inset-x-0 top-16 mx-4 flex origin-top flex-col gap-3 rounded-xl bg-white p-4 tracking-tight text-gray-700 shadow-xl ring-1 ring-gray-900/5 data-closed:scale-95 data-closed:opacity-0 data-enter:duration-150 data-enter:ease-out data-leave:duration-100 data-leave:ease-in"
      >
        <MobileNavLink href="/about">About</MobileNavLink>
        <MobileNavLink href="/podcasts">Podcasts</MobileNavLink>
        <MobileNavLink href="/tags">Tags</MobileNavLink>
        <hr className="border-gray-200" />
        <PopoverButton
          as={Link} 
          href="/premium"
          className="inline-flex w-full items-center justify-center rounded-full bg-linear-to-b from-amber-400 to-amber-500 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-amber-400 hover:text-gray-900"
        >
          Go Premium
        </PopoverButton>
        <PopoverButton
          as={Link}
          href="/login"
          className="inline-flex w-full items-center justify-center rounded-full bg-gray-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-900/90 hover:text-white"
        >
          Sign in
        </PopoverButton>
      </PopoverPanel>
    </Popover>
  );
}
