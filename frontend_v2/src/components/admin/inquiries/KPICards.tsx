import { DollarSign, MessageSquare } from "lucide-react";

interface KPICardsProps {
  inquiries: Inquiry[];
}

function KPICards({ inquiries }: KPICardsProps) {
  if (!inquiries) return null;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="p-4 bg-card border border-border rounded-xl shadow-sm">
        <div className="text-xs font-bold uppercase tracking-wider mb-1">
          Total Inquiries
        </div>
        <div className="text-2xl font-bold text-foreground">
          {inquiries.length}
        </div>
      </div>
      <div className="p-4 bg-card border border-border rounded-xl shadow-sm">
        <div className="text-xs font-bold uppercase tracking-wider mb-1 text-emerald-600">
          Ready Now
        </div>
        <div className="text-2xl font-bold text-emerald-600">
          {
            inquiries.filter((i) => i.deposit_readiness.key === "ready_now")
              .length
          }
        </div>
      </div>
      <div className="p-4 bg-card border border-border rounded-xl shadow-sm">
        <div className="text-xs font-bold uppercase tracking-wider mb-1 text-destructive">
          Urgent Move-In
        </div>
        <div className="text-2xl font-bold text-destructive">
          {
            inquiries.filter((i) => i.move_in_timeline.key === "immediately")
              .length
          }
        </div>
      </div>
      <div className="p-4 bg-card border border-border rounded-xl shadow-sm">
        <div className="text-xs font-bold uppercase tracking-wider mb-1 text-amber-600">
          Unassigned
        </div>
        <div className="text-2xl font-bold text-amber-600">
          {inquiries.filter((i) => !i.contacted_agent.id).length}
        </div>
      </div>
    </div>
  );
}

export default KPICards;
