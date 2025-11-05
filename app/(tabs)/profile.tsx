import { useAuth, useClerk, useUser } from "@clerk/clerk-expo";
import { Redirect, useRouter } from "expo-router";
import { Text, View, TouchableOpacity, ActivityIndicator, Image, ScrollView } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';

import { WatchlistMovieCard } from "@/components/profile/watchlist-movie-card";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

import { fetchUserFavourites, fetchUserWatchlist, removeFromWatchlist, resetStore } from "@/store/slices/moviesSlice";


export default function ProfileScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();
  const { signOut } = useClerk();

  const [activeTab, setActiveTab] = useState<'favourites' | 'watchlist'>('watchlist');
  const { watchlist = [], favourites = [], watchlistLoading, favouritesLoading } = useAppSelector(state => state.movies);


  useEffect(() => {
    if (isLoaded && isSignedIn && user?.id) {
      dispatch(fetchUserWatchlist(String(user.id)));
      dispatch(fetchUserFavourites(String(user.id)));
    }
  }, [isLoaded, isSignedIn, user?.id]);


  if (!watchlist) {
    return (
      <View className="flex-1 items-center justify-center bg-[#0B0B0F]">
        <ActivityIndicator size="large" color="#4ADE80" />
      </View>
    );
  }
  if (watchlistLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-[#0B0B0F]">
        <ActivityIndicator size="large" color="#4ADE80" />
      </View>
    );
  }
  if (!isLoaded) {
    return (
      <View className="flex-1 items-center justify-center bg-[#0B0B0F]">
        <ActivityIndicator size="large" color="#4ADE80" />
      </View>
    );
  }



  if (!isSignedIn) return <Redirect href="/(auth)/login" />;

  const handleSignOut = async () => {
    try {
      await signOut();
      dispatch(resetStore());
      router.push('/(auth)/login');
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
    }
  };


  const currentList = activeTab === 'favourites' ? favourites : watchlist;

  return (
    <LinearGradient
      colors={['#157E94', '#0B0B0F']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ flex: 1 }}
    >
      <ScrollView className="flex-1" contentContainerStyle={{ flexGrow: 1 }}>
        {/* Header Section */}
        <View className="pt-16 pb-8 px-6">
          <Text
            className="text-secondary-palette-100 text-6xl"
            style={{ fontFamily: 'BricolageGrotesque', fontWeight: '500' }}
          >
            Profile
          </Text>
        </View>

        {/* Profile Card */}
        <View className="mx-6 mb-6">
          <View className="bg-white/5 rounded-2xl p-6 border border-white/10">
            {/* Avatar and Name */}
            <View className="items-center mb-6">
              <View className="relative">
                <Image
                  source={require('./avtaar_1.png')}

                  style={{
                    width: 100,
                    height: 100,
                    borderRadius: 50,
                    borderWidth: 3,
                    borderColor: '#4ADE80'
                  }}
                />
                <View
                  className="absolute bottom-1 right-1 bg-green-500 rounded-full"
                  style={{
                    width: 20,
                    height: 20,
                    borderWidth: 3,
                    borderColor: '#0B0B0F'
                  }}
                />
              </View>

              <Text
                className="text-secondary-palette-100 text-2xl mt-4"
                style={{ fontFamily: 'Manrope', fontWeight: '600' }}
              >
                {user?.firstName} {user?.lastName}
              </Text>

              <Text
                className="text-secondary-palette-100/60 text-sm mt-1"
                style={{ fontFamily: 'Manrope', fontWeight: '400' }}
              >
                {user?.primaryEmailAddress?.emailAddress}
              </Text>
            </View>

            {/* Divider */}
            <View className="h-px bg-white/10 mb-6" />
            {/* Sign Out Button */}
            <View className="px-6">
              <TouchableOpacity
                className="bg-red-500/10 rounded-xl py-4 px-6 border border-red-500/20"
                onPress={handleSignOut}
                activeOpacity={0.7}
              >
                <Text
                  className="text-red-400 text-base text-center"
                  style={{ fontWeight: '600', fontFamily: "Manrope" }}
                >
                  Sign Out
                </Text>
              </TouchableOpacity>
            </View>
            {/* Account Info */}
            {/* <View className="space-y-4">
              <View className="flex-row justify-between items-center py-3">
                <Text
                  className="text-secondary-palette-100/60 text-sm"
                  style={{ fontFamily: 'Manrope', fontWeight: '400' }}
                >
                  Account Status
                </Text>
                <View className="bg-green-500/20 px-3 py-1 rounded-full">
                  <Text
                    className="text-green-400 text-xs"
                    style={{ fontFamily: 'Manrope', fontWeight: '600' }}
                  >
                    Active
                  </Text>
                </View>
              </View>

              <View className="flex-row justify-between items-center py-3">
                <Text
                  className="text-secondary-palette-100/60 text-sm"
                  style={{ fontFamily: 'Manrope', fontWeight: '400' }}
                >
                  Member Since
                </Text>
                <Text
                  className="text-secondary-palette-100 text-sm"
                  style={{ fontFamily: 'Manrope', fontWeight: '500' }}
                >
                  {new Date(user?.createdAt || '').toLocaleDateString('en-US', {
                    month: 'short',
                    year: 'numeric'
                  })}
                </Text>
              </View>
            </View> */}
          </View>
        </View>

        {/* Tab Buttons */}
        <View className="mx-6 mb-4 ">
          <View className="bg-black rounded-xl p-1 flex-row border border-white/10">
            <TouchableOpacity
              className={`flex-1 py-3 rounded-lg ${activeTab === 'favourites' ? 'bg-primary-base' : ''}`}
              onPress={() => setActiveTab('favourites')}
              activeOpacity={0.7}
            >
              <Text
                className={`text-center text-sm ${activeTab === 'favourites' ? 'text-secondary-palette-600' : 'text-secondary-palette-100/60'}`}
                style={{ fontFamily: 'Manrope', fontWeight: '600' }}
              >
                Favourites {
                  favouritesLoading ? <ActivityIndicator size="small" color="#4ADE80" /> : favourites?.length
                }
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className={`flex-1 py-3 rounded-lg ${activeTab === 'watchlist' ? 'bg-primary-base' : ''}`}
              onPress={() => setActiveTab('watchlist')}
              activeOpacity={0.7}
            >
              <Text
                className={`text-center text-sm ${activeTab === 'watchlist' ? 'text-secondary-palette-600' : 'text-secondary-palette-100/60'}`}
                style={{ fontFamily: 'Manrope', fontWeight: '600' }}
              >
                Watchlist {
                  watchlistLoading ? <ActivityIndicator size="small" color="#4ADE80" /> : watchlist?.length
                }
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Content List */}
        <View className="mx-6 mb-6">
          {currentList?.length > 0 ? (
            currentList?.map((item: any) => (
              <WatchlistMovieCard key={item.movieId} item={item} onView={(movieId) => {
                router.push(`/movie/${movieId}`);
              }} onRemove={async (documentId) => {
                try {
                  dispatch(removeFromWatchlist(documentId));

                } catch (error) {
                  console.error('Error removing from watchlist:', error);
                }
              }} />
            ))
          ) : (
            <View className="bg-white/5 rounded-xl p-8 border border-white/10 items-center">
              <Text
                className="text-secondary-palette-100/40 text-base text-center"
                style={{ fontFamily: 'Manrope', fontWeight: '400' }}
              >
                No {activeTab === 'favourites' ? 'favourites' : 'items in watchlist'} yet
              </Text>
            </View>
          )}
        </View>



        {/* Bottom Spacing */}
        <View className="h-8" />
      </ScrollView>
    </LinearGradient>
  );
}