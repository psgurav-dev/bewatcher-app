import React, { useTransition } from 'react';
import { View, Text, Pressable, Alert, ActivityIndicator } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { moviePayload } from '@/constants/types';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { useRouter } from 'expo-router';
import { useAuth } from '@clerk/clerk-expo';


// Redux actions
import {
	addToFavourites,
	removeFromFavourites,
	addToWatchlist as addToWatchlistStore,
	removeFromWatchlist as removeFromWatchlistStore,
} from '@/store/slices/moviesSlice';
import { findMovieInCollection } from '@/utils/movies';

interface PropsTypes {
	id: number | string;
	moviePayload: moviePayload;
}



const CollectionButtons: React.FC<PropsTypes> = ({ id, moviePayload }) => {
	const dispatch = useAppDispatch();
	const router = useRouter();
	const { userId } = useAuth();
	const { favourites, watchlist } = useAppSelector((state) => state.movies);

	const isFavorite = findMovieInCollection(favourites, id) !== undefined;
	const isInWatchlist = findMovieInCollection(watchlist, id) !== undefined;

	const [isFavoritePending, startTransitionFavorite] = useTransition();
	const [isWatchlistPending, startTransitionWatchlist] = useTransition();

	const handleToggleFavorite = async () => {
		if (!userId) {
			router.push('/(auth)/login');
			return;
		}

		startTransitionFavorite(() => {
			if (isFavorite) {
				dispatch(removeFromFavourites(Number(id)));
			} else {
				dispatch(addToFavourites(moviePayload));
			}
		});
	}

	const handleToggleWatchlist = async () => {
		if (!userId) {
			router.push('/(auth)/login');
			return;
		}
		startTransitionWatchlist(() => {
			if (isInWatchlist) {
				dispatch(removeFromWatchlistStore(Number(id)));
			} else {
				dispatch(addToWatchlistStore(moviePayload));
			}
		});


	};

	return (
		<View>
			<View className="flex-row gap-4 mt-6">
				<Pressable
					onPress={handleToggleFavorite}
					className={`flex-1 py-3 rounded-xl items-center ${isFavorite ? 'bg-red-600' : 'bg-gray-700'}`}
					disabled={isFavoritePending}
				>
					<View className="flex-row items-center">
						{isFavoritePending ? (
							<ActivityIndicator size="small" color="white" />
						) : (
							<FontAwesome name={isFavorite ? 'heart' : 'heart-o'} size={20} color="white" />
						)}
						<Text className="text-white ml-2 font-medium">{isFavorite ? 'Favourites' : 'Favourites'}</Text>
					</View>
				</Pressable>

				<Pressable
					onPress={handleToggleWatchlist}
					className={`flex-1 py-3 rounded-xl items-center ${isInWatchlist ? 'bg-blue-600' : 'bg-gray-700'}`}
					disabled={isWatchlistPending}
				>
					<View className="flex-row items-center">
						{isWatchlistPending ? (
							<ActivityIndicator size="small" color="white" />
						) : (
							<FontAwesome name={isInWatchlist ? 'bookmark' : 'bookmark-o'} size={20} color="white" />
						)}
						<Text className="text-white ml-2 font-medium">{isInWatchlist ? 'Watchlist' : 'Watchlist'}</Text>
					</View>
				</Pressable>
			</View>
		</View>
	);
};

export default CollectionButtons;