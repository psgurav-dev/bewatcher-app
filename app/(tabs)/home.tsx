import MovieCarousel from '@/components/home/carousel';
import MovieCard from '@/components/home/movie-card';
import { Movie } from '@/constants/types';
import { fetchPopularMovies, fetchTrendingMovies } from '@/store/slices/moviesSlice';

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { useEffect } from 'react';
import { ActivityIndicator, FlatList, SectionList, Text, View } from 'react-native';
import Animated, {
	Extrapolate,
	interpolate,
	useAnimatedStyle,
	useSharedValue,
} from 'react-native-reanimated';

const HEADER_MAX_PT = 8; // paddingTop when at top
const HEADER_MIN_PT = 32; // paddingTop when collapsed
const COLLAPSE_DISTANCE = 120; // how much scroll to collapse over

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
			title: 'Trending',
			data: [trendingMovies],
		},
		{
			title: 'Popular',
			data: [popularMovies],
		},
	];

	const SectionHeader = ({ title, scrollY }: { title: string; scrollY: any }) => {
		const titleAnimStyle = useAnimatedStyle(() => ({
			paddingTop: interpolate(
				scrollY.value,
				[0, COLLAPSE_DISTANCE],
				[HEADER_MAX_PT, HEADER_MIN_PT],
				Extrapolate.CLAMP,
			),
		}));

		return (
			<View className="bg-black/80 p-4">
				{/* remove static pt-8 so animated padding isn’t overridden */}
				<Animated.Text
					style={[
						{
							fontWeight: '600',
							fontFamily: 'Zalondo',
							fontSize: 32,
							color: '#fff',
						},
						titleAnimStyle,
					]}
				>
					{title}
				</Animated.Text>
			</View>
		);
	};

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
				<SectionHeader title={section.title} scrollY={scrollY} />
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
