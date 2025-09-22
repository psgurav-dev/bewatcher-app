import MovieCarousel from '@/components/home/carousel';
import { Popular } from '@/components/home/movies-list';

import { carousel_movie_data } from '@/constants/sample-data';
import { ScrollView, Text, View } from 'react-native';
import { useSharedValue } from 'react-native-reanimated';

export default function HomeScreen() {
	const scrollY = useSharedValue(0);

	return (
		<ScrollView
			className="bg-black"
			onScroll={(e) => {
				scrollY.value = e.nativeEvent.contentOffset.y;
			}}
			scrollEventThrottle={16}
		>
			<MovieCarousel carousel_movie_data={carousel_movie_data} scrollY={scrollY} />
			<View className="">
				<Text
					className="px-2"
					style={{
						fontWeight: '500',
						fontFamily: 'Zalondo',
						fontSize: 32,
						color: '#ffffff',
					}}
				>
					Popular
				</Text>
				<Popular />
			</View>
		</ScrollView>
	);
}
