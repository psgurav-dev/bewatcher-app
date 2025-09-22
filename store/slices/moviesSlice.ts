import { MOVIE_DB_API_KEY, MOVIE_DB_BASE_URL } from '@/constants/config';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Movie, MovieCredits } from '../types';

interface MoviesState {
	// Popular movies
	popularMovies: Movie[];
	popularLoading: boolean;
	popularError: string | null;

	// Trending movies
	trendingMovies: Movie[];
	trendingLoading: boolean;
	trendingError: string | null;

	// Movie details and credits
	selectedMovie: Movie | null;
	movieCredits: { [movieId: number]: MovieCredits };
	creditsLoading: { [movieId: number]: boolean };
	creditsError: { [movieId: number]: string | null };

	// Search
	searchResults: Movie[];
	searchLoading: boolean;
	searchError: string | null;
	searchQuery: string;

	// Favorites (stored locally)
	favorites: number[];

	// Watchlist
	watchlist: number[];
}

const initialState: MoviesState = {
	popularMovies: [],
	popularLoading: false,
	popularError: null,

	trendingMovies: [],
	trendingLoading: false,
	trendingError: null,

	selectedMovie: null,
	movieCredits: {},
	creditsLoading: {},
	creditsError: {},

	searchResults: [],
	searchLoading: false,
	searchError: null,
	searchQuery: '',

	favorites: [],
	watchlist: [],
};

// export const fetchMovieDetails = createAsyncThunk(
// 	'movie/movieDetails',
// 	async (id: string, { rejectWithValue }) => {
// 		try {
// 			const url = new URL(`${MOVIE_DB_BASE_URL}/movie/${id}`);
// 			url.searchParams.append('api_key', MOVIE_DB_API_KEY);
// 			url.searchParams.append('language', 'en-US');
// 			url.searchParams.append(
// 				'append_to_response',
// 				'videos,credits,images,similar,recommendations',
// 			);

// 			const response = await fetch(url);
// 			if (!response.ok) {
// 				throw new Error(`HTTP error! status: ${response.status}`);
// 			}
//       const data = await response.json()
//       return data as Movie
// 		} catch (error) {
//       return rejectWithValue(
// 				error instanceof Error ? error.message : 'Failed to fetch movie details.',
// 			);
//     }
// 	},
// );

// Async thunks for API calls
export const fetchPopularMovies = createAsyncThunk(
	'movies/fetchPopular',
	async (page: number = 1, { rejectWithValue }) => {
		try {
			const url = new URL(`${MOVIE_DB_BASE_URL}/movie/popular`);
			url.searchParams.append('api_key', MOVIE_DB_API_KEY);
			url.searchParams.append('language', 'en-US');
			url.searchParams.append('page', page.toString());

			const response = await fetch(url);
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}
			const data = await response.json();
			return data.results as Movie[];
		} catch (error) {
			return rejectWithValue(
				error instanceof Error ? error.message : 'Failed to fetch popular movies',
			);
		}
	},
);

export const fetchTrendingMovies = createAsyncThunk(
	'movies/fetchTrending',
	async (_, { rejectWithValue }) => {
		try {
			const url = new URL(`${MOVIE_DB_BASE_URL}/trending/movie/day`);
			url.searchParams.append('api_key', MOVIE_DB_API_KEY);
			url.searchParams.append('language', 'en-US');

			const response = await fetch(url);
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}
			const data = await response.json();
			return data.results as Movie[];
		} catch (error) {
			return rejectWithValue(
				error instanceof Error ? error.message : 'Failed to fetch trending movies',
			);
		}
	},
);

// export const fetchMovieCredits = createAsyncThunk(
// 	'movies/fetchCredits',
// 	async (movieId: number, { rejectWithValue }) => {
// 		try {
// 			const url = new URL(`${MOVIE_DB_BASE_URL}/movie/${movieId}/credits`);
// 			url.searchParams.append('api_key', MOVIE_DB_API_KEY);

// 			const response = await fetch(url);
// 			if (!response.ok) {
// 				throw new Error(`HTTP error! status: ${response.status}`);
// 			}
// 			const data = await response.json();
// 			return { movieId, credits: data as MovieCredits };
// 		} catch (error) {
// 			return rejectWithValue({
// 				movieId,
// 				error: error instanceof Error ? error.message : 'Failed to fetch movie credits',
// 			});
// 		}
// 	},
// );

