"use client";
import { FullScreenView } from "@/components/ui/FullScreenView";
import { useRouterPush } from "@/hooks/use-router-push";
import { StudentComponentProps, StudentParams } from "@/lib/types/student";
import SupportContent from "@/components/common/SupportContent";

export default function Support({ }: StudentComponentProps) {
  const { push } = useRouterPush<StudentParams>();

  return (
    <FullScreenView title="Support" onBack={() => push({ page: "home" })}>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans flex flex-col transition-colors duration-300">
        <SupportContent />
      </div>
    </FullScreenView>
  );
}
