import MovieCarousel from '@/components/home/carousel';
import MovieCard from '@/components/home/movie-card';
import { Movie } from '@/constants/types';
import { fetchPopularMovies, fetchTrendingMovies } from '@/store/slices/moviesSlice';

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { useEffect } from 'react';
import { ActivityIndicator, FlatList, SectionList, Text, View } from 'react-native';
import { useSharedValue } from 'react-native-reanimated';

export default function HomeScreen() {
	const dispatch = useAppDispatch();
	const scrollY = useSharedValue(0);

	const {
		popularMovies,
		popularLoading,
		popularError,
		trendingMovies,
		trendingLoading,
		trendingError,
	} = useAppSelector((state) => state.movies);

	useEffect(() => {
		// Fetch data on component mount
		dispatch(fetchPopularMovies(1));
		dispatch(fetchTrendingMovies());
	}, [dispatch]);

	const sectionsForGrid = [
		{
			title: 'Popular',
			data: [popularMovies],
		},
		{
			title: 'Trending',
			data: [trendingMovies],
		},
	];

	const renderSectionListItems = ({ item }: { item: Movie[] }) => {
		return (
			<FlatList
				data={item.map((movie: any) => ({
					...movie,
					backdrop_path: movie.backdrop_path === null ? undefined : movie.backdrop_path,
				}))}
				keyExtractor={(movie: Movie) => movie.id.toString()}
				renderItem={({ item: movie }: { item: Movie }) => <MovieCard item={movie} />}
				contentContainerStyle={{ paddingBottom: 25, marginTop: 10, gap: 6 }}
				showsVerticalScrollIndicator={false}
				scrollEnabled={false}
				ListEmptyComponent={() => (
					<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 16 }}>
						<Text style={{ color: '#6B7280' }}>No movies available.</Text>
					</View>
				)}
				numColumns={3}
			/>
		);
	};

	const ListHeaderComponent = () => (
		<MovieCarousel carousel_movie_data={popularMovies.slice(0, 5)} scrollY={scrollY} />
	);

	if (popularLoading && popularMovies.length === 0) {
		return (
			<View
				style={{
					flex: 1,
					justifyContent: 'center',
					alignItems: 'center',
					backgroundColor: 'black',
				}}
			>
				<ActivityIndicator size="large" color="#ffffff" />
			</View>
		);
	}

	return (
		<SectionList
			sections={sectionsForGrid}
			keyExtractor={(item, index) => `section-${index}`}
			stickySectionHeadersEnabled
			renderItem={renderSectionListItems}
			renderSectionHeader={({ section }) => (
				<View className="bg-black/80 p-4">
					<Text
						className="pt-8"
						style={{
							fontWeight: '600',
							fontFamily: 'Zalondo',
							fontSize: 32,
							color: '#fff',
						}}
					>
						{section.title}
					</Text>
				</View>
			)}
			ListHeaderComponent={ListHeaderComponent}
			contentContainerStyle={{ paddingBottom: 25, backgroundColor: 'black' }}
			style={{ backgroundColor: 'black' }}
			onScroll={(e) => {
				scrollY.value = e.nativeEvent.contentOffset.y;
			}}
			scrollEventThrottle={16}
			showsVerticalScrollIndicator={false}
		/>
	);
}
