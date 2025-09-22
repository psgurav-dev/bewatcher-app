import MovieDetails from '@/components/home/movie-details';
import { MOVIE_DB_API_KEY, MOVIE_DB_BASE_URL } from '@/constants/config';
import { useCacheQuery } from '@/hooks/useCacheQuery';

import { useLocalSearchParams } from 'expo-router';
import React from 'react';

const MovieDetailScreen = () => {
	const { id } = useLocalSearchParams();

	async function fetchMovieDetails() {
		console.log('Fetching movie details from API...');
		const url = new URL(`${MOVIE_DB_BASE_URL}/movie/${id}`);
		url.searchParams.append('api_key', MOVIE_DB_API_KEY);
		url.searchParams.append('language', 'en-US');
		url.searchParams.append('append_to_response', 'videos,credits,recommendations');
		const response = await fetch(url);
		if (!response.ok) throw new Error('Failed to fetch movie');
		return response.json();
	}

	const {
		data: movie,
		isLoading: loading,
		error,
	} = useCacheQuery({
		queryKey: [`movie_detail${id}`],
		queryFn: fetchMovieDetails,
		staleTime: 8.64e7,
	});
	if (error) {
		console.log('error', error);
	}
	return movie ? <MovieDetails item={movie} /> : null;
};

export default MovieDetailScreen;
