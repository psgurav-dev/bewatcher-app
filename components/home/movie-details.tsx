import { Genres } from '@/constants/data';
import { Movie, moviePayload } from '@/constants/types';
import { useAppSelector } from '@/store/hooks';
import { useAuth } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import { Alert } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import React, { useEffect } from 'react';
import {
	Dimensions,
	Image,
	Pressable,
	ScrollView,
	Text,
	View,
} from 'react-native';
import Animated, {
	FadeIn,
	FadeOut,
	useAnimatedScrollHandler,
	useAnimatedStyle,
	useSharedValue,
	interpolate,
	Extrapolate,
	withDecay,
} from 'react-native-reanimated';
import MovieVideos from './movie-videos';

import CollectionButtons from '@/components/movies/collection-btns';

const { width } = Dimensions.get('window');
const BACKDROP_HEIGHT = 400;

// Loading Skeleton Components
const SkeletonBox = ({
	width,
	height,
	className = '',
}: {
	width: number | string;
	height: number;
	className?: string;
}) => <View className={`bg-gray-700 rounded-lg ${className} w-[${width}] h-[${height}]`} />;

const SkeletonText = ({
	width,
	height = 16,
	className = '',
}: {
	width: number | string;
	height?: number;
	className?: string;
}) => <View className={`bg-gray-700 rounded-lg ${className} w-[${width}] h-[${height}]`} />;

const SkeletonCircle = ({ size, className = '' }: { size: number; className?: string }) => (
	<View className={`bg-gray-700 rounded-full ${className}`} style={{ width: size, height: size }} />
);

const LoadingSkeleton = () => {
	return (
		<ScrollView className="flex-1 bg-black">
			{/* Backdrop Skeleton */}
			<View className="relative">
				<SkeletonBox width="100%" height={400} className="rounded-none" />
				<View className="absolute inset-0 bg-black/60" />
			</View>

			{/* Content Skeleton */}
			<View className="px-4 -mt-20">
				{/* Title Skeleton */}
				<SkeletonText width="80%" height={40} className="mb-2" />

				{/* Meta Info Skeleton */}
				<SkeletonText width="60%" height={20} className="mb-4" />

				{/* Genres Skeleton */}
				<View className="flex-row gap-2 mt-4 mb-4">
					<SkeletonBox width={80} height={30} />
					<SkeletonBox width={70} height={30} />
					<SkeletonBox width={90} height={30} />
				</View>

				{/* Overview Skeleton */}
				<View className="mt-4">
					<SkeletonText width={100} height={24} className="mb-2" />
					<SkeletonText width="100%" height={16} className="mb-1" />
					<SkeletonText width="100%" height={16} className="mb-1" />
					<SkeletonText width="100%" height={16} className="mb-1" />
					<SkeletonText width="80%" height={16} />
				</View>

				{/* Cast Skeleton */}
				<View className="mt-6">
					<SkeletonText width={60} height={24} className="mb-2" />
					<ScrollView horizontal showsHorizontalScrollIndicator={false}>
						{Array.from({ length: 5 }).map((_, index) => (
							<View key={index} className="items-center mr-4">
								<SkeletonCircle size={64} className="mb-2" />
								<SkeletonText width={60} height={12} className="mb-1" />
								<SkeletonText width={50} height={10} />
							</View>
						))}
					</ScrollView>
				</View>

				{/* Videos Skeleton */}
				<View className="mt-6">
					<SkeletonText width={150} height={24} className="mb-3" />
					<ScrollView horizontal showsHorizontalScrollIndicator={false}>
						{Array.from({ length: 3 }).map((_, index) => (
							<View key={index} className="mr-4" style={{ width: 280 }}>
								<SkeletonBox width={280} height={160} className="mb-2" />
								<SkeletonText width="80%" height={16} className="mb-1" />
								<SkeletonText width="60%" height={12} />
							</View>
						))}
					</ScrollView>
				</View>

				{/* Watch Button Skeleton */}
				<SkeletonBox width="100%" height={56} className="mt-6 mb-8" />
			</View>
		</ScrollView>
	);
};

const ErrorState = ({ error, onRetry }: { error?: any; onRetry?: () => void }) => {
	return (
		<View className="flex-1 bg-black justify-center items-center px-4">
			<FontAwesome name="exclamation-triangle" size={48} color="#EF4444" />
			<Text className="text-white text-xl font-semibold mt-4 text-center">
				Failed to Load Movie
			</Text>
			<Text className="text-gray-400 text-center mt-2 mb-6">
				{error?.message || 'Something went wrong while loading the movie details.'}
			</Text>
			{onRetry && (
				<Pressable onPress={onRetry} className="bg-primary-accent px-6 py-3 rounded-lg">
					<Text className="text-white font-semibold">Try Again</Text>
				</Pressable>
			)}
		</View>
	);
};

