"use client";

import { useState, useTransition } from "react";
import { useQueryState, parseAsString, parseAsArrayOf } from "nuqs";
import {
  Button,
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
import { Icons } from "@/components/icons";

export function PodcastFilter() {
  const [isLoading, startTransition] = useTransition();
  const [searchText, setSearchText] = useState("");

  /* ------------------------------------------------------------
   * query-param hooks
   * ---------------------------------------------------------- */
  const [selectedShows, setSelectedShows] = useQueryState(
    "shows",
    parseAsArrayOf(parseAsString)
      .withDefault([])
      .withOptions({ startTransition, shallow: false }),
  );

  const [, setPage] = useQueryState(
    "page",
    parseAsString
      .withDefault("1")
      .withOptions({ startTransition, shallow: false }),
  );
  const [, setQuery] = useQueryState(
    "query",
    parseAsString.withOptions({ startTransition, shallow: false }),
  );
  const [, setTier] = useQueryState(
    "tier",
    parseAsString
      .withDefault("all")
      .withOptions({ startTransition, shallow: false }),
  );

  /* ------------------------------------------------------------
   * helpers
   * ---------------------------------------------------------- */
  function resetOtherParams() {
    setPage(null);
    setQuery(null);
    setTier(null);
  }

  function clearFilters() {
    setSelectedShows(null);
    resetOtherParams();
  }

  /* ------------------------------------------------------------
   * derived data
   * ---------------------------------------------------------- */
  const selectedShowsArray = selectedShows
    ? Array.isArray(selectedShows)
      ? selectedShows
      : [selectedShows]
    : [];

  const nothingSelected = selectedShowsArray.length === 0;

  const filteredHosts = podcastHosts.filter((host) =>
    host.name.toLowerCase().includes(searchText.toLowerCase()),
  );

  const showFilterCount = selectedShowsArray.length > 0;

  /* ------------------------------------------------------------ */
  return (
    <DialogTrigger>
      {/* ───────── trigger button ───────── */}
      <Button
        className="flex h-10 items-center gap-2 rounded-full bg-gray-100 px-4 py-2 text-sm font-medium text-gray-900 transition-colors hover:bg-gray-200 focus:ring-2 focus:ring-sky-600 focus:ring-offset-2 focus:outline-none"
        data-pending={isLoading ? "" : undefined}
      >
        {showFilterCount && (
          <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-sky-600 px-1.5 text-xs text-white">
            {selectedShowsArray.length}
          </span>
        )}
        <Icons.listFilter className="size-4 text-gray-500" strokeWidth={3} />
        <span className="sm:hidden">Filter</span>
        <span className="hidden sm:inline-block">Filter by podcast</span>
      </Button>

      {/* ───────── dialog ───────── */}
      <ModalOverlay
        isDismissable
        className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/30 p-4"
      >
        <Modal className="w-full max-w-md">
          <Dialog
            aria-label="Filter podcasts"
            className="flex max-h-[600px] w-full flex-col rounded-xl bg-white shadow-xl"
          >
            {({ close }) => (
              <>
                {/* search box */}
                <SearchField
                  className="border-b p-6"
                  value={searchText}
                  onChange={setSearchText}
                >
                  <Label className="sr-only">Search podcasts</Label>
                  <div className="relative">
                    <Input
                      className="h-12 w-full rounded-full border-0 bg-gray-100 py-2 pl-10 text-sm placeholder-gray-500 ring-[2px] ring-gray-100 transition-[color,box-shadow] outline-none ring-inset focus-visible:ring-[2px] focus-visible:ring-sky-600 focus-visible:ring-offset-0"
                      placeholder="Search podcasts..."
                    />
                    <Icons.search className="absolute top-1/2 left-4 size-4 -translate-y-1/2 text-gray-500" />
                  </div>
                </SearchField>

                <div className="flex-1 overflow-y-auto p-3">
                  {filteredHosts.length > 0 ? (
                    <GridList
                      aria-label="Podcasts"
                      selectionMode="multiple"
                      selectedKeys={selectedShowsArray}
                      onSelectionChange={(keys) => {
                        const arr = [...keys].map(String);
                        setSelectedShows(arr.length ? arr : null);
                        resetOtherParams();
                      }}
                      className="flex flex-col gap-2"
                    >
                      {filteredHosts.map((host) => (
                        <GridListItem
                          key={host.id}
                          id={host.id}
                          textValue={host.name}
                          className="flex cursor-pointer items-center gap-2 rounded-md p-2 text-sm text-gray-900 outline-none data-[focused]:bg-gray-100 data-[hovered]:bg-gray-100 data-[selected]:bg-sky-600 data-[selected]:text-white"
                        >
                          <ReactAriaCheckbox />
                          {host.name}
                        </GridListItem>
                      ))}
                    </GridList>
                  ) : (
                    /* no matches – show a friendly message */
                    <p className="text-center text-sm text-red-600">
                      No podcasts found
                    </p>
                  )}
                </div>

                {/* action buttons */}
                <div className="flex justify-between border-t p-4">
                  <Button
                    isDisabled={nothingSelected}
                    className="rounded-full px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:ring-2 focus:ring-sky-600 focus:ring-offset-2 focus:outline-none data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50"
                    onPress={clearFilters}
                  >
                    Clear filters
                  </Button>
                  <Button
                    isDisabled={nothingSelected}
                    className="rounded-full bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-900/90 focus:ring-2 focus:ring-sky-600 focus:ring-offset-2 focus:outline-none data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50"
                    onPress={close}
                  >
                    Apply filters
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
