import { ErrorPage } from "@/components/partner/dashboard/overview/ErrorPage";
import LoadingScreen from "@/components/student/interest/states/LoadingScreen";
import useInquiriesAdmin from "@/hooks/admin/use-inquiries";
import { AdminPanelComponentProps } from "@/lib/types/admin";
import { Search } from "lucide-react";
import { useState } from "react";
import KPICards from "../inquiries/KPICards";
import InquiryTable from "../inquiries/InquiryTable";
import Pagination from "../common-components/Pagination";
import InquiryDetailsModal from "../inquiries/InquiryDetailsModal";
import { generateInquiryReceipt } from "@/lib/api/admin/inquiries";
import { errorToast } from "@/lib/toast";

const ITEMS_PER_PAGE = 8;

function Inquiries({ serverData: { accessToken } }: AdminPanelComponentProps) {
  const { inquiries, inquiriesIsLoading, inquiriesIsError } =
    useInquiriesAdmin(accessToken);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDetailModalOpen, setIsDetailModalOpen] = useState<Inquiry | null>(
    null
  );

  // Filter Logic
  const filteredInquiries = inquiries
    ?.filter((inq) => {
      const matchesSearch =
        inq.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inq.student_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inq.listing?.title?.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesSearch;
    })
    .sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

  function generateReceipt(inquiry: Inquiry) {
    // Placeholder function for generating receipt
    // console.log(`Generating receipt for inquiry ID: ${inquiry.id}`);

    generateInquiryReceipt(accessToken, inquiry.id)
      .then((blobData) => {
        // Create a Blob from the response data
        // Note: Since we used responseType: 'blob', 'blobData' is already a Blob object.
        const blob = new Blob([blobData], { type: "application/pdf" });

        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        // Clean filename using the student ID
        a.download = `Receipt_${inquiry.student_id}.pdf`;
        document.body.appendChild(a);
        a.click();

        // Cleanup
        a.remove();
        window.URL.revokeObjectURL(url);
      })
      .catch((error) => {
        errorToast("Failed to download receipt. Please try again.");
        console.error("Failed to download receipt:", error);
      });
  }

  // Pagination Logic
  const totalItems = filteredInquiries?.length || 0;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const paginatedData = filteredInquiries?.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  if (inquiriesIsLoading) return <LoadingScreen />;
  if (inquiriesIsError) return <ErrorPage type="500" />;

  console.log(inquiries);

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-border/40 pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Inquiry Tracker
          </h1>
          <p className="text-muted-foreground text-sm font-medium">
            Manage incoming student leads and viewing requests.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          <div className="relative group flex-1 md:flex-none w-full sm:w-auto">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <input
              type="text"
              placeholder="Search student or listing..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-9 pr-4 h-10 bg-muted/30 border border-border/50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 w-full md:w-64 transition-all text-foreground placeholder:text-muted-foreground"
            />
          </div>
        </div>
      </div>
      <KPICards inquiries={inquiries!!} />
      <InquiryTable
        inquiries={paginatedData!!}
        openDetailModal={setIsDetailModalOpen}
        generateReceipt={generateReceipt}
      />
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        totalItems={totalItems}
        itemsPerPage={ITEMS_PER_PAGE}
      />
      <InquiryDetailsModal
        inquiry={isDetailModalOpen}
        isOpen={!!isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(null)}
      />
    </div>
  );
}

export default Inquiries;
