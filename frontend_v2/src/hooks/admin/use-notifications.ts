import { fetchNotifications } from "@/lib/api/admin/notifications";
import { useQuery } from "@tanstack/react-query";

function useNotificationsAdmin(accessToken: string) {
  const {
    data: notifications,
    isLoading: notificationsLoading,
    isError: notificationsError,
  } = useQuery({
    queryKey: ["notifications-admin"],
    queryFn: () => fetchNotifications(accessToken),
    retry: 2,
    staleTime: 5 * 60 * 1000,
  });
  return { notifications, notificationsLoading, notificationsError };
}

export default useNotificationsAdmin;
