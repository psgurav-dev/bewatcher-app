import React from 'react';
import { View, Text, Pressable, Image } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { AnimatedList } from '../animated-movie-bg';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);



// Dark themed version
const DarkGoogleButton = ({ onPress, loading = false }: { onPress: () => void, loading?: boolean }) => {
  const scale = useSharedValue(1);
  const shadowOpacity = useSharedValue(0.1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    shadowOpacity: shadowOpacity.value,
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.95);
    shadowOpacity.value = withTiming(0.2);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
    shadowOpacity.value = withTiming(0.1);
  };

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={loading}
      style={[
        animatedStyle,
        {
          shadowColor: '#4285F4',
          shadowOffset: { width: 0, height: 4 },
          shadowRadius: 10,
          elevation: 8,
        }
      ]}
      className="w-full"
    >
      <View className="bg-gray-900 border border-gray-700 rounded-xl p-4 flex-row items-center justify-center">
        {loading ? (
          <View className="w-6 h-6 mr-3">
            <MaterialIcons name="sync" size={24} color="#4285F4" />
          </View>
        ) : (
          <Image
            source={{
              uri: 'https://developers.google.com/identity/images/g-logo.png'
            }}
            style={{ width: 24, height: 24, marginRight: 12 }}
          />
        )}
        <Text
          className="text-white font-semibold text-lg"
          style={{ fontFamily: 'Manrope' }}
        >
          {loading ? 'Signing in...' : 'Continue with Google'}
        </Text>
      </View>
    </AnimatedPressable>
  );
};

// Complete login section
export const LoginSection = ({ handleGoogleLogin, loading = false }: { handleGoogleLogin: () => void, loading?: boolean }) => {
  return (
    <View className='bg-black/80 backdrop-blur-lg rounded-2xl p-8 absolute bottom-10 w-full mx-4 border border-gray-800'>
      <View className="items-center mb-6">
        <Text
          className="text-white text-2xl font-bold mb-2"
          style={{ fontFamily: 'Manrope' }}
        >
          Welcome Back
        </Text>
        <Text
          className="text-gray-400 text-center"
          style={{ fontFamily: 'Manrope' }}
        >
          Sign in to continue your movie journey
        </Text>
      </View>

      <DarkGoogleButton onPress={handleGoogleLogin} loading={loading} />

      <View className="flex-row items-center justify-center mt-6">
        <View className="flex-1 h-px bg-gray-700" />
        <Text className="text-gray-500 px-4 text-sm">or</Text>
        <View className="flex-1 h-px bg-gray-700" />
      </View>

      <Pressable className="mt-4 p-3">
        <Text className="text-gray-400 text-center">
          Continue as guest
        </Text>
      </Pressable>
    </View>
  );
};

// Usage example component
export const LoginScreenExample = ({ handleGoogleLogin }: { handleGoogleLogin: () => void }) => {
  const [loading, setLoading] = React.useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      await handleGoogleLogin();
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className='flex-1 items-center justify-center w-full bg-black relative'>
      <AnimatedList />
      <LoginSection handleGoogleLogin={handleLogin} loading={loading} />
    </View>
  );
};