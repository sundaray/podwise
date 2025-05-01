"use client";

import * as React from "react";
import { useState, useTransition } from "react";
import { useQueryState } from "nuqs";
import {
  Button,
  Dialog,
  DialogTrigger,
  Heading,
  Modal,
  GridList,
  GridListItem,
  SearchField,
  Input,
  Label,
} from "react-aria-components";
import { podcastHosts } from "@/podcast-list/podcast-hosts";

export function PodcastFilter() {
  // Add useTransition hook
  const [isLoading, startTransition] = useTransition();

  // Local state for search within the dialog
  const [searchText, setSearchText] = useState("");

  // Get the current selected shows from URL with startTransition
  const [selectedShows, setSelectedShows] = useQueryState("shows", {
    startTransition,
    shallow: false,
  });

  // Parse the selected shows into an array
  const selectedShowsArray = selectedShows
    ? Array.isArray(selectedShows)
      ? selectedShows
      : [selectedShows]
    : [];

  // Filter podcast hosts based on search text
  const filteredHosts = podcastHosts.filter((host) =>
    host.name.toLowerCase().includes(searchText.toLowerCase()),
  );

  // Clear all filters
  const clearFilters = () => {
    setSelectedShows(null);
  };

  // Determine if we should show the filter count badge
  const showFilterCount = selectedShowsArray.length > 0;

  return (
    <DialogTrigger>
      <Button
        className="z-50 flex items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:outline-none"
        data-pending={isLoading ? "" : undefined}
      >
        {showFilterCount && (
          <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-sky-700 px-1.5 text-xs font-bold text-white">
            {selectedShowsArray.length}
          </span>
        )}
        Filter by podcast
      </Button>

      <Modal
        className="fixed inset-0 flex items-center justify-center bg-black/30 p-4"
        isDismissable
      >
        <Dialog
          className="flex max-h-[80vh] w-full max-w-md flex-col overflow-hidden rounded-lg bg-white shadow-xl"
          aria-label="Filter podcasts"
        >
          {({ close }) => (
            <>
              <Heading
                slot="title"
                className="border-b p-4 text-lg font-medium"
              >
                Filter by Podcast
              </Heading>

              <SearchField
                className="border-b p-4"
                value={searchText}
                onChange={setSearchText}
              >
                <Label className="sr-only">Search podcasts</Label>
                <Input
                  className="w-full rounded-md border border-gray-300 p-2"
                  placeholder="Search podcasts..."
                />
              </SearchField>

              <div className="flex-1 overflow-y-auto p-2">
                <GridList
                  aria-label="Podcasts"
                  selectionMode="multiple"
                  selectedKeys={selectedShowsArray}
                  onSelectionChange={(keys) => {
                    const selectedKeys = [...keys];
                    setSelectedShows(
                      selectedKeys.length > 0 ? selectedKeys : null,
                    );
                  }}
                  className="flex flex-col gap-1"
                >
                  {filteredHosts.map((host) => (
                    <GridListItem
                      key={host.id}
                      id={host.id}
                      textValue={host.name}
                      className="flex cursor-pointer items-center gap-2 rounded-md p-2 outline-none data-[focused]:bg-gray-100 data-[selected]:bg-sky-50 data-[selected]:text-sky-700"
                    >
                      <div className="flex h-5 w-5 items-center justify-center rounded border border-gray-400 data-[selected]:border-sky-700 data-[selected]:bg-sky-700">
                        <svg
                          className="hidden h-3 w-3 text-white data-[selected]:block"
                          aria-hidden="true"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </div>
                      {host.name}
                    </GridListItem>
                  ))}
                </GridList>
              </div>

              <div className="flex justify-between border-t p-4">
                <Button
                  className="px-3 py-1.5 text-sm font-medium text-gray-700 hover:text-gray-900 focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:outline-none"
                  onPress={clearFilters}
                >
                  Clear filters
                </Button>
                <Button
                  className="rounded-md bg-sky-700 px-3 py-1.5 text-sm font-medium text-white hover:bg-sky-800 focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:outline-none"
                  onPress={close}
                >
                  Apply filter
                </Button>
              </div>
            </>
          )}
        </Dialog>
      </Modal>
    </DialogTrigger>
  );
}
