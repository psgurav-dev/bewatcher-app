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
import React, { useEffect } from 'react';
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

const { width } = Dimensions.get('window');

const MovieDetails = ({ item }: { item: Movie }) => {
	const dispatch = useAppDispatch();
	const [genres, setGenres] = React.useState<string[]>([]);

	const { movieCredits, creditsLoading, creditsError, favorites, watchlist } = useAppSelector(
		(state) => state.movies,
	);

	const credits = item.credits;

	useEffect(() => {
		if (item.genres && item.genres.length > 0) {
			const genreNames = item.genres
				.map((item) => {
					const genre = Genres.find((g) => g.id === item.id);
					return genre ? genre.name : null;
				})
				.filter((name) => name !== null) as string[];
			setGenres(genreNames);
		}
	}, []);

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

				{/* Watch Button */}
				<Pressable className="bg-primary-accent mt-6 py-4 rounded-2xl items-center mb-8">
					<Text className="text-white font-bold text-lg">Watch Movie</Text>
				</Pressable>
			</Animated.View>
		</ScrollView>
	);
};

export default MovieDetails;
