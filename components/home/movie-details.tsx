import { MOVIE_DB_API_KEY, MOVIE_DB_BASE_URL } from '@/constants/config';
import { Genres } from '@/constants/data';
import { Movie } from '@/constants/types';
import { useCacheQuery } from '@/hooks/useCacheQuery';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import React, { useEffect } from 'react';
import {
  ActivityIndicator,
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
	const [genres, setGenres] = React.useState<string[]>([]);

	const TMDB_BASE_URL = new URL(`${MOVIE_DB_BASE_URL}/movie/${item.id}/credits`);
	TMDB_BASE_URL.searchParams.append('api_key', MOVIE_DB_API_KEY);

	async function fetchMovieCredits() {
		console.log('Fetching movie details from API...');
		const res = await fetch(TMDB_BASE_URL);
		if (!res.ok) throw new Error('Failed to fetch movies');
		return res.json();
	}

	const {
		data: credits,
		isLoading: loading,
		error,
	} = useCacheQuery({
		queryKey: [`movie_credits_${item.id}`],
		queryFn: fetchMovieCredits,
		staleTime: 8.64e7,
	});

	useEffect(() => {
		if (item.genre_ids && item.genre_ids.length > 0) {
			const genreNames = item.genre_ids
				.map((id) => {
					const genre = Genres.find((g) => g.id === id);
					return genre ? genre.name : null;
				})
				.filter((name) => name !== null) as string[];
			setGenres(genreNames);
		}
	}, []);

	return (
		<ScrollView className="flex-1 bg-black">
			<ImageBackground
				source={{
					uri: item?.backdrop_path
						? `https://image.tmdb.org/t/p/original${item.backdrop_path}`
						: 'https://via.placeholder.com/500',
				}}
				style={{ width: '100%', height: 400, margin: 4 }}
				resizeMode="cover"
				className="object-cover rounded-lg"
			>
				<View className="absolute inset-0 bg-black/60" />
			</ImageBackground>

			{/* Movie Info  */}
			<Animated.View
				className="px-4 -mt-20"
				entering={FadeIn.delay(100).duration(500)}
				exiting={FadeOut.duration(200)}
			>
				<Text
					className="text-white text-4xl"
					style={{
						fontWeight: '500',
						fontFamily: 'Manrope',
					}}
				>
					{item?.title}
				</Text>
				<Text
					className="text-gray-300 mt-1 text-xl"
					style={{
						fontWeight: '500',
						fontFamily: 'Manrope',
					}}
				>
					{item?.release_date?.split('-')[0]}, {item?.original_language?.toUpperCase()} ,
					{Math.round(Number(item?.vote_average) / 2)}{' '}
					<FontAwesome name="star" size={14} color="#FFD700" />
				</Text>

				{/* Genres */}
				<View className="flex-row flex-wrap gap-2 mt-4">
					{genres?.map((genre, index) => (
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

				{/* Overview */}
				<Text className="text-gray-300 mt-4 leading-6">{item.overview}</Text>

				{/* Cast Section */}
				<Text className="text-white text-lg font-semibold mt-6 mb-2" style={{}}>
					Cast
				</Text>
				<ScrollView horizontal showsHorizontalScrollIndicator={false}>
					{loading ? (
						<ActivityIndicator size="large" color="#ffffff" />
					) : (
						(credits?.cast ?? [])?.map((actor: any, index: number) => (
							<View key={index} className="items-center mr-4">
								<Image
									source={{
										uri: actor.profile_path
											? `https://image.tmdb.org/t/p/w185${actor.profile_path}`
											: 'https://via.placeholder.com/100',
									}}
									className="w-16 h-16 rounded-full"
								/>
								<Text className="text-white text-xs mt-2 text-center w-16">{actor.name}</Text>
							</View>
						))
					)}
				</ScrollView>

				{/* Watch Button */}
				<Pressable className="bg-primary-accent mt-6 py-4 rounded-2xl items-center">
					<Text className="text-white font-bold text-lg">Watch Movie</Text>
				</Pressable>
			</Animated.View>
		</ScrollView>
	);
};

export default MovieDetails;
