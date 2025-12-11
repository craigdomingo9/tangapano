import {
  AlertTriangle,
  Building2,
  Calendar,
  LogIn,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  User,
} from "lucide-react";

interface HeaderProfileProps {
  landlord: Landlord;
  setIsSuspendModalOpen: (val: boolean) => void;
  handleLoginAsUser: () => void;
  isImpersonating: boolean;
}

function HeaderProfile({
  landlord,
  setIsSuspendModalOpen,
  handleLoginAsUser,
  isImpersonating,
}: HeaderProfileProps) {
  if (!landlord) return null;
  return (
    <div className="bg-card/40 backdrop-blur-xl border border-border/40 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
      <div className="flex flex-col md:flex-row gap-6 items-center md:items-start relative z-10">
        <div className="w-20 h-20 rounded-2xl bg-linear-to-br from-lapis/20 to-secondary/20 flex items-center justify-center text-lapis shadow-inner border border-border/40 shrink-0">
          {landlord.company_name ? (
            <Building2 className="w-8 h-8" />
          ) : (
            <User className="size-8" />
          )}
        </div>

        <div className="flex-1 w-full text-center md:text-left">
          <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-4">
            <div>
              <h1 className="text-xl sm:text-[1.35rem] font-bold tracking-tight text-foreground">
                {landlord.company_name ?? landlord.full_name}
              </h1>
              <div className="flex items-center justify-center md:justify-start gap-4 mt-2 text-muted-foreground">
                <span className="flex items-center gap-1.5 text-sm font-medium">
                  <User className="w-3.5 h-3.5" /> {landlord.full_name}
                </span>
                <span className="flex items-center gap-1.5 text-xsm font-medium px-2 py-0.5 bg-muted/30 rounded-full border border-border/40">
                  {landlord.is_verified ? (
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  ) : (
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                  )}
                  <span
                    className={
                      landlord.is_verified
                        ? "text-emerald-500"
                        : "text-amber-500"
                    }
                  >
                    {landlord.is_verified ? "VERIFIED" : "NOT VERIFIED"}
                  </span>
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleLoginAsUser}
                disabled={isImpersonating}
                className="px-3 py-1.5 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 rounded-lg text-sm font-bold transition-all flex items-center gap-2 disabled:opacity-70 disabled:cursor-wait cursor-pointer"
              >
                {isImpersonating ? (
                  <span className="w-3.5 h-3.5 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></span>
                ) : (
                  <LogIn className="w-3.5 h-3.5" />
                )}
                {isImpersonating ? "Switching..." : "Login as User"}
              </button>
              <button
                onClick={() => setIsSuspendModalOpen(true)}
                className="px-3 py-1.5 bg-destructive/10 hover:bg-destructive text-destructive hover:text-white border border-destructive/20 rounded-lg text-sm font-bold transition-all cursor-pointer"
              >
                Suspend
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 pt-6 border-t border-border/40">
        <div className="flex items-center justify-center md:justify-start gap-3">
          <MapPin className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-medium text-muted-foreground truncate">
            {landlord?.address}
          </span>
        </div>
        <div className="flex items-center justify-center md:justify-start gap-3">
          <Phone className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-medium text-muted-foreground">
            {landlord.phone_number}
          </span>
        </div>
        <div className="flex items-center justify-center md:justify-start gap-3">
          <Calendar className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-medium text-muted-foreground">
            Member since {landlord.joined_at}
          </span>
        </div>
      </div>
    </div>
  );
}

export default HeaderProfile;