interface MovieDetailsProps {
	item?: Movie;
	loading?: boolean;
	error?: any;
	onRetry?: () => void;
}

const MovieDetails = ({ item, loading = false, error, onRetry }: MovieDetailsProps) => {
	// dispatch is not used here; collection actions handled by CollectionButtons
	const router = useRouter();
	const { userId } = useAuth();
	const [genres, setGenres] = React.useState<string[]>([]);

	const { favourites, watchlist } = useAppSelector((state) => state.movies);

	const scrollY = useSharedValue(0);

	const scrollHandler = useAnimatedScrollHandler({
		onScroll: (event) => {
			scrollY.value = event.contentOffset.y;
		},
	});
	// Animated style for backdrop with parallax effect
	const backdropAnimatedStyle = useAnimatedStyle(() => {
		const translateY = interpolate(
			scrollY.value,
			[0, BACKDROP_HEIGHT],
			[0, -BACKDROP_HEIGHT * 0.5],
			Extrapolate.CLAMP
		);

		// Using withDecay for smoother parallax effect
		// const translateY = withDecay({
		// 	velocity: scrollY.value,
		// 	clamp: [-BACKDROP_HEIGHT / 2, 0],
		// 	rubberBandEffect: true,
		// });

		const scale = interpolate(
			scrollY.value,
			[-BACKDROP_HEIGHT, 0, BACKDROP_HEIGHT],
			[2, 1, 1],
			Extrapolate.CLAMP
		);

		return {
			transform: [{ translateY }, { scale }],
		};
	});

	// Animated style for overlay opacity
	const overlayAnimatedStyle = useAnimatedStyle(() => {
		const opacity = interpolate(
			scrollY.value,
			[0, BACKDROP_HEIGHT * 0.5],
			[0.6, 0.9],
			Extrapolate.CLAMP
		);

		return {
			opacity,
		};
	});

	// ✅ Always call hooks before conditional returns
	React.useEffect(() => {
		if (!item?.genres?.length) {
			setGenres([]);
			return;
		}
		const genreNames = item.genres
			.map((g) => {
				const found = Genres.find((x) => x.id === g.id);
				return found ? found.name : null;
			})
			.filter(Boolean) as string[];
		setGenres(genreNames);
	}, [item?.id]);

	// Conditional returns AFTER hooks
	if (loading || !item) return <LoadingSkeleton />;
	if (error) return <ErrorState error={error} onRetry={onRetry} />;

	const credits = item.credits;

	// We'll use the shared CollectionButtons component for favourites/watchlist actions.

	// Fallback image URLs
	const backdropImage = item?.backdrop_path
		? `https://image.tmdb.org/t/p/original${item.backdrop_path}`
		: item?.poster_path
			? `https://image.tmdb.org/t/p/original${item.poster_path}`
			: 'https://via.placeholder.com/500x300/333333/FFFFFF?text=No+Image';

	// Helper function to safely get rating
	const getRating = () => {
		if (!item?.vote_average) return 'N/A';
		const rating = Math.round(Number(item.vote_average) / 2);
		return rating > 0 ? rating : 'N/A';
	};

	// Helper function to safely get year
	const getYear = () => {
		if (!item?.release_date) return 'Unknown';
		return item.release_date.split('-')[0];
	};

	// Helper function to safely get language
	const getLanguage = () => {
		if (!item?.original_language) return 'Unknown';
		return item.original_language.toUpperCase();
	};

	return (
		<View className="flex-1 bg-black pb-6">
			{/* Backdrop Image with Parallax Effect */}
			<Animated.Image
				source={{ uri: backdropImage }}
				style={[
					{
						position: 'absolute',
						top: 0,
						left: 0,
						right: 0,
						width: '100%',
						height: BACKDROP_HEIGHT,
						zIndex: 0,
					},
					backdropAnimatedStyle,
				]}
				resizeMode="cover"
				onError={(error) => {
					console.warn(`Failed to load backdrop image for movie ${item.id}:`, error);
				}}
			/>

			{/* Animated Overlay */}
			<Animated.View
				style={[
					{
						position: 'absolute',
						top: 0,
						left: 0,
						right: 0,
						height: BACKDROP_HEIGHT,
						backgroundColor: 'black',
						zIndex: 1,
					},
					overlayAnimatedStyle,
				]}
			/>

			{/* Scrollable Content */}
			<Animated.ScrollView
				className="flex-1 "
				style={{ zIndex: 10 }}
				onScroll={scrollHandler}
				scrollEventThrottle={16}
				showsVerticalScrollIndicator={false}
			>
				{/* Spacer for backdrop */}
				<View style={{ height: BACKDROP_HEIGHT - 80 }} />

				{/* Movie Info */}
				<Animated.View
					className="px-4 -mt-40 flex-1 rounded-t-3xl pt-6"
					entering={FadeIn.delay(100).duration(500)}
					exiting={FadeOut.duration(200)}
					style={{ zIndex: 20 }}
				>
					<View className='flex items-center gap-y-4 justify-center w-full  '>
						<Image
							source={{
								uri: item?.poster_path
									? `https://image.tmdb.org/t/p/w500${item.poster_path}`
									: 'https://via.placeholder.com/150',
							}}
							style={{
								width: 200,
								height: 275,
								borderRadius: 8,

							}}
							resizeMode="cover"
						/>
						{/* Title */}
						{/* <Text
							className="text-white text-4xl text-center"
							style={{
								fontWeight: '500',
								fontFamily: 'Manrope',
							}}
						>
							{item?.title || 'Unknown Title'}
						</Text> */}
					</View>

					{/* Movie Meta Info */}
					<Text
						className="text-gray-300 text-xl pt-4"
						style={{
							fontWeight: '500',
							fontFamily: 'Manrope',
						}}
					>
						{getYear()}, {getLanguage()}, {getRating()}{' '}
						{getRating() !== 'N/A' && <FontAwesome name="star" size={14} color="#FFD700" />}
					</Text>

					{/* Genres */}
					{genres.length > 0 && (
						<View className="flex-row flex-wrap gap-2 mt-4">
							{genres.map((genre, index) => (
								<View
									key={index}
									className="bg-gray-800 px-3 py-1 rounded-full border-[1px] border-primary-base"
								>
									<Text
										className="text-white text-sm"
										style={{
											fontWeight: '500',
											fontFamily: 'Manrope',
										}}
									>
										{genre}
									</Text>
								</View>
							))}
						</View>
					)}

					{/* Overview */}
					{item?.overview && (
						<View className="mt-4">
							<Text className="text-white text-lg font-semibold mb-2">Overview</Text>
							<Text className="text-gray-300 leading-6">{item.overview}</Text>
						</View>
					)}

					{/* Action Buttons (shared component) */}
					<CollectionButtons
						id={item.id}
						moviePayload={{
							movieId: item.id,
							title: item.title,
							posterPath: item.poster_path || '',
							backdropPath: item.backdrop_path || '',
							releaseDate: item.release_date || '',
						}}
					/>

					{/* Cast Section */}
					<View className="mt-6">
						<Text className="text-white text-lg font-semibold mb-2">Cast</Text>

						{credits?.cast && credits.cast.length > 0 ? (
							<ScrollView horizontal showsHorizontalScrollIndicator={false}>
								{credits.cast.slice(0, 10).map((actor: any, index: number) => (
									<View key={actor.id || index} className="items-center mr-4">
										<Image
											source={{
												uri: actor.profile_path
													? `https://image.tmdb.org/t/p/w185${actor.profile_path}`
													: 'https://via.placeholder.com/100x100/666666/FFFFFF?text=No+Photo',
											}}
											className="w-16 h-16 rounded-full"
											onError={() => {
												console.warn(`Failed to load profile image for actor: ${actor.name}`);
											}}
										/>
										<Text className="text-white text-xs mt-2 text-center w-16" numberOfLines={2}>
											{actor.name || 'Unknown'}
										</Text>
										{actor.character && (
											<Text className="text-gray-400 text-xs text-center w-16" numberOfLines={1}>
												{actor.character}
											</Text>
										)}
									</View>
								))}
							</ScrollView>
						) : (
							<Text className="text-gray-400 italic">No cast information available</Text>
						)}
					</View>

					{/* Videos Section */}
					{item?.videos && <MovieVideos videosData={item.videos} />}

					{/* Watch Button */}
					{/* <Pressable className="bg-primary-accent mt-6 py-4 rounded-2xl items-center mb-8">
						<Text className="text-white font-bold text-lg">Watch Movie</Text>
					</Pressable> */}
				</Animated.View>
			</Animated.ScrollView>
		</View>
	);
};

export default MovieDetails;