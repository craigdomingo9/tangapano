import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function hashString(str: string): string {
  if (!str) return "";

  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(36);
}

export const getAcronym = (text: string) => {
  const stopWords = ["of", "the", "in", "and", "at", "for", "to", "a"];

  return text
    .split(" ")
    .filter((word) => !stopWords.includes(word.toLowerCase())) // Remove stop words
    .map((word) => word.charAt(0).toUpperCase()) // Get first letter & capitalize
    .join("");
};
