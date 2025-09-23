import { Genres } from '@/constants/data';
import { Movie } from '@/constants/types';

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
	addToFavorites,
	addToWatchlist,
	removeFromFavorites,
	removeFromWatchlist,
} from '@/store/slices/moviesSlice';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import React from 'react';
import {
	Dimensions,
	Image,
	ImageBackground,
	Pressable,
	ScrollView,
	Text,
	View,
} from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import MovieVideos from './movie-videos';

const { width } = Dimensions.get('window');

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
	const dispatch = useAppDispatch();
	const [genres, setGenres] = React.useState<string[]>([]);
	const { favorites, watchlist } = useAppSelector((state) => state.movies);

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
	}, [item?.id]); // or [item] if you prefer

	// Conditional returns AFTER hooks
	if (loading || !item) return <LoadingSkeleton />;
	if (error) return <ErrorState error={error} onRetry={onRetry} />;

	const credits = item.credits;

	const isFavorite = favorites.includes(item.id);
	const isInWatchlist = watchlist.includes(item.id);

	const handleToggleFavorite = () => {
		if (isFavorite) {
			dispatch(removeFromFavorites(item.id));
		} else {
			dispatch(addToFavorites(item.id));
		}
	};

	const handleToggleWatchlist = () => {
		if (isInWatchlist) {
			dispatch(removeFromWatchlist(item.id));
		} else {
			dispatch(addToWatchlist(item.id));
		}
	};

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
		<ScrollView className="flex-1 bg-black">
			{/* Backdrop Image */}
			<ImageBackground
				source={{ uri: backdropImage }}
				style={{ width: '100%', height: 400, margin: 4 }}
				resizeMode="cover"
				className="object-cover rounded-lg"
				onError={(error) => {
					console.warn(`Failed to load backdrop image for movie ${item.id}:`, error);
				}}
			>
				<View className="absolute inset-0 bg-black/60" />
			</ImageBackground>

			{/* Movie Info */}
			<Animated.View
				className="px-4 -mt-20"
				entering={FadeIn.delay(100).duration(500)}
				exiting={FadeOut.duration(200)}
			>
				{/* Title */}
				<Text
					className="text-white text-4xl"
					style={{
						fontWeight: '500',
						fontFamily: 'Manrope',
					}}
				>
					{item?.title || 'Unknown Title'}
				</Text>

				{/* Movie Meta Info */}
				<Text
					className="text-gray-300 mt-1 text-xl"
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

				{/* Action Buttons */}
				<View className="flex-row gap-4 mt-6">
					<Pressable
						onPress={handleToggleFavorite}
						className={`flex-1 py-3 rounded-xl items-center ${
							isFavorite ? 'bg-red-600' : 'bg-gray-700'
						}`}
					>
						<View className="flex-row items-center">
							<FontAwesome name={isFavorite ? 'heart' : 'heart-o'} size={20} color="white" />
							<Text className="text-white ml-2 font-medium">
								{isFavorite ? 'Favorited' : 'Favorite'}
							</Text>
						</View>
					</Pressable>

					<Pressable
						onPress={handleToggleWatchlist}
						className={`flex-1 py-3 rounded-xl items-center ${
							isInWatchlist ? 'bg-blue-600' : 'bg-gray-700'
						}`}
					>
						<View className="flex-row items-center">
							<FontAwesome
								name={isInWatchlist ? 'bookmark' : 'bookmark-o'}
								size={20}
								color="white"
							/>
							<Text className="text-white ml-2 font-medium">
								{isInWatchlist ? 'Watchlisted' : 'Watchlist'}
							</Text>
						</View>
					</Pressable>
				</View>

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
				<MovieVideos videosData={item?.videos} />

				{/* Watch Button */}
				<Pressable className="bg-primary-accent mt-6 py-4 rounded-2xl items-center mb-8">
					<Text className="text-white font-bold text-lg">Watch Movie</Text>
				</Pressable>
			</Animated.View>
		</ScrollView>
	);
};

export default MovieDetails;