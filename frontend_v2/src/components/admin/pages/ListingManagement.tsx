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

const ITEMS_PER_PAGE = 6;

function ListingManagement({
  serverData: { accessToken },
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

  // Filter Logic
  const lowerQuery = searchQuery?.toLowerCase() || "";
  const filteredListings = (inventory || [])?.filter((inv) => {
    if (!inv) return false;

    return (
      inv.title.toLowerCase().includes(lowerQuery) ||
      inv.location.toLowerCase().includes(lowerQuery) ||
      inv.landlord_name.toLowerCase().includes(lowerQuery)
    );
  });

  // Pagination Logic
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
    setCurrentPage(1); // Reset to first page on search
  };

  async function handleSave() {
    if (openLockModal?.is_locked)
      await unlockListing(openLockModal.id.toString());
    if (!openLockModal?.is_locked)
      await lockListing(openLockModal!!.id.toString());
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
            openLockModal={(inv: Inventory) => setOpenLockModal(inv)}
          />
          <InventoryMobileView
            data={paginatedListings}
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
      <Modal
        isOpen={!!openLockModal}
        title={openLockModal?.is_locked ? "Unlock Property" : "Lock Property"}
        onClose={() => setOpenLockModal(null)}
        footer={
          <>
            <button
              onClick={() => setOpenLockModal(null)}
              className="px-5 py-2 text-sm rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2 rounded-lg bg-lapis dark:bg-sky-600 text-white font-bold hover:bg-lapis-hover dark:hover:bg-sky-500 transition-colors shadow-sm text-sm cursor-pointer"
            >
              {isLockingListing || isUnlockingListing
                ? openLockModal?.is_locked
                  ? "Unlocking..."
                  : "Locking..."
                : openLockModal?.is_locked
                ? "Confirm Unlock"
                : "Confirm Lock"}
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <div
            className={`p-4 rounded-xl border ${
              openLockModal?.is_locked
                ? "bg-emerald-500/10 border-emerald-500/20"
                : "bg-destructive/10 border-destructive/20"
            } flex items-start gap-3`}
          >
            <div
              className={`p-2 rounded-full ${
                openLockModal?.is_locked
                  ? "bg-emerald-500/20 text-emerald-500"
                  : "bg-destructive/20 text-destructive"
              }`}
            >
              {openLockModal?.is_locked ? (
                <Unlock className="w-5 h-5" />
              ) : (
                <AlertTriangle className="w-5 h-5" />
              )}
            </div>
            <div>
              <h4
                className={`font-bold text-sm ${
                  openLockModal?.is_locked
                    ? "text-emerald-500"
                    : "text-destructive"
                }`}
              >
                {openLockModal?.is_locked
                  ? "Restore visibility?"
                  : "Restrict visibility?"}
              </h4>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                {openLockModal?.is_locked
                  ? "This action will make the listing visible to students again. Ensure any moderation issues have been resolved."
                  : "This will hide the listing from search results immediately. The landlord will be notified."}
              </p>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default ListingManagement;
