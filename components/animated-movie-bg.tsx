import React, { useEffect, useState } from "react";
import { Text, View, Image, Dimensions, Button, Pressable, TouchableOpacity } from "react-native";
import { useSelector } from "react-redux";
import Animated, {
	useSharedValue,
	useAnimatedStyle,
	withRepeat,
	withTiming,
	Easing,
	interpolate,
	withSequence,
	withDelay,
} from "react-native-reanimated";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { router, useRouter } from "expo-router";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

// Enhanced Movie Card with hover effects
const EnhancedMovieCard = ({
	movie,
	index,
	animationDelay = 0
}: {
	movie: any;
	index: number;
	animationDelay?: number;
}) => {
	const scale = useSharedValue(0);
	const opacity = useSharedValue(0);
	const rotation = useSharedValue(0);

	const cardWidth = 140;
	const cardHeight = 200;

	const animatedStyle = useAnimatedStyle(() => ({
		transform: [
			{ scale: scale.value },
			{ rotateY: `${rotation.value}deg` }
		],
		opacity: opacity.value,
	}));

	useEffect(() => {
		// Entrance animation
		scale.value = withDelay(
			animationDelay,
			withSequence(
				withTiming(1.1, { duration: 300, easing: Easing.back(1.7) }),
				withTiming(1, { duration: 200 })
			)
		);

		opacity.value = withDelay(
			animationDelay,
			withTiming(1, { duration: 400 })
		);

		// Subtle floating animation
		rotation.value = withDelay(
			animationDelay + 500,
			withRepeat(
				withSequence(
					withTiming(2, { duration: 2000, easing: Easing.inOut(Easing.sin) }),
					withTiming(-2, { duration: 2000, easing: Easing.inOut(Easing.sin) })
				),
				-1,
				true
			)
		);
	}, [animationDelay]);

	return (
		<Animated.View
			style={[
				{
					width: cardWidth,
					height: cardHeight,
					marginRight: 16,
				},
				animatedStyle,
			]}
			className="bg-gray-900 rounded-xl overflow-hidden shadow-lg"
		>
			<View className="bg-gray-900 rounded-xl overflow-hidden shadow-lg h-full">
				<Image
					source={{
						uri: movie.poster_path
							? `https://image.tmdb.org/t/p/w400${movie.poster_path}`
							: 'https://via.placeholder.com/400x600/1F2937/9CA3AF?text=No+Poster',
					}}
					style={{
						width: '100%',
						height: '100%',
					}}
					className="rounded-t-xl"
					resizeMode="cover"
				/>

				{/* Rating badge */}
				{/* {movie.vote_average && (
					<View className="absolute top-2 right-2 bg-yellow-500 rounded-full px-2 py-1">
						<Text className="text-black text-xs font-bold">
							{Math.round(movie.vote_average * 10) / 10}
						</Text>
					</View>
				)} */}
			</View>
		</Animated.View>
	);
};

// Marquee row component with different directions
const MarqueeRow = ({
	movies,
	speed = 40000,
	delay = 0,
	reverse = false,
	yPosition = 0
}: {
	movies: any[];
	speed?: number;
	delay?: number;
	reverse?: boolean;
	yPosition?: number;
}) => {
	const translateX = useSharedValue(0);
	const [duplicatedMovies, setDuplicatedMovies] = useState<any[]>([]);

	const cardWidth = 156; // 140 + 16 margin

	useEffect(() => {
		// Duplicate movies to create seamless loop
		const duplicated = [...movies, ...movies, ...movies];
		setDuplicatedMovies(duplicated);
	}, [movies]);

	useEffect(() => {
		if (duplicatedMovies.length === 0) return;

		const totalWidth = duplicatedMovies.length * cardWidth;
		const startPosition = reverse ? -totalWidth / 3 : screenWidth;
		const endPosition = reverse ? screenWidth : -totalWidth / 3;

		translateX.value = startPosition;

		setTimeout(() => {
			translateX.value = withRepeat(
				withTiming(endPosition, {
					duration: speed,
					easing: Easing.linear,
				}),
				-1,
				false
			);
		}, delay);
	}, [duplicatedMovies, speed, delay, reverse]);

	const animatedStyle = useAnimatedStyle(() => ({
		transform: [{ translateX: translateX.value }],
	}));

	if (duplicatedMovies.length === 0) return null;

	return (
		<View
			style={{
				position: 'absolute',
				top: yPosition,
				left: 0,
				right: 0,
				height: 220,
			}}
		>
			<Animated.View
				style={[
					{
						flexDirection: 'row',
						alignItems: 'center',
					},
					animatedStyle,
				]}
			>
				{duplicatedMovies.map((movie, index) => (
					<EnhancedMovieCard
						key={`${movie.id}-${index}`}
						movie={movie}
						index={index}
						animationDelay={index * 100}
					/>
				))}
			</Animated.View>
		</View>
	);
};

