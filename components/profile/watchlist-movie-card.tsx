import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';

interface WatchlistMovieCardProps {
  item: any;
  isWatchlist?: boolean;
  onView?: (movieId: number) => void;
  onRemove?: (id: string) => void;
}

export const WatchlistMovieCard: React.FC<WatchlistMovieCardProps> = ({
  item,
  isWatchlist = true,
  onView,
  onRemove,
}) => {
  const getImageUrl = (path: string) => {
    return `https://image.tmdb.org/t/p/w500${path}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getPriorityColor = (priority?: number) => {
    switch (priority) {
      case 1:
        return { bg: 'bg-red-500', text: 'text-white' };
      case 2:
        return { bg: 'bg-yellow-500', text: 'text-secondary-palette-600' };
      case 3:
        return { bg: 'bg-green-500', text: 'text-white' };
      default:
        return { bg: 'bg-primary-base', text: 'text-secondary-palette-600' };
    }
  };

  const priorityColors = getPriorityColor(item.priority);

  return (
    <TouchableOpacity
      className="bg-white/5 rounded-2xl mb-4 border border-white/10 overflow-hidden"
      activeOpacity={0.7}
      onPress={() => onView?.(item.movieId)}
    >
      <View className="flex-row">
        {/* Movie Poster */}
        <View className="relative">
          <Image
            source={{ uri: getImageUrl(item.posterPath) }}
            style={{
              width: 110,
              height: 165,
              borderTopLeftRadius: 16,
              borderBottomLeftRadius: 16,
            }}
            resizeMode="cover"
          />
          {/* Priority Badge (for watchlist) */}
          {isWatchlist && item.priority && (
            <View className={`absolute top-2 left-2 ${priorityColors.bg} rounded-full px-2 py-1`}>
              <Text
                className={`${priorityColors.text} text-xs`}
                style={{ fontFamily: 'Manrope', fontWeight: '700' }}
              >
                P{item.priority}
              </Text>
            </View>
          )}
          
          {/* Watched Badge */}
          {item.watched && (
            <View className="absolute bottom-2 left-2 bg-green-500/90 rounded-full px-2 py-1">
              <Text
                className="text-white text-xs"
                style={{ fontFamily: 'Manrope', fontWeight: '700' }}
              >
                ✓ Watched
              </Text>
            </View>
          )}
        </View>

        {/* Movie Details */}
        <View className="flex-1 p-4 justify-between">
          <View>
            <Text
              className="text-secondary-palette-100 text-lg mb-2"
              style={{ fontFamily: 'Manrope', fontWeight: '700' }}
              numberOfLines={2}
            >
              {item.title}
            </Text>

            {/* Release Date */}
            <View className="flex-row items-center mb-2">
              <View className="w-1 h-1 rounded-full bg-primary-base mr-2" />
              <Text
                className="text-secondary-palette-100/70 text-xs"
                style={{ fontFamily: 'Manrope', fontWeight: '500' }}
              >
                {formatDate(item.releaseDate)}
              </Text>
            </View>

            {/* Added Date */}
            <Text
              className="text-secondary-palette-100/50 text-xs"
              style={{ fontFamily: 'Manrope', fontWeight: '400' }}
            >
              Added {formatDate(item.addedDate || item.$createdAt || '')}
            </Text>

            {/* Notes Preview */}
            {item.notes && (
              <View className="mt-2 bg-white/5 rounded-lg p-2">
                <Text
                  className="text-secondary-palette-100/60 text-xs"
                  style={{ fontFamily: 'Manrope', fontWeight: '400' }}
                  numberOfLines={2}
                >
                  📝 {item.notes}
                </Text>
              </View>
            )}
          </View>

          {/* Bottom Section */}
          <View className="flex-row items-center justify-between mt-2">
            {/* Movie ID Badge */}
            <View className="bg-white/5 rounded-lg px-2 py-1">
              <Text
                className="text-secondary-palette-100/60 text-xs"
                style={{ fontFamily: 'Manrope', fontWeight: '600' }}
              >
                #{item.movieId}
              </Text>
            </View>

            {/* Action Buttons */}
            <View className="flex-row gap-2">
              <TouchableOpacity
                className="bg-green-500/10 rounded-lg px-3 py-1.5 border border-green-500/20"
                activeOpacity={0.7}
                onPress={() => onView?.(item.movieId)}
              >
                <Text
                  className="text-green-400 text-xs"
                  style={{ fontFamily: 'Manrope', fontWeight: '600' }}
                >
                  View
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="bg-red-500/10 rounded-lg px-3 py-1.5 border border-red-500/20"
                activeOpacity={0.7}
                onPress={() => onRemove?.(item.$id)}
              >
                <Text
                  className="text-red-400 text-xs"
                  style={{ fontFamily: 'Manrope', fontWeight: '600' }}
                >
                  Remove
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

// Empty State Component
interface EmptyStateProps {
  type: 'favourites' | 'watchlist';
}

export const EmptyState: React.FC<EmptyStateProps> = ({ type }) => {
  return (
    <View className="bg-white/5 rounded-2xl p-12 border border-white/10 items-center">
      <View className="bg-white/5 rounded-full p-6 mb-4">
        <Text className="text-4xl">{type === 'favourites' ? '⭐' : '📺'}</Text>
      </View>
      <Text
        className="text-secondary-palette-100 text-lg mb-2"
        style={{ fontFamily: 'Manrope', fontWeight: '600' }}
      >
        Nothing here yet
      </Text>
      <Text
        className="text-secondary-palette-100/40 text-sm text-center"
        style={{ fontFamily: 'Manrope', fontWeight: '400' }}
      >
        Start adding movies to your {type === 'favourites' ? 'favourites' : 'watchlist'}
      </Text>
    </View>
  );
};