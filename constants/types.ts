import { MovieCredits } from '@/store/types';

interface genres {
	id: number;
	name: string;
}
export interface MovieVideo {
	id: string;
	iso_639_1: string;
	iso_3166_1: string;
	name: string;
	key: string;
	site: string;
	size: number;
	type: string;
	official: boolean;
	published_at: string;
}
export interface MovieVideosResponse {
	id: number;
	results: MovieVideo[];
}
export type Movie = {
	id: number;
	title: string;
	release_date: string;
	overview?: string;
	poster_path?: string;
	backdrop_path?: string;
	genres?: genres[];
	original_language?: string;
	vote_average?: number;
	vote_count?: number;
	popularity?: number;
	director?: string;
	credits?: MovieCredits | undefined;
	videos?: MovieVideosResponse;
};
