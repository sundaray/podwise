"use client";

import { useTransition } from "react";
import { cn } from "@/lib/utils";
import { useQueryState, parseAsString, parseAsInteger } from "nuqs";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

type PodcastTabsProps = React.ComponentPropsWithoutRef<typeof Tabs> & {
  className?: string;
};

export function PodcastTabs({ className, ...rest }: PodcastTabsProps) {
  const [isLoading, startTransition] = useTransition();

  // Set up query parameter for podcast tier
  const [tier, setTier] = useQueryState(
    "tier",
    parseAsString.withDefault("all").withOptions({
      startTransition,
      shallow: false,
    }),
  );

  // Also get access to the page parameter so we can clear it
  const [_, setPage] = useQueryState(
    "page",
    parseAsInteger.withDefault(1).withOptions({
      startTransition,
      shallow: false,
    }),
  );

  // Function to handle tab changes
  function handleTypeChange(value: string) {
    setTier(value);
    setPage(null);
  }

  return (
    <Tabs
      value={tier}
      onValueChange={handleTypeChange}
      className={cn("h-10", className)}
      data-pending={isLoading ? "" : undefined}
      {...rest}
    >
      <TabsList className="grid h-10 max-w-md grid-cols-3 rounded-full">
        <TabsTrigger value="all" className="rounded-full text-gray-700">
          All
        </TabsTrigger>
        <TabsTrigger value="free" className="rounded-full text-gray-700">
          Free
        </TabsTrigger>
        <TabsTrigger value="premium" className="rounded-full text-gray-700">
          Premium
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
