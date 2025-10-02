import { Metadata } from "next";
import { axiosInstance } from "@/lib/services/api/config";
import ListingClient from "@/components/Listing/ListingClient";

// Server-side function to generate metadata
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  try {
    // Await the params promise
    const { slug } = await params;

    // Fetch listing data on the server
    const response = await axiosInstance.get(
      `/listings/listing/${slug}?is_full=true`
    );
    const listing = response.data;

    const ImageBaseUrl =
      process.env.NODE_ENV === "production"
        ? "http://tangapano.co.zw"
        : "http://localhost:8000";
    const imageUrl =
      `${ImageBaseUrl}${listing.images?.[0]?.image}` ||
      `${ImageBaseUrl}/default-listing.jpg`;

    const pageUrl = `${
      process.env.NODE_ENV === "production"
        ? "https://tangapano.co.zw"
        : "http://localhost:3000"
    }/listing/${slug}`;

    const title = listing.title || "Student Boarding House";
    const description = listing.neighborhood
      ? `${listing.neighborhood.name} - ${listing.rooms.length} rooms available - ${listing.campus.name} .`
      : "Student accommodation listing";

    return {
      title: title,
      description: description,
      openGraph: {
        title: title,
        description: description,
        images: [
          {
            url: imageUrl,
            width: 1200,
            height: 630,
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
        description: description,
        images: [imageUrl],
      },
      alternates: {
        canonical: pageUrl,
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);

    // Fallback metadata - need to await params here too
    const { slug } = await params;
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    return {
      title: "Student Boarding House Listing",
      description: "Find the perfect student boarding house",
      openGraph: {
        title: "Student Accommodation",
        description: "Find the perfect student boarding house",
        images: [`${baseUrl}/default-listing.jpg`],
        url: `${baseUrl}/listing/${slug}`,
        type: "website",
      },
    };
  }
}

// Server component that fetches data and passes to client component
export default async function ListingPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  try {
    // Await the params promise
    const { slug } = await params;

    // Fetch listing data on the server
    const response = await axiosInstance.get(
      `/listings/listing/${slug}?is_full=true`
    );
    const listing = response.data;

    return <ListingClient listing={listing} slug={slug} />;
  } catch (error) {
    console.error("Error fetching listing:", error);

    // You can handle errors differently here
    return (
      <div className="flex justify-center items-center fullHeight bg-neutral-100 py-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Listing Not Found</h1>
          <p>
            The listing you're looking for doesn't exist or may have been
            removed.
          </p>
        </div>
      </div>
    );
  }
}
