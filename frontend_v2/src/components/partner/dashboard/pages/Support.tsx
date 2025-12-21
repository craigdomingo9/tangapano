"use client";
import OverviewFooter from "../overview/OverviewFooter";
import { FullScreenView } from "@/components/ui/FullScreenView";
import { useRouterPush } from "@/hooks/use-router-push";
import { PartnerComponentProps, PartnerParams } from "@/lib/types/partner";
import SupportContent from "@/components/common/SupportContent";

export default function Support({ }: PartnerComponentProps) {
  const { push } = useRouterPush<PartnerParams>();

  return (
    <FullScreenView title="Support" onBack={() => push({ page: "overview" })}>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans flex flex-col transition-colors duration-300">
        <SupportContent />
        {/* Footer with Link Back to Student Portal */}
        <OverviewFooter />
      </div>
    </FullScreenView>
  );
}
