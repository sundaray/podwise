import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatHostForUrl(host: string): string {
  return host.trim().toLowerCase().replace(/\s+/g, "-");
}

export const formatTagForUrl = (tag: string): string => {
  return tag.trim().toLowerCase().replace(/\s+/g, "-");
};

export function formatTagForDisplay(urlTag: string): string {
  return urlTag
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}