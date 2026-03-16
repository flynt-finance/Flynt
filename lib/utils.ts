import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format an amount with the given currency code (e.g. NGN, USD). Uses en-NG for NGN, en-US as fallback. */
export function formatTransactionAmount(
  amount: number,
  currency: string
): string {
  const code = currency || "NGN";
  const locale = code.toUpperCase() === "NGN" ? "en-NG" : "en-US";
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: code,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}
