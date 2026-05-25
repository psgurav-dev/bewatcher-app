import React, { useCallback, useEffect } from 'react';
import {
	View,
	Text,
	TextInput,
	FlatList,
	Pressable,
	Image,
	ActivityIndicator,
	Dimensions,
	KeyboardAvoidingView,
	Platform,
} from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Animated, { FadeInDown,  Layout } from 'react-native-reanimated';

import { useDebounce } from '@/hooks/useDebounce';
import { useSelector } from 'react-redux';
import { fetchSearchQuery, setSearchQuery, clearSearch } from '@/store/slices/moviesSlice';
import { RootState } from '@/store';
import { useAppDispatch } from '@/store/hooks';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2;

const SearchScreen = () => {
	const router = useRouter()
	const dispatch = useAppDispatch();
	const { searchQuery, searchResults, searchLoading } = useSelector(
		(state: RootState) => state.movies
	);

	const debouncedSearchQuery = useDebounce(searchQuery, 500);

	useEffect(() => {
		if (debouncedSearchQuery.trim().length >= 2) {
			dispatch(fetchSearchQuery({ query: debouncedSearchQuery }));
		}
	}, [debouncedSearchQuery]);

	const handleSearch = useCallback((query: string) => {
		dispatch(setSearchQuery(query));
	}, []);

	const handleClearSearch = useCallback(() => {
		dispatch(clearSearch());
	}, []);

	const renderMovieCard = ({ item, index }: any) => (
		<Animated.View
			entering={FadeInDown.delay(index * 40).springify()}
			layout={Layout.springify()}
			className="mb-4"
			style={{ width: CARD_WIDTH }}
		>
			<Pressable
				className="bg-gray-900/50 rounded-2xl overflow-hidden border border-gray-800"
				onPress={() => router.push(`/movie/${item.id}`)}
			>
				<Image
					source={{
						uri: item.poster_path
							? `https://image.tmdb.org/t/p/w500${item.poster_path}`
							: 'https://via.placeholder.com/300x450/1a1a1a/666666?text=No+Poster',
					}}
					style={{ width: '100%', height: CARD_WIDTH * 1.5 }}
					resizeMode="cover"
				/>

				{/* {item.vote_average && (
					<View className="absolute top-2 right-2 bg-black/80 px-2 py-1 rounded-full flex-row items-center">
						<FontAwesome name="star" size={10} color="#FFD700" />
						<Text className="text-white text-xs font-bold ml-1">
							{(item.vote_average / 2).toFixed(1)}
						</Text>
					</View>
				)} */}

				<View className="p-3">
					<Text className="text-white font-semibold text-sm" numberOfLines={2}>
						{item.title}
					</Text>
					{item.release_date && (
						<Text className="text-gray-400 text-xs mt-1">
							{item.release_date.split('-')[0]}
						</Text>
					)}
				</View>
			</Pressable>
		</Animated.View>
	);

	return (
		<KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1 bg-[#131314]">
			<View className="px-5 pt-14 pb-4 bg-black/50">
				<Text className="text-white text-3xl font-bold mb-4">Search Movies</Text>

				<View className="flex-row items-center bg-gray-900/80 rounded-2xl px-4 py-3 border border-gray-800">
					<FontAwesome name="search" size={18} color="#9CA3AF" />
					<TextInput
						value={searchQuery}
						onChangeText={handleSearch}
						placeholder="Search for movies..."
						placeholderTextColor="#6B7280"
						className="flex-1 text-white ml-3"
					/>
					{searchQuery.length > 0 && (
						<Pressable onPress={handleClearSearch}>
							<FontAwesome name="times-circle" size={18} color="#6B7280" />
						</Pressable>
					)}
				</View>

				{searchResults.length > 0 && (
					<Text className="text-gray-400 text-sm mt-3">
						Found {searchResults.length} result{searchResults.length !== 1 ? 's' : ''}
					</Text>
				)}
			</View>

			{searchLoading ? (
				<View className="flex-1 items-center justify-center">
					<ActivityIndicator size="large" color="#FF4458" />
				</View>
			) : searchResults.length > 0 ? (
				<FlatList
					data={searchResults}
					renderItem={renderMovieCard}
					keyExtractor={(item) => item.id.toString()}
					numColumns={2}
					columnWrapperStyle={{ justifyContent: 'space-between', paddingHorizontal: 20 }}
					contentContainerStyle={{ paddingTop: 16, paddingBottom: 32 }}
					showsVerticalScrollIndicator={false}
				/>
			) : (
				<Text className="text-gray-500 text-center mt-10">No results found</Text>
			)}
		</KeyboardAvoidingView>
	);
};

export default SearchScreen;
