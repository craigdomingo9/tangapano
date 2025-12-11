import {
  GraduationCap,
  Briefcase,
  Phone,
  CheckCircle2,
  Building,
  ArrowRight,
} from "lucide-react";
import Modal from "../common-components/Modal";
import { RouterLink } from "@/routing/RouterLink";
import ListingCard from "@/components/partner/dashboard/overview/ListingCard";
import useIsMobile from "@/hooks/use-is-mobile";

interface InquiryDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  inquiry: Inquiry | null;
}

function InquiryDetailsModal({
  isOpen,
  onClose,
  inquiry,
}: InquiryDetailsModalProps) {
  const { isMobile } = useIsMobile();
  // Helper function for Deposit Badge (Internal or import from utils)
  const getDepositBadge = (status: string) => {
    const styles = {
      ready_now:
        "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/30",
      within_24h:
        "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400 border-blue-200 dark:border-blue-500/30",
      need_time:
        "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400 border-amber-200 dark:border-amber-500/30",
    };

    const labels = {
      ready_now: "Ready Now",
      within_24h: "Within 24h",
      need_time: "Needs Time",
    };

    const key = status as keyof typeof styles;
    return (
      <span
        className={`px-2 py-0.5 rounded text-xs font-bold border ${
          styles[key] || "bg-slate-100 text-slate-700"
        }`}
      >
        {labels[key] || status}
      </span>
    );
  };

  // Helper function for Urgency Badge
  const getUrgencyBadge = (timeline: string) => {
    const isUrgent = timeline === "immediately" || timeline === "2_weeks";
    return (
      <span
        className={`px-2 py-0.5 rounded text-xs font-bold border ${
          isUrgent
            ? "bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-400 border-rose-200 dark:border-rose-500/30"
            : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border-slate-200 dark:border-slate-700"
        }`}
      >
        {timeline.replace(/_/g, " ")}
      </span>
    );
  };

  if (!inquiry) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Inquiry Details"
      subTitle="Review student interest and contact information."
      containerClassName="max-w-xl m-0 p-0"
    >
      <div className="space-y-6 sm:py-2">
        {/* Header Card */}
        <div className="bg-muted/20 border border-border rounded-xl p-5 flex flex-col sm:flex-row justify-center sm:justify-between items-center  sm:items-start shadow-sm">
          <div className="flex gap-3 flex-col sm:flex-row justify-center items-center">
            <div className="w-14 h-14 rounded-full bg-linear-to-br from-lapis to-lapis/80 flex items-center justify-center text-white font-bold text-xl border border-lapis/20 shadow-md">
              {inquiry.full_name.charAt(0)}
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground tracking-tight text-center sm:text-start">
                {inquiry.full_name}
              </h3>
              <div className="flex items-center gap-2 text-xsm text-muted-foreground font-medium ">
                <GraduationCap className="w-4 h-4" />
                {inquiry.program} • {inquiry.year_of_study}
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xxs text-muted-foreground uppercase font-bold tracking-wider mt-2 sm:mt-0 sm:mb-1 text-center sm:text-start">
              Inquiry Date
            </div>
            <div className="font-medium text-muted-foreground text-xsm sm:text-sm bg-background px-2 py-1 rounded border border-border">
              {new Date(inquiry.timestamp).toLocaleString()}
            </div>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Column 1: Contact */}
          <div className="space-y-1 sm:space-y-4">
            <h4 className="hidden sm:flex text-sm font-bold text-foreground items-center gap-2 border-b border-border pb-2">
              <Briefcase className="w-4 h-4 text-lapis" />
              Contact & ID
            </h4>
            <div className="space-y-1 sm:space-y-3">
              <div className="flex justify-between items-center p-3 bg-background rounded-lg border border-border shadow-sm">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Student ID
                </span>
                <span className="text-xsm sm:text-sm font-bold text-foreground">
                  {inquiry.student_id}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-background rounded-lg border border-border shadow-sm">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Phone
                </span>
                <span className="text-xsm sm:text-sm font-bold text-foreground flex items-center gap-2">
                  {inquiry.phone_number}
                </span>
              </div>
            </div>
          </div>

          {/* Column 2: Preferences */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-foreground flex items-center gap-2 border-b border-border pb-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              Preferences
            </h4>
            <div className="space-y-1.5 sm:space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xsm sm:text-sm text-muted-foreground font-medium">
                  Deposit Readiness
                </span>
                {getDepositBadge(inquiry.deposit_readiness.key)}
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xsm sm:text-sm text-muted-foreground font-medium">
                  Move-in Timeline
                </span>
                {getUrgencyBadge(inquiry.move_in_timeline.key)}
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xsm sm:text-sm text-muted-foreground font-medium">
                  Payment Method
                </span>
                <span className="text-xsm sm:text-sm font-bold text-foreground capitalize bg-muted/30 px-2 py-0.5 rounded border border-border/50">
                  {inquiry.payment_method.value}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Link: Target Property */}
        {!isMobile && (
          <div className="sm:pt-4 border-t border-border hidden sm:block">
            <h4 className="text-sm font-bold text-foreground mb-3">
              Target Property
            </h4>
            <RouterLink
              to={{ page: "listings", listingId: inquiry.listing.id }}
              className="block group"
            >
              <div className="flex items-center gap-4 p-4 rounded-xl border border-border bg-background hover:border-lapis/50 hover:shadow-md transition-all">
                <div className="p-3 bg-muted/30 rounded-lg group-hover:bg-lapis/10 group-hover:text-lapis transition-colors border border-border/50">
                  <Building className="w-6 h-6 text-muted-foreground group-hover:text-lapis" />
                </div>
                <div className="flex-1">
                  <div className="font-bold text-foreground">
                    {inquiry.listing.title}
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5 group-hover:text-lapis/80 transition-colors">
                    View listing details
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-lapis group-hover:translate-x-1 transition-all" />
              </div>
            </RouterLink>
          </div>
        )}
      </div>
    </Modal>
  );
}

export default InquiryDetailsModal;
