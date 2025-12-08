import { ErrorPage } from "@/components/partner/dashboard/overview/ErrorPage";
import LoadingScreen from "@/components/student/interest/states/LoadingScreen";
import useInventory from "@/hooks/admin/use-inventory";
import myImageLoader from "@/lib/images/image-loader";
import { getShimmerUrl } from "@/lib/images/shimmer";
import { AdminPanelComponentProps } from "@/lib/types/admin";
import { RouterLink } from "@/routing/RouterLink";
import {
  ArrowLeft,
  Bed,
  Building,
  Eye,
  Lock,
  MapPin,
  MessageCircle,
  User,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import StatCard from "../dashboard/StatCard";
import { Inventory } from "@/lib/api/admin/inventory";
import InventoryHero from "../inventory-detail/InventoryHero";
import InventoryStats from "../inventory-detail/InventoryStats";
import Modal from "../common-components/Modal";
import useIsMobile from "@/hooks/use-is-mobile";
import ListingLockModal from "../inventory-list/ListingLockModal";

function ListingDetail({
  serverData: { accessToken },
  params: { listingId },
}: AdminPanelComponentProps) {
  const {
    invDetail,
    invDetailIsLoading,
    invDetailIsError,
    lockListing,
    unlockListing,
    isLockingListing,
    isUnlockingListing,
  } = useInventory(accessToken, listingId);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [lockModalOpen, setLockModalOpen] = useState(false);
  const { isMobile } = useIsMobile();

  const changeModalOpen = (val: boolean) => setLockModalOpen(val);
  const changePreviewOpen = (val: boolean) => setIsPreviewModalOpen(val);

  async function handleSave() {
    if (invDetail?.is_locked) await unlockListing(invDetail.id.toString());
    if (!invDetail?.is_locked) await lockListing(invDetail!!.id.toString());
    setLockModalOpen(false);
  }

  if (invDetailIsLoading) return <LoadingScreen />;
  if (invDetailIsError) return <ErrorPage type="404" />;

  return (
    <>
      <div className="space-y-6 animate-fade-in pb-12">
        <RouterLink
          to={{ page: "listings" }}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-lapis transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Inventory
        </RouterLink>
        {/* Hero Section */}
        <InventoryHero
          listing={invDetail!!}
          setIsLockModalOpen={changeModalOpen}
          setIsPreviewModalOpen={changePreviewOpen}
        />
        {/* Stats Row */}
        <InventoryStats listing={invDetail!!} />
      </div>
      <Modal
        isOpen={isPreviewModalOpen}
        onClose={() => setIsPreviewModalOpen(false)}
        title="Public Listing Preview"
        noPadding={isMobile}
        footer={<></>}
      >
        <div
          className="
    /* --- Mobile: Almost full screen (90% width/height) --- */
    w-[92vw] h-[85vh] 
    
    /* --- Desktop: Restrict width & set a phone-like height --- */
    sm:w-full sm:max-w-sm sm:h-[600px] 
    
    /* --- Shared Styling --- */
    bg-muted rounded-xl flex items-center justify-center border border-border/40 overflow-hidden shadow-2xl
  "
        >
          <iframe
            src={`/listing/${invDetail?.id}/`}
            className="w-full h-full border-0"
            title="Live Preview"
          />
        </div>
      </Modal>
      <ListingLockModal
        isLoading={isLockingListing || isUnlockingListing}
        isOpen={lockModalOpen}
        listing={invDetail!!}
        onClose={() => setLockModalOpen(false)}
        onSave={handleSave}
      />
    </>
  );
}

export default ListingDetail;
