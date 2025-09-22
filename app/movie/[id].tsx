import MovieDetails from '@/components/home/movie-details';
import { movies_data } from '@/constants/sample-data';
import { Movie } from '@/constants/types';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';


const MovieDetailScreen = () => {
	const { id } = useLocalSearchParams()
	const item: Movie | undefined = movies_data.find(movie => movie.id === Number(id));

	return (
		item ? <MovieDetails item={item} /> : null
	)
}

export default MovieDetailScreen