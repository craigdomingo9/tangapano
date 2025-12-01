import { Metadata } from "next";
import { StudentParams } from "@/lib/types/student";

export async function generateSearchMetadata(
  params: StudentParams
): Promise<Metadata> {
  return {
    title: `Student Housing | Portal`,
    description: `Browse available student accommodation. Filter by price, amenities, and more.`,
    robots: {
      index: false, // Often good to prevent indexing infinite search permutations
      follow: true,
    },
  };
}
