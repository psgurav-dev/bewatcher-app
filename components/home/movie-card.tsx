import { Movie } from '@/constants/types';
import { useRouter } from 'expo-router';

import React from 'react';
import { Dimensions, Image, Pressable, Text, View } from 'react-native';
const itemWidth = Dimensions.get('window').width / 3;

const MovieCard = ({ item }: { item: Movie }) => {
	const router = useRouter()


	return (
		<Pressable onPress={() => router.push(`/movie/${item.id}`)}>
			<View
				style={{ width: itemWidth - 2, padding: 8, borderColor: '#D1D5DB' }}
				className="rounded-md"
			>
				<Image
					source={{
						uri: item.poster_path
							? `https://image.tmdb.org/t/p/w500${item.poster_path}`
							: 'https://via.placeholder.com/150',
					}}
					style={{
						width: '100%',
						height: 150,
						borderRadius: 8,
						marginBottom: 8,
					}}
					resizeMode="cover"
				/>

				<Text className="text-base font-montserrat font-bold text-secondary-palette-100">
					{item.title}
				</Text>
			</View>
		</Pressable>
	);
};

export default MovieCard;
