import { cache } from "react";

// This function is cached per request. calling it 10 times = 1 API call.
export const getListingMetadata = cache(
  async (id: string): Promise<Listing | null> => {
    try {
      // Note: We use fetch() here, not axiosInstance, because this runs on the Node server
      // and might need different base URL handling or direct DB access.
      const res = await fetch(
        `${
          process.env.INTERNAL_API_URL || "http://localhost/api"
        }/listings/listing/${id}/`
      );

      if (!res.ok) return null;
      return res.json();
    } catch (error) {
      console.error("Metadata fetch error:", error);
      return null;
    }
  }
);
