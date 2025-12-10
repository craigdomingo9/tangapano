import { getInquiries } from "@/lib/api/admin/inquiries";
import { useQuery } from "@tanstack/react-query";

function useInquiriesAdmin(accessToken: string) {
  const {
    data: inquiries,
    isLoading: inquiriesIsLoading,
    error: inquiriesIsError,
  } = useQuery({
    queryKey: ["inquiries-admin"],
    queryFn: () => getInquiries(accessToken),
  });
  return {
    inquiries,
    inquiriesIsLoading,
    inquiriesIsError,
  };
}

export default useInquiriesAdmin;
