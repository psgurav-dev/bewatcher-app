import { moviePayload } from "@/constants/types";

export const findMovieInCollection = (
	collection: moviePayload[],
	movieId: number | string
): moviePayload | undefined => {
	return collection.find((item) => item.movieId === Number(movieId));
};
