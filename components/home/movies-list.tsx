import { MOVIE_DB_API_KEY, MOVIE_DB_BASE_URL } from '@/constants/config';
import { movies_data } from '@/constants/sample-data';
import { Movie } from '@/constants/types';
import { useCacheQuery } from '@/hooks/useCacheQuery';
import { useFetchTMDB } from '@/hooks/useFetch';
import { getTodayDate } from '@/lib/utils';
import React from 'react';
import { FlatList, Text, View } from 'react-native';
import MovieCard from './movie-card';

const RenderItems = ({ item }: { item: Movie }) => {
	return <MovieCard item={item} />;
};

const MoviesList = () => {
	return (
		<FlatList
			data={movies_data.map((movie) => ({
				...movie,
				backdrop_path: movie.backdrop_path === null ? undefined : movie.backdrop_path,
			}))}
			keyExtractor={(item: Movie) => item.id.toString()}
			renderItem={({ item }: { item: Movie }) => <RenderItems item={item} />}
			nestedScrollEnabled={true}
			contentContainerStyle={{ paddingBottom: 25, marginTop: 10, gap: 6 }}
			showsVerticalScrollIndicator={false}
			ListEmptyComponent={() => (
				<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 16 }}>
					<Text style={{ color: '#6B7280' }}>No movies available.</Text>
				</View>
			)}
			numColumns={3}
		/>
	);
};

export const NowPlayingMoviesList = () => {
	const url = new URL(`${MOVIE_DB_BASE_URL}/movie/now_playing`);
	url.searchParams.append('api_key', MOVIE_DB_API_KEY);
	url.searchParams.append('language', 'en-US');
	url.searchParams.append('page', '1');

	const {
		data: movies,
		isLoading: loading,
		error: movieListError,
	} = useCacheQuery({
		queryKey: [`now_playing_${getTodayDate()}`],
		queryFn: () => useFetchTMDB(url),
		staleTime: 8.64e7,
	});

	return (
		<FlatList
			data={movies?.map((movie: any) => ({
				...movie,
				backdrop_path: movie.backdrop_path === null ? undefined : movie.backdrop_path,
			}))}
			keyExtractor={(item: Movie) => item.id.toString()}
			renderItem={({ item }: { item: Movie }) => <RenderItems item={item} />}
			nestedScrollEnabled={true}
			contentContainerStyle={{ paddingBottom: 25, marginTop: 10, gap: 6 }}
			showsVerticalScrollIndicator={false}
			ListEmptyComponent={() => (
				<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 16 }}>
					<Text style={{ color: '#6B7280' }}>No movies available.</Text>
				</View>
			)}
			numColumns={3}
		/>
	);
};

export const Popular = () => {
	const url = new URL(`${MOVIE_DB_BASE_URL}/movie/popular`);
	url.searchParams.append('api_key', MOVIE_DB_API_KEY);
	url.searchParams.append('language', 'en-US');
	url.searchParams.append('page', '1');

	const {
		data: movies,
		isLoading: loading,
		error: movieListError,
	} = useCacheQuery({
		queryKey: [`popular_${getTodayDate()}`],
		queryFn: () => useFetchTMDB(url),
		staleTime: 8.64e7,
	});
	return (
		<FlatList
			data={movies?.results.map((movie: any) => ({
				...movie,
				backdrop_path: movie.backdrop_path === null ? undefined : movie.backdrop_path,
			}))}
			keyExtractor={(item: Movie) => item.id.toString()}
			renderItem={({ item }: { item: Movie }) => <RenderItems item={item} />}
			nestedScrollEnabled={true}
			contentContainerStyle={{ paddingBottom: 25, marginTop: 10, gap: 6 }}
			showsVerticalScrollIndicator={false}
			ListEmptyComponent={() => (
				<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 16 }}>
					<Text style={{ color: '#6B7280' }}>No movies available.</Text>
				</View>
			)}
			numColumns={3}
		/>
	);
};

export default MoviesList;
