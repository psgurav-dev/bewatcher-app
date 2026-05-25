import { DATABASE_ID, FAVOURITES_COLLECTION_ID } from "@/constants/dbConfig";
import { moviePayload } from "@/constants/types";

import { ID, Query } from "appwrite";
import { databases } from "../appwrite";

interface FavouritesDocument extends moviePayload {
	$id: string;
	$createdAt: string;
	$updatedAt: string;
	userId: string;
}

const ERROR_MESSAGES = {
	ALREADY_IN_FAVOURITES: 'Movie is already in your favourites.',
	NOT_IN_FAVOURITES: 'Movie is not in your favourites.',
	FAILED_TO_ADD: 'Failed to add movie to favourites.',
	FAILED_TO_REMOVE: 'Failed to remove movie from favourites.',
	FAILED_TO_FETCH: 'Failed to fetch favourites.',
};

const checkIfInFavourites = async (userId: string, movieId: number): Promise<boolean> => {
	try {
		const response = await databases.listDocuments(
			DATABASE_ID,
			FAVOURITES_COLLECTION_ID,
			[
				Query.equal('userId', userId),
				Query.equal('movieId', movieId),
			]
		);
		return response.documents.length > 0;
	} catch (error) {
		console.error('Error checking favourites:', error);
		return false;
	}
}
export const addToFavouritesList = async (userId: string, movieData: moviePayload): Promise<FavouritesDocument> => {
	try {
		const existing = await checkIfInFavourites(userId, movieData.movieId);
		if (existing) {
			throw new Error(ERROR_MESSAGES.ALREADY_IN_FAVOURITES);
		}
		const document = await databases.createDocument(
			DATABASE_ID,
			FAVOURITES_COLLECTION_ID,
			ID.unique(),
			{
				userId,
				...movieData,
				addedDate: new Date().toISOString(),
			}
		);

		return document as unknown as FavouritesDocument;
	} catch (error: any) {
		console.error('Error adding to favourites:', error);
		throw new Error(error.message || ERROR_MESSAGES.FAILED_TO_ADD);
	}
};

export const removeFromFavouritesList = async (userId: string, movieId: number): Promise<boolean> => {
	try {
		const response = await databases.listDocuments(
			DATABASE_ID,
			FAVOURITES_COLLECTION_ID,
			[
				Query.equal('userId', userId),
				Query.equal('movieId', movieId),
			]
		);

		if (response.documents.length === 0) {
			throw new Error(ERROR_MESSAGES.NOT_IN_FAVOURITES);
		}

		const docId = response.documents[0].$id;

		await databases.deleteDocument(
			DATABASE_ID,
			FAVOURITES_COLLECTION_ID,
			docId
		);

		return true;
	} catch (error: any) {
		console.error('Error removing from favourites:', error);
		throw new Error(error.message || ERROR_MESSAGES.FAILED_TO_REMOVE);
	}
};

export const getUserFavourites = async (userId: string): Promise<FavouritesDocument[]> => {
	try {
		const response = await databases.listDocuments(
			DATABASE_ID,
			FAVOURITES_COLLECTION_ID,
			[
				Query.equal('userId', userId),
				Query.orderDesc('addedDate'),
			]
		);
		return response.documents as unknown as FavouritesDocument[];
	} catch (error) {
		console.error('Error fetching favourites:', error);
		throw new Error(ERROR_MESSAGES.FAILED_TO_FETCH);
	}
};