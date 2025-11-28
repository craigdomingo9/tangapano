import { Metadata } from "next";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/api/get-query-client"; // Your singleton helper
import { getListingData } from "@/lib/api/listings"; // The cached fetcher above
import { notFound } from "next/navigation";
import ListingDetailClient from "@/components/student/listing/ListingDetailClient";
import ListingNotFound from "@/components/student/interest/states/ListingNotFound";

interface PageProps {
  params: Promise<{ slug: string }>;
}

// --- METADATA GENERATION ---
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  // Await params
  const { slug } = await params;

  try {
    // This call is deduped via React cache()
    const listing = await getListingData(slug);

    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL || "https://tangapano.co.zw";

    // Safety check for images
    const displayImage = listing.images?.[0]?.display_image;
    const imageUrl = displayImage
      ? `${baseUrl}${displayImage}`
      : `${baseUrl}/default-listing.jpg`;

    const title = listing.title || "Student Boarding House";
    const description = listing.neighborhood
      ? `${listing.neighborhood.name} - ${listing.rooms.length} rooms available - ${listing.campus.name}.`
      : "Student accommodation listing.";

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        images: [{ url: imageUrl, width: 1200, height: 800, alt: title }],
        url: `${baseUrl}/listing/${slug}`,
        type: "website",
        siteName: "TangaPano",
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [imageUrl],
      },
    };
  } catch (error) {
    console.error("Metadata Error:", error);
    return {
      title: "Listing Not Found",
      description: "Student accommodation listing.",
    };
  }
}

// --- SERVER COMPONENT ---
export default async function ListingPage({ params }: PageProps) {
  const { slug } = await params;
  const queryClient = getQueryClient();

  // 1. Prefetch the data
  // Because getListingData is cached, this won't hit the API again if metadata ran first.
  await queryClient.prefetchQuery({
    queryKey: ["listing", slug],
    queryFn: () => getListingData(slug),
  });

  // 2. Check for 404s (Optional but recommended for SEO)
  // We check the cache state to see if the fetch succeeded
  const state = queryClient.getQueryState(["listing", slug]);
  if (state?.status === "error") {
    // You can return your custom Error UI here or trigger Next.js notFound()
    return <ListingNotFound />;
  }

  // 3. Hydrate
  // We pass the 'slug' to the client component so it knows which key to use
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ListingDetailClient slug={slug} />
    </HydrationBoundary>
  );
}
