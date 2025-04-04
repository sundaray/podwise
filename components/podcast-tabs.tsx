"use client";

import { useTransition } from "react";
import { useQueryState, parseAsString, parseAsInteger } from "nuqs";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

type PodcastTier = "all" | "free" | "premium";

type PodcastTabsProps = {
  className?: string;
  onTierChange?: (tier: PodcastTier) => void;
};

export function PodcastTabs({ className }: PodcastTabsProps) {
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
      className={className}
      data-pending={isLoading ? "" : undefined}
    >
      <TabsList className="grid max-w-md grid-cols-3 rounded-full">
        <TabsTrigger value="all" className="rounded-full">
          All
        </TabsTrigger>
        <TabsTrigger value="free" className="rounded-full">
          Free
        </TabsTrigger>
        <TabsTrigger value="premium" className="rounded-full">
          Premium
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
