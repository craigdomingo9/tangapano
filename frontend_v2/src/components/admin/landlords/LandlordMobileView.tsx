import { RouterLink } from "@/routing/RouterLink";
import {
  Award,
  Building2,
  Eye,
  ShieldAlert,
  ShieldCheck,
  User,
} from "lucide-react";
import React from "react";

interface LandlordMobileViewProps {
  data: Landlord[];
  openVerifyModal: (val: any) => void;
}

function LandlordMobileView({
  data,
  openVerifyModal,
}: LandlordMobileViewProps) {
  return (
    <div className="md:hidden flex flex-col gap-4">
      {data.length > 0 ? (
        data.map((landlord) => {
          const isCompany = !!landlord.company_name;
          return (
            <div
              key={landlord.id}
              className="p-5 bg-card/40 backdrop-blur-md border border-border/40 rounded-2xl shadow-lg relative overflow-hidden"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center text-foreground shadow-inner border border-border/40 shrink-0 ${
                      isCompany
                        ? "bg-linear-to-br from-muted/50 to-muted/20"
                        : "bg-linear-to-br from-primary/20 to-primary/5 text-primary"
                    }`}
                  >
                    {isCompany ? (
                      <Building2 className="w-6 h-6" />
                    ) : (
                      <User className="w-6 h-6" />
                    )}
                  </div>
                  <div>
                    <div className="font-bold text-foreground text-sm">
                      {isCompany ? landlord.company_name : landlord.full_name}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5 font-medium">
                      {isCompany ? (
                        <>
                          <User className="w-3 h-3" />
                          {landlord.full_name}
                        </>
                      ) : (
                        <span className="italic opacity-80">
                          Individual Landlord
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                {landlord.is_verified ? (
                  <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xxs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-500 border border-emerald-500/20 shadow-sm uppercase tracking-wider">
                    <ShieldCheck className="w-3.5 h-3.5 mr-1.5" />
                    VERIFIED
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xxs font-bold bg-amber-500/10 text-amber-600 dark:text-amber-500 border border-amber-500/20 shadow-sm uppercase tracking-wider">
                    <ShieldAlert className="w-3.5 h-3.5 mr-1.5" />
                    Not Verified
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4 pt-4 border-t border-border/20">
                <div>
                  <div className="text-xxs text-muted-foreground uppercase font-bold tracking-wider mb-1">
                    Tier
                  </div>
                  <div
                    className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xxs font-bold border transition-colors shadow-sm ${
                      landlord.current_tier === "Standard Landlord"
                        ? "bg-amber-400/10 border-amber-400/20 text-amber-500"
                        : "bg-muted/30 border-border/40 text-muted-foreground"
                    }`}
                  >
                    {landlord.current_tier === "Standard Landlord" && (
                      <Award className="w-3 h-3" />
                    )}
                    <span>{landlord.current_tier}</span>
                  </div>
                </div>
                <div>
                  <div className="text-xxs text-muted-foreground uppercase font-bold tracking-wider mb-1">
                    Joined
                  </div>
                  <div className="text-sm font-medium text-muted-foreground">
                    {landlord.joined_at}
                  </div>
                </div>
              </div>

              <div>
                {!landlord.is_verified ? (
                  <button
                    onClick={() => openVerifyModal(landlord.id)}
                    className="w-full flex items-center justify-center gap-1.5 px-3 py-3 rounded-xl text-sm font-bold cursor-pointer bg-lapis hover:bg-lapis-hover text-white border border-transparent transition-all duration-200 shadow-sm shadow-primary/20"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    Verify Landlord
                  </button>
                ) : (
                  <RouterLink
                    to={{
                      page: "landlords",
                      landlordId: landlord.id.toString(),
                    }}
                    className="w-full flex items-center justify-center gap-1.5 px-3 py-3 rounded-xl text-sm font-semibold text-muted-foreground bg-muted/20 border border-border/40 hover:text-primary hover:border-primary/20 transition-all duration-200"
                  >
                    <Eye className="w-4 h-4" />
                    View Full Profile
                  </RouterLink>
                )}
              </div>
            </div>
          );
        })
      ) : (
        <div className="p-8 text-center text-muted-foreground bg-card/40 border border-border/40 rounded-xl">
          No landlords found.
        </div>
      )}
    </div>
  );
}

export default LandlordMobileView;
