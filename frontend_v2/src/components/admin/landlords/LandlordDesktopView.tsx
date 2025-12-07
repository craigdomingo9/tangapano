import { RouterLink } from "@/routing/RouterLink";
import {
  ArrowRight,
  Award,
  Building2,
  Eye,
  ShieldAlert,
  ShieldCheck,
  User,
} from "lucide-react";
import React from "react";

interface LandlordDesktopViewProps {
  data: Landlord[];
  openVerifyModal: (state: any) => void;
}

function LandlordDesktopView({
  data,
  openVerifyModal,
}: LandlordDesktopViewProps) {
  return (
    <div className="hidden md:block bg-card/40 backdrop-blur-xl border border-border/40 rounded-2xl shadow-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-muted-foreground uppercase bg-muted/30 border-b border-border/40">
            <tr>
              <th className="px-6 py-4 font-bold tracking-wider">
                Entity & Contact
              </th>
              <th className="px-6 py-4 font-bold tracking-wider">Status</th>
              <th className="px-6 py-4 font-bold tracking-wider">
                Subscription
              </th>
              <th className="px-6 py-4 font-bold tracking-wider">Joined</th>
              <th className="px-6 py-4 font-bold tracking-wider text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40">
            {data.length > 0 ? (
              data.map((landlord) => {
                const isCompany = !!landlord.company_name;
                return (
                  <tr
                    key={landlord.id}
                    className="hover:bg-muted/30 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-linear-to-br from-muted/50 to-muted/20 flex items-center justify-center text-foreground shadow-inner border border-border/40">
                          {isCompany ? (
                            <Building2 className="w-5 h-5" />
                          ) : (
                            <User className="w-5 h-5" />
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-foreground text-sm group-hover:text-primary transition-colors">
                            {isCompany
                              ? landlord.company_name
                              : landlord.full_name}
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
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
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
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-bold border transition-colors shadow-sm ${
                          landlord.current_tier === "Standard Landlord"
                            ? "bg-amber-400/10 border-amber-400/20 text-amber-500"
                            : "bg-muted/30 border-border/40 text-muted-foreground"
                        }`}
                      >
                        {landlord.current_tier === "Standard Landlord" && (
                          <Award className="w-3 h-3" />
                        )}
                        <span>{landlord.current_tier || "N/A"}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground whitespace-nowrap text-sm font-medium">
                      {landlord.joined_at}
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      {!landlord.is_verified ? (
                        <div className="flex items-center justify-end gap-3">
                          <button
                            onClick={() => openVerifyModal(landlord.id)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-lapis hover:bg-lapis-hover cursor-pointer text-white border border-transparent transition-all duration-200 shadow-sm shadow-primary/20"
                          >
                            <ShieldCheck className="w-3.5 h-3.5" />
                            Verify
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-end">
                          <RouterLink
                            to={{
                              page: "landlords",
                              landlordId: landlord.id.toString(),
                            }}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-muted-foreground hover:text-primary hover:bg-primary/10 border border-transparent hover:border-primary/20 transition-all duration-200 group/btn"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            View Profile
                            <ArrowRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover/btn:opacity-100 group-hover/btn:translate-x-0 transition-all" />
                          </RouterLink>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-8 text-center text-muted-foreground text-sm"
                >
                  No landlords found matching your criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default LandlordDesktopView;
