import { carousel_movie_data } from "@/constants/sample-data";
import { Movie } from "@/constants/types";
import { Dimensions, Image, Text, TouchableOpacity, View } from "react-native";
import Animated, {
	Extrapolation,
	interpolate,
	SharedValue,
	useAnimatedScrollHandler,
	useAnimatedStyle,
	useSharedValue,
} from 'react-native-reanimated';

const { width } = Dimensions.get("window");
const CARD_WIDTH = width * 0.65;

export default function MovieCarousel({
	carousel_movie_data,
	scrollY,
}: {
	carousel_movie_data: Movie[];
	scrollY: SharedValue<number>;
}) {
	const scrollX = useSharedValue(0);

	const onScroll = useAnimatedScrollHandler({
		onScroll: (event) => {
			scrollX.value = event.contentOffset.x;
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
		<Animated.FlatList
			data={carousel_movie_data}
			horizontal
			bounces={false}
			keyExtractor={(item: Movie) => item.id.toString()}
			showsHorizontalScrollIndicator={false}
			snapToInterval={CARD_WIDTH + 8}
			decelerationRate="fast"
			nestedScrollEnabled={true}
			contentContainerStyle={{
				paddingHorizontal: 40,
				paddingTop: 20,
				marginTop: 25,
				gap: 18,
			}}
			style={containerAnimatedStyle}
			onScroll={onScroll}
			scrollEventThrottle={16}
			renderItem={({ item, index }) => <MovieCard item={item} index={index} scrollX={scrollX} />}
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
	);
}

function MovieCard({
	item,
	index,
	scrollX,
}: {
	item: Movie;
	index: number;
	scrollX: SharedValue<number>;
}) {
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
		<TouchableOpacity activeOpacity={0.8}>
			<Animated.View
				style={[
					{
						width: CARD_WIDTH,
						height: 380,
						borderRadius: 12,
						padding: 8,

						marginLeft: index === 0 ? 18 : 0,
						marginRight: index === carousel_movie_data.length - 1 ? 18 : 0,
					},
					animatedStyle,
				]}
			>
				<Image
					source={{
						uri: item.poster_path
							? `https://image.tmdb.org/t/p/w500${item.poster_path}`
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
				<Text
					style={{
						fontSize: 32,
						marginTop: 2,
						fontWeight: 'bold',
						color: '#F1F5F9',
						textAlign: 'center',
						fontFamily: 'Poppins, sans-serif',
					}}
				>
					{item.title}
				</Text>
			</Animated.View>
		</TouchableOpacity>
	);
}
