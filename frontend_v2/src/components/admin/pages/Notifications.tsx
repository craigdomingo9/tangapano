import { AdminPanelComponentProps } from "@/lib/types/admin";
import React, { useState } from "react";
import useNotificationsAdmin from "@/hooks/admin/use-notifications";
import LoadingScreen from "@/components/student/interest/states/LoadingScreen";
import { ErrorPage } from "@/components/partner/dashboard/overview/ErrorPage";
import { Check, MoreVertical, Search } from "lucide-react";

function Notifications({
  serverData: { accessToken },
}: AdminPanelComponentProps) {
  const { notifications, notificationsLoading, notificationsError } =
    useNotificationsAdmin(accessToken);

  const [searchQuery, setSearchQuery] = useState("");

  const filteredNotifications = notifications?.filter((notif) => {
    const matchesSearch =
      notif.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notif.message.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesSearch;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "2-digit",
      month: "short",
      day: "numeric",
    });
  };

  const getNotificationTypeStyles = (type: string) => {
    const normalizedType = type.toLowerCase();

    switch (normalizedType) {
      case "error":
      case "critical":
        return "bg-red-500/10 border-red-500/30 text-red-400";
      case "warning":
      case "alert":
        return "bg-amber-500/10 border-amber-500/30 text-amber-400";
      case "success":
      case "completed":
        return "bg-emerald-500/10 border-emerald-500/30 text-emerald-400";
      case "info":
      case "information":
        return "bg-blue-500/10 border-blue-500/30 text-blue-400";
      case "system":
        return "bg-purple-500/10 border-purple-500/30 text-purple-400";
      default:
        return "bg-white/5 border-white/10 text-muted-foreground";
    }
  };

  if (notificationsLoading) return <LoadingScreen />;
  if (notificationsError) return <ErrorPage type="500" />;

  return (
    <div className="space-y-6 animate-fade-in pb-12 max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/5 pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Notification Center
          </h1>
          <p className="text-muted-foreground text-sm font-medium">
            System alerts and activity logs.
          </p>
        </div>
      </div>

      <div className="bg-card/40 backdrop-blur-xl border border-white/5 rounded-2xl shadow-xl overflow-hidden">
        <div className="p-4 bg-white/5 border-b border-white/5 flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search alerts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-black/20 border border-white/10 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-lapis/50 text-foreground placeholder:text-muted-foreground"
            />
          </div>
        </div>

        <div className="divide-y divide-white/5">
          {filteredNotifications && filteredNotifications?.length > 0 ? (
            filteredNotifications?.map((notif) => (
              <div
                key={notif.id}
                className={`p-5 flex gap-4 hover:bg-white/5 transition-colors group ${
                  !notif.is_read ? "bg-lapis/5" : ""
                }`}
              >
                <div
                  className={`mt-1 w-2 h-2 rounded-full shrink-0 ${
                    !notif.is_read ? "bg-lapis shadow-glow" : "bg-transparent"
                  }`}
                ></div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h4
                      className={`text-sm font-bold ${
                        !notif.is_read
                          ? "text-foreground"
                          : "text-muted-foreground"
                      }`}
                    >
                      {notif.title}
                      <span
                        className={`ml-2 text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded border ${getNotificationTypeStyles(
                          notif.notification_type
                        )}`}
                      >
                        {notif.notification_type}
                      </span>
                    </h4>
                    <span className="text-xs text-muted-foreground font-medium">
                      {formatDate(notif.created_at)}
                    </span>
                  </div>
                  <p className="text-xsm sm:text-sm text-muted-foreground mt-1 leading-relaxed ">
                    {notif.message}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-muted-foreground text-sm">
              No notifications found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Notifications;
