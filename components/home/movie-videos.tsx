import { MovieVideo, MovieVideosResponse } from '@/constants/types';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import React from 'react';
import { Linking, Pressable, ScrollView, Text, View } from 'react-native';
import VideoThumbnail from './video-thumbnail';

const MovieVideos = ({ videosData }: { videosData: MovieVideosResponse | undefined }) => {
	const getYouTubeThumbnail = (
		key: string,
		quality: 'maxresdefault' | 'hqdefault' = 'hqdefault',
	) => {
		return `https://img.youtube.com/vi/${key}/${quality}.jpg`;
	};

	const openVideo = async (video: MovieVideo) => {
		if (video.site === 'YouTube') {
			const youtubeUrl = `https://www.youtube.com/watch?v=${video.key}`;
			try {
				const supported = await Linking.canOpenURL(youtubeUrl);
				if (supported) {
					await Linking.openURL(youtubeUrl);
				} else {
					console.error("Don't know how to open this URL:", youtubeUrl);
				}
			} catch (error) {
				console.error('Error opening video:', error);
			}
		}
	};

	const getVideoTypeIcon = (type: string) => {
		switch (type.toLowerCase()) {
			case 'trailer':
				return 'play-circle';
			case 'teaser':
				return 'play-circle-outline';
			case 'clip':
				return 'movie';
			case 'featurette':
				return 'video-library';
			case 'behind the scenes':
				return 'camera';
			default:
				return 'play-circle';
		}
	};

	const processedVideos = videosData?.results
		? videosData.results
				.filter((video) => video.site === 'YouTube') // Only YouTube videos
				.sort((a, b) => {
					// Sort by: official first, then by type priority, then by date
					if (a.official !== b.official) return b.official ? 1 : -1;

					const typePriority = { Trailer: 0, Teaser: 1, Clip: 2, Featurette: 3 };
					const aPriority = typePriority[a.type as keyof typeof typePriority] ?? 4;
					const bPriority = typePriority[b.type as keyof typeof typePriority] ?? 4;

					if (aPriority !== bPriority) return aPriority - bPriority;

					return new Date(b.published_at).getTime() - new Date(a.published_at).getTime();
				})
				.slice(0, 6) // Limit to 6 videos
		: [];

	return (
		<>
			{processedVideos.length > 0 && (
				<View className="mt-6">
					<Text className="text-white text-lg font-semibold mb-3">Videos & Trailers</Text>

					<ScrollView horizontal showsHorizontalScrollIndicator={false}>
						{processedVideos.map((video, index) => (
							<Pressable
								key={video.id}
								onPress={() => openVideo(video)}
								className="mr-4"
								style={{ width: 280 }}
							>
								<View className="relative">
									{/* Video Thumbnail */}
									<VideoThumbnail videoKey={video.key} className="w-full h-40" />

									{/* Play Overlay */}
									<View className="absolute inset-0 justify-center items-center bg-black/30 rounded-lg">
										<View className="bg-red-600 rounded-full p-3">
											<MaterialIcons name="play-arrow" size={32} color="white" />
										</View>
									</View>

									{/* Video Type Badge */}
									<View className="absolute top-2 right-2 bg-black/70 px-2 py-1 rounded">
										<Text className="text-white text-xs font-semibold">
											{video.type.toUpperCase()}
										</Text>
									</View>

									{/* Official Badge */}
									{video.official && (
										<View className="absolute top-2 left-2 bg-green-600 px-2 py-1 rounded">
											<Text className="text-white text-xs font-semibold">OFFICIAL</Text>
										</View>
									)}
								</View>

								{/* Video Title */}
								<Text
									className="text-white text-sm mt-2 font-medium"
									numberOfLines={2}
									style={{ lineHeight: 18 }}
								>
									{video.name}
								</Text>

								{/* Video Meta */}
								<Text className="text-gray-400 text-xs mt-1">
									{video.site} • {new Date(video.published_at).getFullYear()}
								</Text>
							</Pressable>
						))}
					</ScrollView>
				</View>
			)}

			{/* Videos Loading State */}
			{/* {videosLoading && (
				<View className="mt-6">
					<Text className="text-white text-lg font-semibold mb-3">Videos & Trailers</Text>
					<ActivityIndicator size="large" color="#ffffff" />
				</View>
			)} */}
		</>
	);
};

export default MovieVideos;
