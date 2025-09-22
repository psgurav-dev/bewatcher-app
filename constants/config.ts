
export const MOVIE_DB_API_KEY = process.env.EXPO_PUBLIC_MOVIE_DB_API_KEY || "";
// export const MOVIE_DB_API_KEY = process.env.NATIVE_PUBLIC_MOVIE_DB_API_KEY || "";

export const MOVIE_DB_BASE_URL = "https://api.themoviedb.org/3";
export const TMDB_API_OPTIONS = {
	method : "GET",
	headers: {
		"Content-Type": "application/json;charset=utf-8",
		// "Authorization": `Bearer ${MOVIE_DB_API_KEY}`
	}
}