import { MovieCredits } from '@/store/types';

interface genres {
	id: number;
	name: string;
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
};
