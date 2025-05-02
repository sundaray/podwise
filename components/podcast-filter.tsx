"use client";

import * as React from "react";
import { useState, useTransition } from "react";
import { useQueryState } from "nuqs";
import {
  Button,
  Checkbox,
  Dialog,
  DialogTrigger,
  Modal,
  ModalOverlay,
  GridList,
  GridListItem,
  SearchField,
  Input,
  Label,
} from "react-aria-components";
import { podcastHosts } from "@/podcast-list/podcast-hosts";
import { ReactAriaCheckbox } from "@/components/ui/react-aria-checkbox";

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
        className="flex items-center gap-2 rounded-md border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:outline-none"
        data-pending={isLoading ? "" : undefined}
      >
        {showFilterCount && (
          <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-sky-700 px-1.5 text-xs font-bold text-white">
            {selectedShowsArray.length}
          </span>
        )}
        Filter by podcast
      </Button>
      <ModalOverlay
        isDismissable /* click outside or Esc closes */
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4"
      >
        <Modal className="w-full max-w-md">
          <Dialog
            aria-label="Filter podcasts"
            className="flex max-h-[600px] w-full max-w-md flex-col rounded-lg bg-white shadow-xl"
          >
            {({ close }) => (
              <>
                <SearchField
                  className="border-b p-6"
                  value={searchText}
                  onChange={setSearchText}
                >
                  <Label className="sr-only">Search podcasts</Label>
                  <Input
                    className="w-full rounded-full border border-gray-300 px-4 py-2"
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
                        className="data-[selected]:bg-sky-700 flex cursor-pointer items-center gap-2 rounded-md p-2 text-sm outline-none data-[focused]:bg-gray-100 data-[selected]:text-white"
                      >
                        <ReactAriaCheckbox />
                        {host.name}
                      </GridListItem>
                    ))}
                  </GridList>
                </div>

                <div className="flex justify-between border-t p-4">
                  <Button
                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:outline-none"
                    onPress={clearFilters}
                  >
                    Clear filters
                  </Button>
                  <Button
                    className="rounded-full bg-sky-700 px-3 py-1.5 text-sm font-medium text-white hover:bg-sky-500 focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:outline-none"
                    onPress={close}
                  >
                    Apply filter
                  </Button>
                </div>
              </>
            )}
          </Dialog>
        </Modal>
      </ModalOverlay>
    </DialogTrigger>
  );
}
