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
