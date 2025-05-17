import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const rowsPerPageOptions = [10, 50, 100, 200, 1000]

export function stripCountryCode(phoneNumber: string | number): string {
  const phoneStr = phoneNumber.toString();
  // if (phoneStr.length < 11) {
  //   throw new Error("Phone number must have at least 11 digits");
  // }
  return phoneStr.slice(3);
}