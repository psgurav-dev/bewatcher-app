
export const MOVIE_DB_API_KEY = process.env.EXPO_PUBLIC_MOVIE_DB_API_KEY || "";
// export const MOVIE_DB_API_KEY = process.env.NATIVE_PUBLIC_MOVIE_DB_API_KEY || "";
export const APPWRITE_ENDPOINT = process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT || "";
export const APPWRITE_PROJECT_ID = process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID || "";
export const EXPO_PRO = process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID || "";
export const EXPO_CLERK_KEY = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY
export const MOVIE_DB_BASE_URL = "https://api.themoviedb.org/3";
export const TMDB_API_OPTIONS = {
	method : "GET",
	headers: {
		"Content-Type": "application/json;charset=utf-8",
		// "Authorization": `Bearer ${MOVIE_DB_API_KEY}`
	}
}