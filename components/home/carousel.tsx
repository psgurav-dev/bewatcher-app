import { Movie } from '@/constants/types';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, {
	Extrapolation,
	interpolate,
	SharedValue,
	useAnimatedScrollHandler,
	useAnimatedStyle,
	useSharedValue,
	withTiming,
} from 'react-native-reanimated';
import { runOnJS } from 'react-native-worklets';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.65;

export default function MovieCarousel({
	carousel_movie_data,
	scrollY,
}: {
	carousel_movie_data: Movie[];
	scrollY: SharedValue<number>;
}) {

	const scrollX = useSharedValue(0);

	const [activeIndex, setActiveIndex] = useState(0);

	const onScroll = useAnimatedScrollHandler({
		onScroll: (event) => {
			scrollX.value = event.contentOffset.x;

			const index = Math.round(event.contentOffset.x / CARD_WIDTH);
			runOnJS(setActiveIndex)(index);
		},
	});

	const containerAnimatedStyle = useAnimatedStyle(() => {
		const opacity = interpolate(scrollY.value, [0, 100], [1, 0.5], Extrapolation.CLAMP);
		const scale = interpolate(scrollY.value, [0, 100], [1, 0.9], Extrapolation.CLAMP);
		return {
			opacity,
			transform: [{ scale }],
		};
	});


	return (
		<View style={{ position: 'relative' }}>
			<AnimatedBackdrop movies={carousel_movie_data} activeIndex={activeIndex} />
			<Animated.FlatList
				data={carousel_movie_data}
				horizontal
				bounces={false}
				keyExtractor={(item: Movie) => item.id.toString()}
				showsHorizontalScrollIndicator={false}
				snapToInterval={CARD_WIDTH}
				decelerationRate="fast"
				nestedScrollEnabled={true}
				contentContainerStyle={{
					paddingHorizontal: 40,
					paddingRight: 60,
					paddingTop: 20,
					marginTop: 25,

				}}
				style={containerAnimatedStyle}
				onScroll={onScroll}
				scrollEventThrottle={16}
				renderItem={({ item, index }) => (
					<MovieCard item={item} index={index} scrollX={scrollX} dataLength={carousel_movie_data.length} />

				)}
				ListEmptyComponent={() => (
					<View
						style={{
							flex: 1,
							alignItems: 'center',
							justifyContent: 'center',
							padding: 16,
						}}
					>
						<Text style={{ color: '#6B7280' }}>No movies available.</Text>
					</View>
				)}
			/>

		</View>
	);
}

function MovieCard({
	item,
	index,
	scrollX,
	dataLength,

}: {
	item: Movie;
	index: number;
	scrollX: SharedValue<number>;
		dataLength: number;

}) {
	const router = useRouter();
	const animatedStyle = useAnimatedStyle(() => {
		const inputRange = [
			(index - 1) * (CARD_WIDTH + 8),
			index * (CARD_WIDTH + 8),
			(index + 1) * (CARD_WIDTH + 8),
		];
		const scale = interpolate(scrollX.value, inputRange, [0.85, 1, 0.85], Extrapolation.CLAMP);
		return {
			transform: [{ scale }],
		};
	});

	return (
		<TouchableOpacity
			activeOpacity={0.8}
			onPress={() => router.push(`/movie/${item.id}`)}
		>
			<Animated.View
				style={[
					{
						width: CARD_WIDTH,
						height: 340,
						borderRadius: 12,
						padding: 4,
						marginLeft: index === 0 ? 18 : 0,
						marginRight: index === dataLength - 1 ? 18 : 0,
						paddingRight: index === dataLength ? 10 : 0,

					},
					animatedStyle,
				]}
			>
				<Image
					source={{
						uri: item.poster_path
							? `https://image.tmdb.org/t/p/original${item.poster_path}`
							: 'https://via.placeholder.com/150',
					}}
					style={{
						width: '100%',
						height: 320,
						borderRadius: 8,
						marginBottom: 8,
					}}
					resizeMode="cover"
				/>
				{/*
				<Text
					style={{
						fontSize: 32,
						color: '#F1F5F9',
						textAlign: 'center',
						fontWeight: 500,
						fontFamily: 'BricolageGrotesque',
					}}
				>
					{item.title}
				</Text> */}

			</Animated.View>
		</TouchableOpacity>
	);
}

function AnimatedBackdrop({
	movies,
	activeIndex,
}: {
	movies: Movie[];
	activeIndex: number;
}) {
	// We keep track of "current" and "next" poster so we can cross-fade between them
	const [layers, setLayers] = useState<{ uri: string; key: number }[]>([]);
	const opacity = useSharedValue(1);

	useEffect(() => {
		const uri = movies[activeIndex]?.poster_path
			? `https://image.tmdb.org/t/p/w780${movies[activeIndex].poster_path}`
			: 'https://via.placeholder.com/400x600';

		setLayers((prev) => {
			// Push new image on top, keep max 2 layers
			const next = [...prev, { uri, key: Date.now() }].slice(-2);
			return next;
		});
	}, [activeIndex]);

	const topLayerStyle = useAnimatedStyle(() => ({
		opacity: withTiming(1, { duration: 600 }),
	}));

	return (
		<View style={StyleSheet.absoluteFill} pointerEvents="none">
			{layers.map((layer, i) => (
				<Animated.Image
					key={layer.key}
					source={{ uri: layer.uri }}
					style={[
						StyleSheet.absoluteFill,
						{ resizeMode: 'cover' },
						// only animate the top (latest) layer
						i === layers.length - 1 ? topLayerStyle : { opacity: 1 },
					]}
					blurRadius={30}
				/>
			))}

			{/* Dark overlay for readability */}
			<View
				style={[
					StyleSheet.absoluteFill,
					{ backgroundColor: 'rgba(5, 5, 15, 0.62)' },
				]}
			/>
		</View>
	);
}

