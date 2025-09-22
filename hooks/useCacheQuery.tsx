import { useQuery } from '@tanstack/react-query';

export function useCacheQuery({
	queryKey,
	queryFn,
	staleTime,
	gcTime, // Updated parameter name (formerly cacheTime)
}: {
	queryKey: string[];
	queryFn: () => Promise<any>;
	staleTime?: number;
	gcTime?: number; // Updated type (formerly cacheTime)
}) {
	return useQuery({
		queryKey: [...queryKey],
		queryFn: queryFn,
		staleTime: staleTime || 1000 * 60 * 10, // cache fresh for 10 min
		gcTime: gcTime || 1000 * 60 * 30, // keep in memory 30 min (formerly cacheTime)
	});
}

// Alternative: Keep backward compatibility while supporting both
export function useCacheQueryCompatible({
	queryKey,
	queryFn,
	staleTime,
	cacheTime, // Deprecated but supported for backward compatibility
	gcTime, // New parameter name
}: {
	queryKey: string[];
	queryFn: () => Promise<any>;
	staleTime?: number;
	cacheTime?: number; // Deprecated
	gcTime?: number; // New
}) {
	return useQuery({
		queryKey: [...queryKey],
		queryFn: queryFn,
		staleTime: staleTime || 1000 * 60 * 10, // cache fresh for 10 min
		gcTime: gcTime || cacheTime || 1000 * 60 * 30, // Use gcTime first, fallback to cacheTime
	});
}
