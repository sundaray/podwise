import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatHostForUrl(host: string): string {
  // Special case for "The Diary Of A CEO"
  if (host.trim().toLowerCase() === "the diary of a ceo") {
    return "doac";
  }

  // Otherwise, use the original formatting logic
  return host.trim().toLowerCase().replace(/\s+/g, "-");
}
export const formatTagForUrl = (tag: string): string => {
  return tag.trim().toLowerCase().replace(/\s+/g, "-");
};

export function formatTagForDisplay(urlTag: string): string {
  return urlTag
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
