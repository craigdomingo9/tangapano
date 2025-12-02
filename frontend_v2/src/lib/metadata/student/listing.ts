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

  const baseUrl =
    process.env.NODE_ENV === "production"
      ? process.env.NEXT_PUBLIC_DOMAIN ?? "https://tangapano.co.zw"
      : "http://localhost";

  const imageUrl = `${baseUrl}${coverImage}`;

  const pageUrl = `${baseUrl}/listing/${listingId}`;

  const lowestPrice = listing.rooms.reduce(
    (prev, curr) => Math.min(prev, parseFloat(curr.rent_per_month)),
    Infinity
  );

  const title = `${listing.title} | Student Housing`;

  return {
    title: title,
    description: `${listing.neighborhood.name}, ${listing.neighborhood.city}. ${listing.rooms.length} rooms available. Starting from $${lowestPrice}.`,
    openGraph: {
      title: title,
      description: `Check out this student accommodation in ${listing.neighborhood.name}!`,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 800,
          alt: title,
        },
      ],
      url: pageUrl,
      type: "website",
      siteName: "TangaPano",
    },
    twitter: {
      card: "summary_large_image",
      title: title,
      description: `Check out this student accommodation in ${listing.neighborhood.name}!`,
      images: [imageUrl],
    },
    alternates: {
      canonical: pageUrl,
    },
  };
}
