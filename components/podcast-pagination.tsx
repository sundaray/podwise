"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { useQueryState, parseAsInteger } from "nuqs";
import { useMemo } from "react"; // Import useMemo

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"; // Assumes these use next/link internally
import { cn } from "@/lib/utils";

const SIBLING_COUNT = 1; // Number of pages to show on each side of the current page

type PodcastPaginationProps = {
  totalPages: number;
  className?: string;
};

export function PodcastPagination({
  totalPages,
  className,
}: PodcastPaginationProps) {
  const [page] = useQueryState("page", parseAsInteger.withDefault(1));
  const currentSearchParams = useSearchParams();

  // --- Logic to calculate pagination range ---
  const paginationRange = useMemo((): (number | string)[] => {
    const totalPageNumbers = SIBLING_COUNT + 5; // first + last + current + siblings*2 + dots*2

    // Case 1: Total pages is less than the numbers we want to show -> show all
    if (totalPages <= totalPageNumbers) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    // Calculate left and right sibling indices, ensuring they are within bounds
    const leftSiblingIndex = Math.max(page - SIBLING_COUNT, 1);
    const rightSiblingIndex = Math.min(page + SIBLING_COUNT, totalPages);

    // Calculate if dots should be shown
    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < totalPages - 1;

    const firstPageIndex = 1;
    const lastPageIndex = totalPages;

    // Case 2: No left dots, but right dots needed
    if (!shouldShowLeftDots && shouldShowRightDots) {
      let leftItemCount = 3 + 2 * SIBLING_COUNT;
      let leftRange = Array.from({ length: leftItemCount }, (_, i) => i + 1);
      // Use a unique key/identifier for ellipsis rendering
      return [...leftRange, "ellipsis-right", lastPageIndex];
    }

    // Case 3: Left dots needed, but no right dots
    if (shouldShowLeftDots && !shouldShowRightDots) {
      let rightItemCount = 3 + 2 * SIBLING_COUNT;
      let rightRange = Array.from(
        { length: rightItemCount },
        (_, i) => totalPages - rightItemCount + 1 + i,
      );
      return [firstPageIndex, "ellipsis-left", ...rightRange];
    }

    // Case 4: Both left and right dots needed
    if (shouldShowLeftDots && shouldShowRightDots) {
      let middleRange = Array.from(
        { length: rightSiblingIndex - leftSiblingIndex + 1 },
        (_, i) => leftSiblingIndex + i,
      );
      return [
        firstPageIndex,
        "ellipsis-left",
        ...middleRange,
        "ellipsis-right",
        lastPageIndex,
      ];
    }

    // Fallback (shouldn't be reached with the logic above)
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }, [page, totalPages]);
  // --- End of pagination range logic ---

  // Helper creates href objects for next/link
  const createPageHref = (pageNumber: number | string) => {
    if (typeof pageNumber !== "number") return {};
    const params = new URLSearchParams(currentSearchParams);
    params.set("page", String(pageNumber));
    return { search: params.toString() };
  };

  // Don't render if only one page
  if (totalPages <= 1) {
    return null;
  }

  const isFirstPage = page === 1;
  const isLastPage = page === totalPages;

  return (
    <Pagination className={cn("my-8 border-t py-12", className)}>
      <PaginationContent>
        {/* Previous Button */}
        <PaginationItem>
          <PaginationPrevious
            href={isFirstPage ? {} : createPageHref(page - 1)}
            aria-disabled={isFirstPage}
            tabIndex={isFirstPage ? -1 : undefined}
            className={cn(isFirstPage && "pointer-events-none opacity-50")}
          />
        </PaginationItem>

        {/* Page Numbers & Ellipses */}
        {paginationRange.map((pageNumberOrEllipsis, index) => {
          // Render Ellipsis component if the item is one of our string identifiers
          if (
            pageNumberOrEllipsis === "ellipsis-left" ||
            pageNumberOrEllipsis === "ellipsis-right"
          ) {
            return (
              <PaginationItem key={`${pageNumberOrEllipsis}-${index}`}>
                <PaginationEllipsis />
              </PaginationItem>
            );
          }

          // Otherwise, it's a page number - render the link
          const pageNumber = pageNumberOrEllipsis as number; // Type assertion
          const isActive = page === pageNumber;
          return (
            <PaginationItem key={pageNumber}>
              <PaginationLink
                href={createPageHref(pageNumber)}
                isActive={isActive}
              >
                {pageNumber}
              </PaginationLink>
            </PaginationItem>
          );
        })}

        {/* Next Button */}
        <PaginationItem>
          <PaginationNext
            href={isLastPage ? {} : createPageHref(page + 1)}
            aria-disabled={isLastPage}
            tabIndex={isLastPage ? -1 : undefined}
            className={cn(isLastPage && "pointer-events-none opacity-50")}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
