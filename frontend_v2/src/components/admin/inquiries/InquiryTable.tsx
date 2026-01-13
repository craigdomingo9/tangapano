import { Button } from "@/components/ui/button";
import { RouterLink } from "@/routing/RouterLink";
import { CheckCircle2, Clock, DollarSign, Hash, User } from "lucide-react";
import React from "react";

interface InquiryTableProps {
  inquiries: Inquiry[];
  openDetailModal: (inquiry: Inquiry) => void;
  generateReceipt: (inquiry: Inquiry) => void;
  hasGenerateReceiptPermission: boolean;
}

function InquiryTable({
  inquiries,
  openDetailModal,
  generateReceipt,
  hasGenerateReceiptPermission,
}: InquiryTableProps) {
  const getUrgencyBadge = (timeline: string) => {
    switch (timeline) {
      case "immediately":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-destructive/10 text-destructive border border-destructive/20">
            <Clock className="w-3 h-3 mr-1" /> Immediate
          </span>
        );
      case "2_weeks":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-500 border border-amber-500/20">
            2 Weeks
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-muted/50 text-muted-foreground border border-border/40">
            {timeline.replace("_", " ")}
          </span>
        );
    }
  };

  const getDepositBadge = (readiness: string) => {
    switch (readiness) {
      case "ready_now":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
            <DollarSign className="w-3 h-3 mr-1" /> Ready
          </span>
        );
      case "within_24h":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-500 border border-amber-500/20">
            24 Hours
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-muted/50 text-muted-foreground border border-border/40">
            Need Time
          </span>
        );
    }
  };
  return (
    <>
      <h4 className="text-sm text-muted-foreground mb-4">
        Click on an Inquiry to view more details
      </h4>
      <div className="bg-card/40 backdrop-blur-xl border border-border/40 rounded-2xl shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-muted/30 border-b border-border/40">
              <tr>
                <th className="px-6 py-4 font-bold tracking-wider">
                  Student Profile
                </th>
                <th className="px-6 py-4 font-bold tracking-wider">
                  Target Property
                </th>
                <th className="px-6 py-4 font-bold tracking-wider">
                  Urgency & Readiness
                </th>
                <th className="px-6 py-4 font-bold tracking-wider">
                  Payment Method
                </th>
                <th className="px-6 py-4 font-bold tracking-wider text-right">
                  Receipt
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {inquiries.length > 0 ? (
                inquiries.map((inquiry) => (
                  <tr
                    key={inquiry.id}
                    onClick={() => openDetailModal(inquiry)}
                    className="hover:bg-muted/30 transition-colors cursor-pointer group *:truncate"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-linear-to-br from-airforce to-lapis flex items-center justify-center text-white border border-white/10 shrink-0">
                          <User className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-bold text-foreground text-xsm sm:text-sm group-hover:text-lapis transition-colors">
                            {inquiry.full_name}
                          </div>
                          <div className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                            <Hash className="w-3 h-3" /> {inquiry.student_id}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <RouterLink
                        to={{ page: "listings", listingId: inquiry.listing.id }}
                        className="font-medium  text-xsm sm:text-sm text-foreground hover:text-lapis hover:underline decoration-lapis/50 underline-offset-4 decoration-1"
                      >
                        {inquiry.listing.title}
                      </RouterLink>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        {new Date(inquiry.timestamp).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1.5 items-start">
                        {getUrgencyBadge(inquiry.move_in_timeline.key)}
                        {getDepositBadge(inquiry.deposit_readiness.key)}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground font-medium capitalize">
                      {inquiry.payment_method.value}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          className="bg-lapis hover:bg-lapis/70 text-white hover:text-white/70 z-100"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (!hasGenerateReceiptPermission) {
                              alert(
                                "You do not have permission to generate receipts."
                              );
                              return;
                            }
                            generateReceipt(inquiry);
                          }}
                        >
                          Get Receipt
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-12 text-center text-muted-foreground"
                  >
                    No inquiries found matching your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default InquiryTable;
