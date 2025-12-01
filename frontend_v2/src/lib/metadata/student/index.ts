import { Metadata } from "next";
import { StudentParams } from "@/lib/types/student";
import { generateListingMetadata } from "./listing";
import { generateSearchMetadata } from "./search";
import { generateDefaultMetadata } from "./default"; // Assume this exists

export async function resolveStudentMetadata(rawParams: {
  [key: string]: string | string[] | undefined;
}): Promise<Metadata> {
  // Cast params safely
  const params = rawParams as unknown as StudentParams;

  // STRATEGY 1: Listing Detail
  if (params.page === "listing" && params.listingId) {
    const meta = await generateListingMetadata(params.listingId);
    if (meta) return meta;
  }

  // STRATEGY 2: Search Results
  if (params.page === "search") {
    return generateSearchMetadata(params);
  }

  // STRATEGY 3: Express Interest (Maybe no index?)
  if (params.page === "interest") {
    return {
      title: "Express Interest | Student Portal",
      robots: { index: false },
    };
  }

  // FALLBACK
  return generateDefaultMetadata();
}
