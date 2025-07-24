import { useInfiniteQuery } from '@tanstack/react-query';
import { axiosInstance } from './config';


export default function useListings(params: string) {
  return useInfiniteQuery({
    queryKey: ['listings', params],
    queryFn: async ({ pageParam = 1 }) => {
      try {
        return axiosInstance.get(`/listings/listings/?${params}&is_available=true&page=${pageParam}`)
          .then(response => response.data);
      } catch (error: any) {
        throw new Error(`Failed to fetch properties: ${error.message}`);
      }
    },
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.next) {
        return allPages.length + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
  });
}
