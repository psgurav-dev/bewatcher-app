import { MOVIE_DB_API_KEY, MOVIE_DB_BASE_URL } from '@/constants/config';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Movie, MovieCredits } from '../types';
import { getUserWatchlist } from '@/lib/appwrite';
import { moviePayload } from '@/constants/types';
import { getUserFavourites } from '@/lib/appwrite/mutations';

interface MoviesState {
  popularMovies: Movie[];
  popularLoading: boolean;
  popularError: string | null;

  trendingMovies: Movie[];
  trendingLoading: boolean;
  trendingError: string | null;

  selectedMovie: Movie | null;
  movieCredits: { [movieId: number]: MovieCredits };
  creditsLoading: { [movieId: number]: boolean };
  creditsError: { [movieId: number]: string | null };

  searchResults: Movie[];
  searchLoading: boolean;
  searchError: string | null;
  searchQuery: string;

  favourites: moviePayload[];
  favouritesLoading: boolean;
  favouritesError: string | null;

  watchlist: moviePayload[];
  watchlistLoading: boolean;
  watchlistError: string | null;
}



// Initial state
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

  favourites: [],
	favouritesLoading: false,
	favouritesError: null,

  watchlist: [],
  watchlistLoading: false,
  watchlistError: null,
};


export const fetchSearchQuery = createAsyncThunk(
  'movies/searchQuery',
  async ({ query, page = 1 }: { query: string; page?: number }, { rejectWithValue }) => {
    try {
      if (!query || query.trim() === '') return [];

      const url = new URL(`${MOVIE_DB_BASE_URL}/search/movie`);
      url.searchParams.append('api_key', MOVIE_DB_API_KEY);
      url.searchParams.append('language', 'en-US');
      url.searchParams.append('query', query);
      url.searchParams.append('page', page.toString());
      url.searchParams.append('include_adult', 'false');

      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const data = await response.json();
      return data.results as Movie[];
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to search movies');
    }
  }
);


// Async thunks
export const fetchPopularMovies = createAsyncThunk(
  'movies/fetchPopular',
  async (page: number = 1, { rejectWithValue }) => {
    try {
      const url = new URL(`${MOVIE_DB_BASE_URL}/movie/popular`);
      url.searchParams.append('api_key', MOVIE_DB_API_KEY);
      url.searchParams.append('language', 'en-US');
      url.searchParams.append('page', page.toString());
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();

      return data.results as Movie[];
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to fetch popular movies');
    }
  }
);

export const fetchTrendingMovies = createAsyncThunk(
  'movies/fetchTrending',
  async (_, { rejectWithValue }) => {
    try {
      const url = new URL(`${MOVIE_DB_BASE_URL}/trending/movie/day`);
      url.searchParams.append('api_key', MOVIE_DB_API_KEY);
      url.searchParams.append('language', 'en-US');
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      return data.results as Movie[];
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to fetch trending movies');
    }
  }
);

// Fetch watchlist from Appwrite
export const fetchUserWatchlist = createAsyncThunk(
  'movies/fetchUserWatchlist',
  async (userId: string, { rejectWithValue }) => {
    try {
      if (!userId) throw new Error('No userId provided');
      const data = await getUserWatchlist(userId);
      return data as moviePayload[];
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch watchlist');
    }
  }
);

export const fetchUserFavourites = createAsyncThunk(
	'movies/fetchUserFavourites',
	async (userId: string, { rejectWithValue }) => {
		try {
			if (!userId) throw new Error('No userId provided');
			const data = await getUserFavourites(userId);
			return data as moviePayload[];
		} catch (error: any) {
			return rejectWithValue(error.message || 'Failed to fetch favourites');
		}
	}
);




const moviesSlice = createSlice({
  name: 'movies',
  initialState,
  reducers: {
    
    setSelectedMovie: (state, action: PayloadAction<Movie | null>) => {
      state.selectedMovie = action.payload;
    },

    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },

    clearSearch: (state) => {
      state.searchResults = [];
      state.searchQuery = '';
      state.searchError = null;
    },

    addToFavourites: (state, action: PayloadAction<moviePayload>) => {
      const exists = state.favourites.find(f => f.movieId === action.payload.movieId);
      if (!exists) state.favourites.push(action.payload);
    },

    removeFromFavourites: (state, action: PayloadAction<number>) => {
      state.favourites = state.favourites.filter(f => f.movieId !== action.payload);
    },

    addToWatchlist: (state, action: PayloadAction<moviePayload>) => {
      const exists = state.watchlist.find(w => w.movieId === action.payload.movieId);
      if (!exists) state.watchlist.push(action.payload);
    },

		removeFromWatchlist: (state, action: PayloadAction<number>) => {
			state.watchlist = state.watchlist.filter(w => w.movieId !== action.payload);
		},

    clearErrors: (state) => {
      state.popularError = null;
      state.trendingError = null;
      state.searchError = null;
      state.watchlistError = null;
      state.favouritesError = null;
    },

    resetStore: (state) => {
      // reset all state except popularMovies and tredingMovies
      state.watchlist = []
      state.favourites = []
      
    },
    
  },

  extraReducers: (builder) => {
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


      .addCase(fetchUserWatchlist.pending, (state) => {
        state.watchlistLoading = true;
        state.watchlistError = null;
      })
      .addCase(fetchUserWatchlist.fulfilled, (state, action) => {
        state.watchlistLoading = false;
        state.watchlist = action.payload;
      })
      .addCase(fetchUserWatchlist.rejected, (state, action) => {
        state.watchlistLoading = false;
        state.watchlistError = action.payload as string;
      })

		
			.addCase(fetchUserFavourites.pending, (state) => {
				state.favouritesLoading = true;
				state.favouritesError = null;
			})
			.addCase(fetchUserFavourites.fulfilled, (state, action) => {
				state.favouritesLoading = false;
				state.favourites = action.payload;
			})
			.addCase(fetchUserFavourites.rejected, (state, action) => {
				state.favouritesLoading = false;
				state.favouritesError = action.payload as string;
			})


      .addCase(fetchSearchQuery.pending, (state) => {
        state.searchLoading = true;
        state.searchError = null;
      })
      .addCase(fetchSearchQuery.fulfilled, (state, action) => {
        state.searchLoading = false;
        state.searchResults = action.payload;
      })
      .addCase(fetchSearchQuery.rejected, (state, action) => {
        state.searchLoading = false;
        state.searchError = action.payload as string;
      });
  },
});

export const {
  setSelectedMovie,
  setSearchQuery,
  clearSearch,
  addToFavourites,
  removeFromFavourites,
  addToWatchlist,
  removeFromWatchlist,
  clearErrors,
  resetStore
} = moviesSlice.actions;

export default moviesSlice.reducer;
