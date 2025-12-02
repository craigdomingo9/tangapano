"use client";
import { useListingDetail } from "@/hooks/use-reference-data";
import { useRouterPush } from "@/hooks/use-router-push";
import { ErrorPage } from "../overview/ErrorPage";
import LoadingScreen from "@/components/student/interest/states/LoadingScreen";
import { FullScreenView } from "@/components/ui/FullScreenView";
import ImageHeaderStats from "../images/ImageHeaderStats";
import ImageUploadSection from "../images/ImageUploadSection";
import ImageGrid from "../images/ImageGrid";
import { useImageActions } from "@/hooks/use-image-actions";
import { useState } from "react";
import { ListingDeletionModal } from "../overview/ListingDeletionModal";
import { PartnerComponentProps } from "@/lib/types/partner";
import { ImageDeletionModal } from "../images/ImageDeletionModal";

function ImageManagement({ params, serverData }: PartnerComponentProps) {
  const { push } = useRouterPush();
  const { listingId } = params;
  const { accessToken } = serverData;

  // 1. Data Fetching
  const { data: listing, isLoading } = useListingDetail(listingId!);

  // 2. Actions (Mutations)
  const actions = useImageActions(listingId!, accessToken);

  // 3. Local UI State
  const [imageToDelete, setImageToDelete] = useState<string | null>(null);

  // Guards
  if (!accessToken) return <ErrorPage type="access" />;
  if (!listingId) return null;
  if (isLoading) return <LoadingScreen />;
  if (!listing) return <ErrorPage type="404" />;

  return (
    <FullScreenView
      title={`Manage Photos - ${listing.title}`}
      onBack={() => push({ page: "overview" })}
    >
      <div className="space-y-8 animate-in fade-in duration-300 max-w-7xl mx-auto py-4 px-2">
        {/* Stats Header */}
        <ImageHeaderStats images={listing.images} />

        {/* Upload Area */}
        <ImageUploadSection
          onUpload={(files) => actions.upload.mutate(files)}
          isUploading={actions.upload.isPending}
        />

        {/* Gallery Grid */}
        <ImageGrid
          images={listing.images}
          onDelete={(id) => {
            setImageToDelete(id);
          }}
          onSelectFace={(id) => actions.setCover.mutate(id)}
          onLabelChange={(id, label) =>
            actions.updateLabel.mutate({ id, label })
          }
        />
      </div>

      {/* Scalable Modal Pattern */}
      <ImageDeletionModal
        isOpen={!!imageToDelete}
        onClose={() => setImageToDelete(null)}
        onConfirm={() => {
          if (imageToDelete) {
            actions.remove.mutate(imageToDelete);
            setImageToDelete(null);
          }
        }}
        isDeleting={actions.remove.isPending}
        itemName="Image"
      />
    </FullScreenView>
  );
}

export default ImageManagement;
