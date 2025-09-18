
import { movies_data } from '@/constants/sample-data';
import { Movie } from '@/constants/types';
import React from 'react';
import { FlatList, Text, View } from 'react-native';
import MovieCard from './movie-card';


const RenderItems = ({ item }: { item: Movie }) => {
	return <MovieCard item={item} />
}

const MoviesList = () => {
	return (

		<FlatList
			data={movies_data.map(movie => ({
				...movie,
				backdrop_path: movie.backdrop_path === null ? undefined : movie.backdrop_path,
			}))}
			keyExtractor={(item: Movie) => item.id.toString()}
			renderItem={({ item }: { item: Movie }) => (
				<RenderItems item={item} />
			)}
			nestedScrollEnabled={true}
			contentContainerStyle={{ paddingBottom: 25, marginTop: 10, gap: 6 }}
			showsVerticalScrollIndicator={false}
			ListEmptyComponent={() => (
				<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 16 }}>
					<Text style={{ color: '#6B7280' }}>No movies available.</Text>
				</View>
			)}
			numColumns={3}
		/>

	);
};



export default MoviesList

