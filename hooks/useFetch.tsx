import { useCallback, useEffect, useState } from 'react';

type UseFetchOptions = RequestInit & {
	skip?: boolean;
};

export function useFetch<T = any>(url: string | URL, options?: UseFetchOptions) {
	const [data, setData] = useState<T | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<Error | null>(null);

	const fetchData = useCallback(async () => {
		if (!url) return;
		setLoading(true);
		setError(null);
		try {
			const response = await fetch(url, options);
			if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
			const json = await response.json();
			setData(json);
		} catch (err: any) {
			setError(err);
			setData(null);
		} finally {
			setLoading(false);
		}
	}, [url, JSON.stringify(options)]);

	useEffect(() => {
		if (!options?.skip) {
			fetchData();
		}
	}, [fetchData, options?.skip]);

	const refetch = useCallback(() => {
		fetchData();
	}, [fetchData]);

	return { data, loading, error, refetch };
}

export async function useFetchTMDB(url: URL) {
	// console.log('Fetching movie details from API...');
	const res = await fetch(url);
	if (!res.ok) throw new Error('Failed to fetch movies');
	return res.json();
}
