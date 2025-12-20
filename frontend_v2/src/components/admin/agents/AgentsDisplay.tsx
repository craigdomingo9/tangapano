import { Edit, Map } from "lucide-react";

export interface AdminAgent {
  id: number;
  full_name: string;
  username: string;
  agency_name: string;
  campus_name: string;
  phone_number: string;
  address: string;
  total_listings: number;
  agent_fee: string;
  user: number;
  campus_id: string;
}

interface AgentDisplayProps {
  data: AdminAgent[];
  searchQuery: string;
  handleEditClick: (agent: AdminAgent) => void;
  hasChangeAgentPermission: boolean;
}

function AgentsDisplay({
  data,
  searchQuery,
  handleEditClick,
  hasChangeAgentPermission,
}: AgentDisplayProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {data.length > 0 ? (
        data.map((agent) => (
          <div
            key={agent.id}
            className="bg-card/40 backdrop-blur-xl border border-border/40 rounded-2xl p-5 shadow-xl hover:bg-muted/30 transition-all group relative overflow-hidden flex flex-col"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="w-12 h-12 rounded-xl bg-linear-to-br from-airforce to-lapis dark:from-lapis/20 dark:to-lapis/50 flex items-center justify-center text-white font-bold text-lg shadow-inner border border-white/10 shrink-0">
                  {agent.full_name.charAt(0)}
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-foreground text-sm truncate">
                    {agent.full_name}
                  </h3>
                  <div className="flex items-center gap-1 text-xxs text-muted-foreground font-medium mt-0.5">
                    <Map className="w-3 h-3" /> {agent.campus_name}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 py-3 border-t border-border/40 border-b mb-3">
              <div className="text-center border-r border-border/40 px-2">
                <div className="text-lg font-bold text-foreground">
                  {agent.total_listings}
                </div>
                <div className="text-[9px] text-muted-foreground uppercase tracking-wider font-bold">
                  Listings
                </div>
              </div>
              <div className="text-center px-2">
                <div className="text-sm font-bold text-lapis flex items-center justify-center gap-0.5 h-7">
                  {agent.agent_fee}
                </div>
                <div className="text-[9px] text-muted-foreground uppercase tracking-wider font-bold">
                  Fee / Deal
                </div>
              </div>
            </div>

            <button
              onClick={() => handleEditClick(agent)}
              disabled={!hasChangeAgentPermission}
              className="w-full mt-auto py-2 bg-lapis/10 hover:bg-lapis/20 hover:text-lapis rounded-lg text-xs font-bold cursor-pointer transition-all border border-border/40 hover:border-lapis/20 flex items-center justify-center gap-2 h-10 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <Edit className="w-3 h-3" /> Manage Profile
            </button>
          </div>
        ))
      ) : (
        <div className="col-span-full p-12 text-center text-muted-foreground border border-border/40 rounded-xl bg-card/40 text-sm">
          No agents found matching "{searchQuery}"
        </div>
      )}
    </div>
  );
}

export default AgentsDisplay;
