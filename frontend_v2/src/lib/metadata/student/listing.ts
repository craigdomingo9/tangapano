import { Metadata } from "next";
import { getListingMetadata } from "@/lib/api/server/fetch-listing";

export async function generateListingMetadata(
  listingId: string
): Promise<Metadata | null> {
  const listing = await getListingMetadata(listingId);
  if (!listing) return null;

  const coverImage =
    listing.images.find((img) => img.is_face_image)?.display_image ||
    listing.images[0]?.display_image;

  const lowestPrice = listing.rooms.reduce(
    (prev, curr) => Math.min(prev, parseFloat(curr.rent_per_month)),
    Infinity
  );

  return {
    title: `${listing.title} | Student Housing`,
    description: `${listing.neighborhood.name}, ${listing.neighborhood.city}. ${listing.rooms.length} rooms available. Starting from $${lowestPrice}.`,
    openGraph: {
      title: listing.title,
      description: `Check out this student accommodation in ${listing.neighborhood.name}!`,
      images: coverImage ? [coverImage] : [],
    },
  };
}
