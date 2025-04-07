"use client";

import { useState } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Icons } from "@/components/icons";

type UserAccountNavClientProps = {
  user: {
    id: string;
    email: string;
    role: string;
  };
};

export function UserAccountNavClient({ user }: UserAccountNavClientProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  // Prevent dropdown from closing during sign out
  function handleOpenChange(open: boolean) {
    if (isSigningOut) return;
    setIsOpen(open);
  }

  // Handle the sign out process
  async function handleSignOut() {
    try {
      // setIsSigningOut(true);
      // await signOut();
    } catch (error) {
      console.error("Unable to sign out:", error);
    } finally {
      setIsSigningOut(false);
      setIsOpen(false);
    }
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={handleOpenChange}>
      <DropdownMenuTrigger className="flex items-center space-x-1">
        <span className="text-gray-700 text-sm font-medium">
          My Account
        </span>
        <Icons.chevronDown className="text-gray-500 size-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-1 leading-none">
            {user.email && (
              <>
                <p className="text-gray-500 text-xs">signed in as</p>
                <p className="text-gray-700 w-[200px] truncate text-sm">
                  {user.email}
                </p>
              </>
            )}
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer">
          <button onClick={handleSignOut} className="flex w-full items-center">
            {isSigningOut ? (
              <>
                <Icons.loader className="mr-2 size-3 animate-spin" />
                <p className="text-secondary-foreground text-sm">Sign out</p>
              </>
            ) : (
              <>
                <Icons.logOut className="text-muted-foreground mr-2 size-3" />
                <p className="text-sm">Sign out</p>
              </>
            )}
          </button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
