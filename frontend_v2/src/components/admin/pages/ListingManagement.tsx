import { ErrorPage } from "@/components/partner/dashboard/overview/ErrorPage";
import LoadingScreen from "@/components/student/interest/states/LoadingScreen";
import useInventory from "@/hooks/admin/use-inventory";
import { AdminPanelComponentProps } from "@/lib/types/admin";
import { AlertTriangle, Search, Unlock } from "lucide-react";
import { useState } from "react";
import InventoryDesktopView from "../inventory-list/InventoryDesktopView";
import InventoryMobileView from "../inventory-list/InventoryMobileView";
import Modal from "../common-components/Modal";
import { Inventory } from "@/lib/api/admin/inventory";
import Pagination from "../common-components/Pagination";
import ListingLockModal from "../inventory-list/ListingLockModal";

const ITEMS_PER_PAGE = 6;

function ListingManagement({
  serverData: { accessToken, user },
}: AdminPanelComponentProps) {
  const [openLockModal, setOpenLockModal] = useState<Inventory | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const {
    inventory,
    inventoryIsError,
    inventoryIsLoading,
    lockListing,
    unlockListing,
    isLockingListing,
    isUnlockingListing,
  } = useInventory(accessToken);

  const lowerQuery = searchQuery?.toLowerCase() || "";
  const filteredListings = (inventory || [])?.filter((inv) => {
    if (!inv) return false;

    return (
      inv.title.toLowerCase().includes(lowerQuery) ||
      inv.location.toLowerCase().includes(lowerQuery) ||
      inv.landlord_name.toLowerCase().includes(lowerQuery)
    );
  });

  const totalItems = filteredListings.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const paginatedListings = filteredListings.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  async function handleSave() {
    if (openLockModal?.is_locked)
      await unlockListing(openLockModal.id.toString());
    if (!openLockModal?.is_locked)
      await lockListing(openLockModal!.id.toString());
    setOpenLockModal(null);
  }

  if (inventoryIsLoading) return <LoadingScreen />;
  if (inventoryIsError) return <ErrorPage type="500" />;

  return (
    <>
      <div className="space-y-6 animate-fade-in pb-12 relative">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-border/40 pb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Property Inventory
            </h1>
            <p className="text-muted-foreground text-sm font-medium">
              Manage and moderate platform listings.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            <div className="relative group flex-1 md:flex-none w-full sm:w-auto">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-lapis transition-colors" />
              <input
                type="text"
                placeholder="Search properties..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-9 pr-4 h-10 bg-muted/30 border border-border/50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-lapis/50 w-full md:w-64 transition-all text-foreground placeholder:text-muted-foreground"
              />
            </div>
          </div>
        </div>
        <div className="flex flex-col">
          <InventoryDesktopView
            data={paginatedListings}
            user={user}
            openLockModal={(inv: Inventory) => setOpenLockModal(inv)}
          />
          <InventoryMobileView
            data={paginatedListings}
            user={user}
            openLockModal={(inv: Inventory) => setOpenLockModal(inv)}
          />
        </div>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          totalItems={totalItems}
          itemsPerPage={ITEMS_PER_PAGE}
        />
      </div>
      <ListingLockModal
        isLoading={isLockingListing || isUnlockingListing}
        isOpen={!!openLockModal}
        listing={openLockModal!}
        onClose={() => setOpenLockModal(null)}
        onSave={handleSave}
      />
    </>
  );
}

export default ListingManagement;
