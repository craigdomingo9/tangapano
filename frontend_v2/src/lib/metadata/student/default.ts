import { Metadata } from "next";

export async function generateDefaultMetadata(): Promise<Metadata> {
  return {
    title: "Student Housing | Find Your Accommodation",
    description: "Browse the best student housing near your campus",
  };
}
