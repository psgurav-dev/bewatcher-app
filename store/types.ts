export interface Movie {
	id: number;
	title: string;
	overview: string;
	poster_path: string | undefined;
	backdrop_path: string | undefined;
	release_date: string;
	vote_average: number;
	genre_ids: number[];
	original_language: string;
}

export interface MovieCredits {
	cast: Actor[];
	crew: CrewMember[];
}

export interface Actor {
	id: number;
	name: string;
	character: string;
	profile_path: string | null;
}

export interface CrewMember {
	id: number;
	name: string;
	job: string;
	profile_path: string | null;
}