// Main animated background component
export const AnimatedMovieBackground = () => {
	const popularMovies = useSelector((state: any) => state.movies.popularMovies);
	console.log("popularMovies", popularMovies)
	if (!popularMovies || popularMovies.length === 0) {
		return (
			<View className="flex-1 items-center justify-center bg-gray-900">
				<Text className="text-white text-lg">Loading amazing movies...</Text>
			</View>
		);
	}

	// Create different sets of movies for each row
	const createMovieRows = () => {
		const totalRows = 2;
		const moviesPerRow = 6;
		const rows = [];

		for (let i = 0; i < totalRows; i++) {
			const startIndex = (i * moviesPerRow) % popularMovies.length;
			const rowMovies = [];

			for (let j = 0; j < moviesPerRow * 2; j++) {
				const movieIndex = (startIndex + j) % popularMovies.length;
				rowMovies.push(popularMovies[movieIndex]);
			}

			rows.push({
				id: i,
				movies: rowMovies,
				speed: 65000 + (i * 5000),
				delay: i * 2000,
				reverse: i % 2 === 1, // Alternate direction
				yPosition: 50 + (i * 220),
			});
		}

		return rows;
	};

	const movieRows = createMovieRows();

	return (
		<View className="flex-1 w-full bg-gradient-to-b from-black to-transparent overflow-hidden relative">
			{/* Animated background rows */}
			<TouchableOpacity
				className="border border-white rounded-full p-2 absolute top-10 left-4 z-30 px-3"
				style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
				<FontAwesome
					name="arrow-left"
					size={24}
					color="white"

					onPress={() => {
						router.push("/(tabs)/home");
					}}
				/>
			</TouchableOpacity>

			{movieRows.map((row) => (
				<MarqueeRow
					key={row.id}
					movies={row.movies}
					speed={row.speed}
					delay={row.delay}
					reverse={row.reverse}
					yPosition={row.yPosition}
				/>
			))}


			{/* Dark overlay for content readability */}
			<View className="absolute inset-0 bg-black/60" />

			{/* Top gradient */}
			<View className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-black via-black/50 to-transparent z-10" />

			{/* Bottom gradient */}
			<View className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black via-black/50 to-transparent z-10" />

			{/* Your content goes here */}
			<View className="flex-1 items-center justify-end z-20 px-6 w-full relative bottom-48">
				<Text className="text-white text-6xl font-bold text-start mb-4 " style={{ fontFamily: 'BricolageGrotesque', fontWeight: 500 }}>
					Every Frame Deserves a Thought
				</Text>
				<Text className="text-gray-300 text-base text-start mb-6" style={{ fontFamily: 'Zalondo', fontWeight: '500', lineHeight: 20 }}>
					Appeals to thoughtful cinephiles who appreciate the craft of filmmaking
				</Text>

			</View>
		</View>
	);
};

// Simple version for your current use case
export const AnimatedList = () => {
	return <AnimatedMovieBackground />;
};