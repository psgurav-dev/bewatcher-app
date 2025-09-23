import { MOVIE_DB_API_KEY, MOVIE_DB_BASE_URL } from '@/constants/config';
import { movies_data } from '@/constants/sample-data';
import { Movie } from '@/constants/types';
import { useCacheQuery } from '@/hooks/useCacheQuery';
import { useFetchTMDB } from '@/hooks/useFetch';
import { getTodayDate } from '@/lib/utils';
import React from 'react';
import { FlatList, Text, View } from 'react-native';
import Animated, { SharedValue } from 'react-native-reanimated';
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
		gcTime: 1000 * 60 * 30, // 30 minutes
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

export const Popular = ({
	scrollY,
	carouselHeight,
}: {
	scrollY: SharedValue<number>;
	carouselHeight: any;
}) => {
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
			ListHeaderComponent={
				<Animated.View
					style={{
						position: 'absolute',
						top: 0,
						left: 0,
						right: 0,
						backgroundColor: 'black',
						transform: [
							{
								translateY: scrollY.value > carouselHeight ? 0 : -100, // show only after scrolling past carousel
							},
						],
					}}
				>
					<Text
						style={{
							fontWeight: '600',
							fontFamily: 'Zalondo',
							fontSize: 32,
							color: '#fff',
							padding: 8,
						}}
					>
						Popular
					</Text>
				</Animated.View>
			}
			stickyHeaderIndices={[0]} // <-- use 0 for ListHeaderComponent
		/>
	);
};

export default MoviesList;
