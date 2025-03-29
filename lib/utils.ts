import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatHostForUrl(host: string): string {
  return host.toLowerCase().replace(/\s+/g, '-');
}