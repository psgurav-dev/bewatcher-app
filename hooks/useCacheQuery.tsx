import { useQuery } from "@tanstack/react-query";


export function useCacheQuery({ queryKey, queryFn, staleTime, cacheTime }: { queryKey: string[], queryFn: () => Promise<any>, staleTime?: number, cacheTime?: number }) {
  return useQuery({
    queryKey: [...queryKey],
    queryFn: queryFn,
    staleTime: staleTime || 1000 * 60 * 10, // cache fresh for 10 min
    // cacheTime: cacheTime || 1000 * 60 * 30, // keep in memory 30 min
  });
}
