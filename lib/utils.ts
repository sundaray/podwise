import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { loadStripe, Stripe } from "@stripe/stripe-js";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatHostForUrl(host: string): string {
  if (host.trim().toLowerCase() === "the diary of a ceo") {
    return "doac";
  }

  if (host.trim().toLowerCase() === "dr rangan chatterjee") {
    return "rangan-chatterjee";
  }

  return host
    .trim()
    .toLowerCase()
    .replace(/[^\w\s-]/g, "") // Remove punctuation and special characters
    .replace(/\s+/g, "-"); // Replace spaces with hyphens
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

let stripePromise: Promise<Stripe | null>;

export const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_USD!,
    );
  }
  return stripePromise;
};
