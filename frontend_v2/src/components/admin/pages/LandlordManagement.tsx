import { ErrorPage } from "@/components/partner/dashboard/overview/ErrorPage";
import LoadingScreen from "@/components/student/interest/states/LoadingScreen";
import useUsersAdmin from "@/hooks/admin/use-users";
import { AdminPanelComponentProps } from "@/lib/types/admin";
import { Search } from "lucide-react";
import { useState } from "react";
import LandlordDesktopView from "../landlords/LandlordDesktopView";
import { VerifyLandlordModal } from "../landlords/VerifyLandlordModal";
import Pagination from "../common-components/Pagination";
import LandlordMobileView from "../landlords/LandlordMobileView";
import { errorToast } from "@/lib/toast";

const ITEMS_PER_PAGE = 7;

function LandlordManagement({
  serverData: { accessToken },
}: AdminPanelComponentProps) {
  const {
    landlords,
    landlordsIsError,
    landlordsIsLoading,
    verifyLandlord,
    isVerifyingLandlord,
  } = useUsersAdmin(accessToken);
  // console.log(landlords);

  const [currentPage, setCurrentPage] = useState(1);
  const [openVerifyModal, setOpenVerifyModal] = useState<string | null>(null);

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [tierFilter, setTierFilter] = useState("All Tiers");

  // Filter Logic
  const filteredLandlords = (landlords || []).filter((landlord) => {
    const matchesSearch =
      landlord.company_name
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      landlord.full_name.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "All Status"
        ? true
        : statusFilter === "Verified"
        ? landlord.is_verified
        : statusFilter === "Not Verified"
        ? !landlord.is_verified
        : false;

    const matchesTier =
      tierFilter === "All Tiers" ? true : landlord.current_tier === tierFilter;

    return matchesSearch && matchesStatus && matchesTier;
  });

  // Pagination Logic
  const totalItems = filteredLandlords?.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const paginatedLandlords = filteredLandlords?.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Reset page when filters change
  const handleFilterChange = (
    setter: React.Dispatch<React.SetStateAction<any>>,
    value: any
  ) => {
    setter(value);
    setCurrentPage(1);
  };

  async function handleVerify() {
    if (!openVerifyModal)
      return errorToast("Please select a landlord to verify.");
    verifyLandlord(openVerifyModal);
    setOpenVerifyModal(null);
  }

  if (!landlords) return null;
  if (landlordsIsError) return <ErrorPage type="500" />;
  if (landlordsIsLoading) return <LoadingScreen />;

  return (
    <div className="space-y-6 animate-fade-in pb-12 relative">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-border/40 pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Landlord Directory
          </h1>
          <p className="text-muted-foreground text-sm font-medium">
            Verify identities and manage agency portfolios.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          <div className="relative group flex-1 md:flex-none w-full sm:w-auto">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-lapis transition-colors" />
            <input
              type="text"
              placeholder="Search companies..."
              value={searchQuery}
              onChange={(e) =>
                handleFilterChange(setSearchQuery, e.target.value)
              }
              className="pl-9 pr-4 h-10 bg-muted/30 border border-border/50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-lapis/50 w-full md:w-64 transition-all text-foreground placeholder:text-muted-foreground"
            />
          </div>

          <div className="flex gap-2 w-full sm:w-auto">
            <select
              value={statusFilter}
              onChange={(e) =>
                handleFilterChange(setStatusFilter, e.target.value)
              }
              className="h-10 pl-3 pr-8 bg-muted/30 border border-border/50 rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-lapis/50 cursor-pointer transition-all font-medium"
            >
              <option>All Status</option>
              <option>Verified</option>
              <option>Not Verified</option>
            </select>
            {/* <select
              value={tierFilter}
              onChange={(e) =>
                handleFilterChange(setTierFilter, e.target.value)
              }
              className="h-10 pl-3 pr-8 bg-muted/30 border border-border/50 rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-lapis/50 cursor-pointer transition-all font-medium"
            >
              <option>All Tiers</option>
              <option>Standard</option>
              <option>Free</option>
            </select> */}
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <LandlordDesktopView
          data={paginatedLandlords}
          openVerifyModal={(val) => setOpenVerifyModal(val)}
        />
        <LandlordMobileView
          data={paginatedLandlords}
          openVerifyModal={(val) => setOpenVerifyModal(val)}
        />

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          totalItems={totalItems}
          itemsPerPage={ITEMS_PER_PAGE}
        />
      </div>
      <VerifyLandlordModal
        isOpen={!!openVerifyModal}
        isVerifying={isVerifyingLandlord}
        onClose={() => setOpenVerifyModal(null)}
        onConfirm={handleVerify}
        landlordName={
          landlords.find(
            (landlord) => landlord.id.toString() == openVerifyModal?.toString()
          )?.full_name
        }
      />
    </div>
  );
}

export default LandlordManagement;
