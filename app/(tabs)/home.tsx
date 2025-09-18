import MovieCarousel from "@/components/home/carousel";

import MoviesList from "@/components/home/movies-list";
import { carousel_movie_data } from "@/constants/sample-data";
import { ScrollView, View } from "react-native";
import { useSharedValue } from "react-native-reanimated";

export default function HomeScreen() {
	const scrollY = useSharedValue(0);
	return (
		<ScrollView className="bg-black"
			onScroll={(e) => {
				scrollY.value = e.nativeEvent.contentOffset.y;
			}}
			scrollEventThrottle={16}
		>
			<MovieCarousel carousel_movie_data={carousel_movie_data} scrollY={scrollY} />
			<View className="">
				<MoviesList />
			</View>
		</ScrollView>
	);
}
