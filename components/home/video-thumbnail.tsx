// components/video-thumbnail.tsx
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import React, { useState } from 'react';
import { ActivityIndicator, Image, Text, View } from 'react-native';

interface VideoThumbnailProps {
  videoKey: string;
  className?: string;
  style?: any;
}

const VideoThumbnail: React.FC<VideoThumbnailProps> = ({ 
  videoKey, 
  className = "",
  style = {}
}) => {
  const [currentFallbackIndex, setCurrentFallbackIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // YouTube thumbnail URLs in order of preference (high to low quality)
  const thumbnailOptions = [
    `https://img.youtube.com/vi/${videoKey}/hqdefault.jpg`,     // 480x360 - most reliable
    `https://img.youtube.com/vi/${videoKey}/mqdefault.jpg`,     // 320x180 - always available
    `https://img.youtube.com/vi/${videoKey}/sddefault.jpg`,     // 640x480 - standard definition
    `https://img.youtube.com/vi/${videoKey}/default.jpg`,       // 120x90 - always available
    `https://i3.ytimg.com/vi/${videoKey}/hqdefault.jpg`,        // Alternative server
    `https://i3.ytimg.com/vi/${videoKey}/mqdefault.jpg`,        // Alternative server
  ];

  const handleImageError = () => {
    console.log(`Thumbnail failed for video ${videoKey}, trying fallback ${currentFallbackIndex + 1}`);
    
    if (currentFallbackIndex < thumbnailOptions.length - 1) {
      setCurrentFallbackIndex(prev => prev + 1);
      setIsLoading(true);
      setHasError(false);
    } else {
      // console.log(`All thumbnail options failed for video ${videoKey}`);
      setHasError(true);
      setIsLoading(false);
    }
  };

  const handleImageLoad = () => {
    // console.log(`Thumbnail loaded successfully for video ${videoKey}`);
    setIsLoading(false);
    setHasError(false);
  };

  const handleLoadStart = () => {
    setIsLoading(true);
  };

  if (hasError) {
    return (
      <View 
        className={`justify-center items-center bg-gray-800 rounded-lg ${className}`}
        style={style}
      >
        <MaterialIcons name="error-outline" size={24} color="#9CA3AF" />
        <Text className="text-gray-400 text-xs mt-1 text-center px-2">
          Thumbnail{'\n'}Unavailable
        </Text>
      </View>
    );
  }
  console.log(thumbnailOptions[currentFallbackIndex])
  return (
    <View className={`relative bg-gray-800 rounded-lg ${className}`} style={style}>
      <Image
        source={{ 
          uri: thumbnailOptions[currentFallbackIndex],
          cache: 'default' // Enable caching
        }}
        className="w-full h-full rounded-lg"
        resizeMode="cover"
        onError={handleImageError}
        onLoad={handleImageLoad}
        onLoadStart={handleLoadStart}
        // Add these props for better loading
        loadingIndicatorSource={{ uri: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7' }}
      />
      
      {isLoading && (
        <View className="absolute inset-0 justify-center items-center bg-gray-800 rounded-lg">
          <ActivityIndicator size="small" color="#9CA3AF" />
          <Text className="text-gray-400 text-xs mt-1">Loading...</Text>
        </View>
      )}
    </View>
  );
};

export default VideoThumbnail;