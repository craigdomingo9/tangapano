import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ImagesApi as api, ListingImage } from "@/lib/api/images";
import { errorToast, successToast } from "@/lib/toast";

export function useImageActions(listingId: string, accessToken: string) {
  const queryClient = useQueryClient();
  const queryKey = ["listing", listingId];

  // Helper to update cache immutably
  const updateCache = (updater: (images: ListingImage[]) => ListingImage[]) => {
    queryClient.setQueryData(queryKey, (old: any) => {
      if (!old) return old;
      return { ...old, images: updater(old.images || []) };
    });
  };

  // 1. Upload
  const upload = useMutation({
    mutationFn: (files: File[]) => api.upload(listingId, files, accessToken),
    onSuccess: (newImages) => {
      successToast(
        `${
          newImages.length > 1 ? "Images were" : "Image was"
        } uploaded successfully`
      );
      // Append new images to the list
      updateCache((current) => [...current, ...newImages]);
      queryClient.invalidateQueries({ queryKey: ["listing", listingId] });
      queryClient.invalidateQueries({ queryKey: ["landlord-listings"] });
    },
    onError: () => errorToast("Failed to upload images"),
  });

  // 2. Delete
  const remove = useMutation({
    mutationFn: (imageId: string) => api.delete(imageId, accessToken),
    onSuccess: (deletedId) => {
      successToast("Image was removed successfully");
      updateCache((current) => current.filter((img) => img.id !== deletedId));
      queryClient.invalidateQueries({ queryKey: ["listing", listingId] });
      queryClient.invalidateQueries({ queryKey: ["landlord-listings"] });
    },
    onError: () => errorToast("Failed to delete image"),
  });

  // 3. Set Cover
  const setCover = useMutation({
    mutationFn: (imageId: string) => api.setCover(imageId, accessToken),
    onSuccess: (_, imageId) => {
      successToast("Cover photo was set successfully");
      // Optimistic Update: Set target to true, others to false
      updateCache((current) =>
        current.map((img) => ({
          ...img,
          is_face_image: img.id === imageId,
        }))
      );
      queryClient.invalidateQueries({ queryKey: ["listing", listingId] });
      queryClient.invalidateQueries({ queryKey: ["landlord-listings"] });
    },
    onError: () => errorToast("Failed to set cover photo"),
  });

  // 4. Update Label
  const updateLabel = useMutation({
    mutationFn: ({ id, label }: { id: string; label: string }) =>
      api.updateLabel(id, label, accessToken),
    onSuccess: (updatedImg) => {
      successToast("Caption was updated successfully");
      // Don't toast for small edits, just update UI
      updateCache((current) =>
        current.map((img) => (img.id === updatedImg.id ? updatedImg : img))
      );
      queryClient.invalidateQueries({ queryKey: ["listing", listingId] });
      queryClient.invalidateQueries({ queryKey: ["landlord-listings"] });
    },
    onError: () => errorToast("Failed to update label"),
  });

  return {
    upload,
    remove,
    setCover,
    updateLabel,
  };
}
