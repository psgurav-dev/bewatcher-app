import { Movie } from "@/constants/types";
import { View } from "react-native";
import { SharedValue, useAnimatedScrollHandler, useSharedValue } from "react-native-reanimated";

const AnimatedCarousel = ({
	carouselMovieData, scrollY,
}: {
	carouselMovieData: Movie[]; scrollY: SharedValue<number>;
}) => {

	const scrollX = useSharedValue(0);
	const currentIndex = useSharedValue(0);

	const onScrollX = useAnimatedScrollHandler({
		onScroll: (event) => {
			scrollX.value = event.contentOffset.x;
			
		}
	})


	return <View></View>;
};

export default AnimatedCarousel;