export const searchMovies = createAsyncThunk(
	'movies/search',
	async (query: string, { rejectWithValue }) => {
		try {
			if (!query.trim()) {
				return [];
			}

			const url = new URL(`${MOVIE_DB_BASE_URL}/search/movie`);
			url.searchParams.append('api_key', MOVIE_DB_API_KEY);
			url.searchParams.append('language', 'en-US');
			url.searchParams.append('query', query);
			url.searchParams.append('page', '1');

			const response = await fetch(url);
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}
			const data = await response.json();
			return data.results as Movie[];
		} catch (error) {
			return rejectWithValue(error instanceof Error ? error.message : 'Failed to search movies');
		}
	},
);

const moviesSlice = createSlice({
	name: 'movies',
	initialState,
	reducers: {
		setSelectedMovie: (state, action: PayloadAction<Movie | null>) => {
			state.selectedMovie = action.payload;
		},

		clearSearch: (state) => {
			state.searchResults = [];
			state.searchQuery = '';
			state.searchError = null;
		},

		setSearchQuery: (state, action: PayloadAction<string>) => {
			state.searchQuery = action.payload;
		},

		addToFavorites: (state, action: PayloadAction<number>) => {
			if (!state.favorites.includes(action.payload)) {
				state.favorites.push(action.payload);
			}
		},

		removeFromFavorites: (state, action: PayloadAction<number>) => {
			state.favorites = state.favorites.filter((id) => id !== action.payload);
		},

		addToWatchlist: (state, action: PayloadAction<number>) => {
			if (!state.watchlist.includes(action.payload)) {
				state.watchlist.push(action.payload);
			}
		},

		removeFromWatchlist: (state, action: PayloadAction<number>) => {
			state.watchlist = state.watchlist.filter((id) => id !== action.payload);
		},

		clearErrors: (state) => {
			state.popularError = null;
			state.trendingError = null;
			state.searchError = null;
		},
	},

	extraReducers: (builder) => {
		// Popular movies
		builder
			.addCase(fetchPopularMovies.pending, (state) => {
				state.popularLoading = true;
				state.popularError = null;
			})
			.addCase(fetchPopularMovies.fulfilled, (state, action) => {
				state.popularLoading = false;
				state.popularMovies = action.payload;
			})
			.addCase(fetchPopularMovies.rejected, (state, action) => {
				state.popularLoading = false;
				state.popularError = action.payload as string;
			})

			// Trending movies
			.addCase(fetchTrendingMovies.pending, (state) => {
				state.trendingLoading = true;
				state.trendingError = null;
			})
			.addCase(fetchTrendingMovies.fulfilled, (state, action) => {
				state.trendingLoading = false;
				state.trendingMovies = action.payload;
			})
			.addCase(fetchTrendingMovies.rejected, (state, action) => {
				state.trendingLoading = false;
				state.trendingError = action.payload as string;
			})

			// Movie credits
			// .addCase(fetchMovieCredits.pending, (state, action) => {
			// 	const movieId = action.meta.arg;
			// 	state.creditsLoading[movieId] = true;
			// 	state.creditsError[movieId] = null;
			// })
			// .addCase(fetchMovieCredits.fulfilled, (state, action) => {
			// 	const { movieId, credits } = action.payload;
			// 	state.creditsLoading[movieId] = false;
			// 	state.movieCredits[movieId] = credits;
			// })
			// .addCase(fetchMovieCredits.rejected, (state, action) => {
			// 	const { movieId, error } = action.payload as { movieId: number; error: string };
			// 	state.creditsLoading[movieId] = false;
			// 	state.creditsError[movieId] = error;
			// })

			// Search movies
			.addCase(searchMovies.pending, (state) => {
				state.searchLoading = true;
				state.searchError = null;
			})
			.addCase(searchMovies.fulfilled, (state, action) => {
				state.searchLoading = false;
				state.searchResults = action.payload;
			})
			.addCase(searchMovies.rejected, (state, action) => {
				state.searchLoading = false;
				state.searchError = action.payload as string;
			});
	},
});

export const {
	setSelectedMovie,
	clearSearch,
	setSearchQuery,
	addToFavorites,
	removeFromFavorites,
	addToWatchlist,
	removeFromWatchlist,
	clearErrors,
} = moviesSlice.actions;

export default moviesSlice.reducer;
