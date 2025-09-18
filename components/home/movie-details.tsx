import { Movie } from '@/constants/types'
import React from 'react'
import { Dimensions, ImageBackground, Pressable, ScrollView, Text, View } from 'react-native'
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated'


const { width } = Dimensions.get("window")

const MovieDetails = ({ item }: { item: Movie }) => {
	const [cast,setCast] = React.useState<any[]>([])
	
	return (
		<ScrollView className="flex-1 bg-black">
			{/* Backdrop */}
			<ImageBackground
				source={{
					uri: item?.backdrop_path
						? `https://image.tmdb.org/t/p/original${item.backdrop_path}`
						: "https://via.placeholder.com/500",
				}}
				style={{ width: "100%", height: 400, margin: 4,  }}
				resizeMode="cover"
				className='object-cover rounded-lg'
			>
				{/* Dark overlay for readability */}
				<View className="absolute inset-0 bg-black/40" />
			</ImageBackground>

			{/* Movie info */}
			<Animated.View
				className="px-4 -mt-20"
				entering={FadeIn.delay(100).duration(500)}
				exiting={FadeOut.duration(200)}
			>
				{/* Title + Year + Director */}
				<Text className="text-white text-2xl font-bold">{item?.title}</Text>
				{/* <Text className="text-gray-300 mt-1">
					{item?.release_date?.split("-")[0]}, {item?.director || "Unknown"}
				</Text> */}

				{/* Genres */}
				{/* <View className="flex-row flex-wrap gap-2 mt-2">
					{item?.genres?.map((genre, index) => (
						<View
							key={index}
							className="bg-gray-800 px-3 py-1 rounded-full"
						>
							<Text className="text-white text-sm">{genre.name}</Text>
						</View>
					))}
				</View> */}

				{/* Overview */}
				<Text className="text-gray-300 mt-4 leading-6">
					{item?.overview}
				</Text>

				{/* Cast Section */}
				<Text className="text-white text-lg font-semibold mt-6 mb-2">Cast</Text>
				{/* <ScrollView horizontal showsHorizontalScrollIndicator={false}>
					{item?.cast?.map((actor, index) => (
						<View key={index} className="items-center mr-4">
							<Image
								source={{
									uri: actor.profile_path
										? `https://image.tmdb.org/t/p/w185${actor.profile_path}`
										: "https://via.placeholder.com/100",
								}}
								className="w-16 h-16 rounded-full"
							/>
							<Text className="text-white text-xs mt-2 text-center w-16">
								{actor.name}
							</Text>
						</View>
					))}
				</ScrollView> */}

				{/* Watch Button */}
				<Pressable className="bg-primary-accent mt-6 py-4 rounded-2xl items-center">
					<Text className="text-white font-bold text-lg">Watch Movie</Text>
				</Pressable>
			</Animated.View>
		</ScrollView>
	)
}

export default MovieDetails