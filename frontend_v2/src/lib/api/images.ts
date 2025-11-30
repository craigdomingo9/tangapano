import { axiosInstance } from "@/lib/api/config";

// Types
export interface ListingImage {
  id: string;
  display_image: string;
  is_face_image: boolean;
  caption: string;
}

export const ImagesApi = {
  upload: async (listingId: string, files: File[], accessToken: string) => {
    // 1. Use .map() to create an array of Promises
    const uploadPromises = files.map((file) => {
      const formData = new FormData();

      // 2. Append the File object directly (No Buffer needed in browser)
      formData.append("image", file);
      formData.append("listing", listingId);
      formData.append("is_face_image", false.toString());
      formData.append("caption", "Bedroom"); // Good practice to use filename as default caption

      // Return the axios promise
      return axiosInstance.post(`/listings/listing-images/`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Token ${accessToken}`,
        },
      });
    });

    // 3. Wait for all uploads to finish concurrently
    const responses = await Promise.all(uploadPromises);

    // 4. Return the data from all responses
    return responses.map((response) => response.data);
  },

  delete: async (imageId: string, accessToken: string) => {
    await axiosInstance.delete(`/listings/listing-images/${imageId}/`, {
      headers: { Authorization: `Token ${accessToken}` },
    });
    return imageId;
  },

  updateLabel: async (imageId: string, label: string, accessToken: string) => {
    const { data } = await axiosInstance.patch(
      `/listings/listing-images/${imageId}/`,
      {
        caption: label,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${accessToken}`,
        },
      }
    );
    return data;
  },

  setCover: async (imageId: string, accessToken: string) => {
    const { data } = await axiosInstance.patch(
      `/listings/listing-images/${imageId}/`,
      { is_face_image: true },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${accessToken}`,
        },
      }
    );
    return data;
  },
};
