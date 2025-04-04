"use client";

import { useTransition } from "react";
import { useQueryState, parseAsString, parseAsInteger } from "nuqs";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

type PodcastType = "all" | "free" | "premium";

type PodcastTabsProps = {
  className?: string;
  onTypeChange?: (type: PodcastType) => void;
};

export function PodcastTabs({ className, onTypeChange }: PodcastTabsProps) {
  const [isLoading, startTransition] = useTransition();

  // Set up query parameter for podcast type
  const [type, setType] = useQueryState(
    "type",
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
    setType(value);

    setPage(null);
  }

  return (
    <Tabs
      value={type}
      onValueChange={handleTypeChange}
      className={className}
      data-pending={isLoading ? "" : undefined}
    >
      <TabsList className="mx-auto mb-8 grid w-full max-w-md grid-cols-3">
        <TabsTrigger value="all">All</TabsTrigger>
        <TabsTrigger value="free">Free</TabsTrigger>
        <TabsTrigger value="premium">Premium</TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
