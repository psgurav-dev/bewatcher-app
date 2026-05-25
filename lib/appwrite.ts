	import { APPWRITE_ENDPOINT } from '@/constants/config';
import { APPWRITE_PROJECT_ID, DATABASE_ID , WATCHLIST_COLLECTION_ID } from '@/constants/dbConfig';
import { Account, Client, Databases, ID, Query } from 'appwrite';

// Appwrite configuration


// Error messages
const ERROR_MESSAGES = {
  ALREADY_IN_WATCHLIST: 'Movie already in watchlist',
  NOT_IN_WATCHLIST: 'Movie not found in watchlist',
  FAILED_TO_ADD: 'Failed to add movie to watchlist',
  FAILED_TO_REMOVE: 'Failed to remove from watchlist',
  FAILED_TO_FETCH: 'Failed to fetch watchlist',
  FAILED_TO_UPDATE: 'Failed to update watchlist item',
  NOT_AUTHENTICATED: 'User is not authenticated'
};

// Initialize Appwrite client
const client = new Client()
  .setEndpoint(APPWRITE_ENDPOINT)
  .setProject(APPWRITE_PROJECT_ID);

const account = new Account(client);

// Set JWT token for authentication
export const setSession = async (token: string | null) => {
  if (token) {
    client.setJWT(token);
  } else {
    // Clear the session if no token is provided
    client.setJWT('');
  }
};

const databases = new Databases(client);

// Types
interface MovieData {
  movieId: number;
  title: string;
  posterPath?: string;
  backdropPath?: string;
  releaseDate?: string;
  voteAverage?: number;
  overview?: string;
}

interface WatchlistDocument extends MovieData {
  $id: string;
  $createdAt: string;
  $updatedAt: string;
  userId: string;
}

/**
 * Add a movie to the user's watchlist
 * @param movieData - Movie information to save
 * @returns Promise with the created document
 */
export const addToWatchlist = async (userId: string, movieData: MovieData): Promise<WatchlistDocument> => {
  try {
    // Check if movie already exists in user's watchlist
    const existing = await checkIfInWatchlist(userId, movieData.movieId);
    
    if (existing) {
      throw new Error(ERROR_MESSAGES.ALREADY_IN_WATCHLIST);
    }

    const document = await databases.createDocument(
      DATABASE_ID,
      WATCHLIST_COLLECTION_ID,
      ID.unique(),
      {
        userId,
        ...movieData,
        addedDate: new Date().toISOString(),
      }
    );

    return document as unknown as WatchlistDocument;
  } catch (error: any) {
    console.error('Error adding to watchlist:', error);
    throw new Error(error.message || ERROR_MESSAGES.FAILED_TO_ADD);
  }
};

/**
 * Remove a movie from the user's watchlist
 * @param userId - The ID of the user
 * @param movieId - The movie ID to remove
 * @returns Promise with boolean indicating success
 */
export const removeFromWatchlist = async (userId: string, movieId: number): Promise<boolean> => {
  try {
    // Find the document
    const response = await databases.listDocuments(
      DATABASE_ID,
      WATCHLIST_COLLECTION_ID,
      [
        Query.equal('userId', userId),
        Query.equal('movieId', movieId),
      ]
    );

    if (response.documents.length === 0) {
      throw new Error(ERROR_MESSAGES.NOT_IN_WATCHLIST);
    }

    // Delete the document
    await databases.deleteDocument(
      DATABASE_ID,
      WATCHLIST_COLLECTION_ID,
      response.documents[0].$id
    );

    return true;
  } catch (error: any) {
    console.error('Error removing from watchlist:', error);
    throw new Error(error.message || ERROR_MESSAGES.FAILED_TO_REMOVE);
  }
};

/**
 * Get all movies in user's watchlist
 * @param limit - Maximum number of items to return (default: 100)
 * @param offset - Number of items to skip (for pagination)
 * @returns Promise with array of watchlist items
 */
export const getUserWatchlist = async (
  userId: string,
  limit: number = 100,
  offset: number = 0
): Promise<WatchlistDocument[]> => {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      WATCHLIST_COLLECTION_ID,
      [
        Query.equal('userId', userId),
        Query.limit(limit),
        Query.offset(offset),
        Query.orderDesc('$createdAt'),
      ]
    );

    return response.documents as unknown as WatchlistDocument[];
  } catch (error: any) {
    console.error('Error fetching watchlist:', error);
    throw new Error(error.message || ERROR_MESSAGES.FAILED_TO_FETCH);
  }
};

/**
 * Check if a movie is in user's watchlist
 * @param userId - The ID of the user
 * @param movieId - The movie ID to check
 * @returns Promise with boolean indicating if movie is in watchlist
 */
export const checkIfInWatchlist = async (
  userId: string,
  movieId: number
): Promise<boolean> => {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      WATCHLIST_COLLECTION_ID,
      [
        Query.equal('userId', userId),
        Query.equal('movieId', movieId),
        Query.limit(1),
      ]
    );

    return response.documents.length > 0;
  } catch (error: any) {
    console.error('Error checking watchlist:', error);
    return false;
  }
};

/**
 * Get watchlist count for a user
 * @param userId - The ID of the user
 * @returns Promise with the count of items in watchlist
 */
export const getWatchlistCount = async (userId: string): Promise<number> => {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      WATCHLIST_COLLECTION_ID,
      [Query.equal('userId', userId), Query.limit(1)]
    );

    return response.total;
  } catch (error: any) {
    console.error('Error getting watchlist count:', error);
    return 0;
  }
};

/**
 * Clear entire watchlist for a user
 * @param userId - The ID of the user
 * @returns Promise with boolean indicating success
 */
export const clearWatchlist = async (userId: string): Promise<boolean> => {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      WATCHLIST_COLLECTION_ID,
      [Query.equal('userId', userId)]
    );

    // Delete all documents
    const deletePromises = response.documents.map((doc) =>
      databases.deleteDocument(DATABASE_ID, WATCHLIST_COLLECTION_ID, doc.$id)
    );

    await Promise.all(deletePromises);

    return true;
  } catch (error: any) {
    console.error('Error clearing watchlist:', error);
    throw new Error(error.message || 'Failed to clear watchlist');
  }
};

/**
 * Update movie details in watchlist
 * @param userId - The ID of the user
 * @param movieId - The movie ID to update
 * @param updates - Partial movie data to update
 * @returns Promise with updated document
 */
export const updateWatchlistItem = async (
  userId: string,
  movieId: number,
  updates: Partial<Omit<MovieData, 'movieId'>>
): Promise<WatchlistDocument> => {
  try {
    // Find the document
    const response = await databases.listDocuments(
      DATABASE_ID,
      WATCHLIST_COLLECTION_ID,
      [
        Query.equal('userId', userId),
        Query.equal('movieId', movieId),
      ]
    );

    if (response.documents.length === 0) {
      throw new Error(ERROR_MESSAGES.NOT_IN_WATCHLIST);
    }

    // Update the document
    const updated = await databases.updateDocument(
      DATABASE_ID,
      WATCHLIST_COLLECTION_ID,
      response.documents[0].$id,
      updates
    );

    return updated as unknown as WatchlistDocument;
  } catch (error: any) {
    console.error('Error updating watchlist item:', error);
    throw new Error(error.message || ERROR_MESSAGES.FAILED_TO_UPDATE);
  }
};

// Export the client and databases instance for direct use if needed
export { client, databases, account };