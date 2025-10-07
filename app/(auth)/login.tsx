
import { View, Text, Pressable, Image } from 'react-native';
import { useSSO } from '@clerk/clerk-expo';
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import { AnimatedList } from '@/components/animated-movie-bg';


import Animated, {
	useSharedValue,
	useAnimatedStyle,
	withSpring,
} from 'react-native-reanimated';

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useState } from 'react';
import { useRouter } from 'expo-router';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
WebBrowser.maybeCompleteAuthSession();



export const GoogleLoginButton = ({ onPress, loading = false }: { onPress: () => void, loading?: boolean }) => {
	const scale = useSharedValue(1);
	const rotate = useSharedValue(0);

	const animatedStyle = useAnimatedStyle(() => ({
		transform: [
			{ scale: scale.value },
			{ rotateZ: `${rotate.value}deg` }
		],
	}));

	const handlePressIn = () => {
		scale.value = withSpring(0.96);
	};

	const handlePressOut = () => {
		scale.value = withSpring(1);
	};

	return (
		<AnimatedPressable
			onPress={onPress}
			onPressIn={handlePressIn}
			onPressOut={handlePressOut}
			disabled={loading}
			style={animatedStyle}
			className="w-full"
		>
			<View className="bg-white rounded-xl p-4 flex-row items-center justify-center shadow-lg border border-gray-200">
				{loading ? (
					<View className="w-6 h-6 mr-3">
						<MaterialIcons name="hourglass-empty" size={24} color="#4285F4" />
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
					className="text-gray-700 font-semibold text-lg"
					style={{ fontFamily: 'Manrope' }}
				>
					{loading ? 'Signing in...' : 'Continue with Google'}
				</Text>
			</View>
		</AnimatedPressable>
	);
};


const LogIn = () => {
	const { startSSOFlow } = useSSO();
	const router = useRouter();
	const [loading, setLoading] = useState(false);

	const handleGoogleLogin = async () => {
		setLoading(true);
		try {
			const redirectUrl = AuthSession.makeRedirectUri({ scheme: 'bewatcher', path: '/(tabs)/profile' });
			const { createdSessionId, setActive } = await startSSOFlow({
				strategy: 'oauth_google',
				redirectUrl,
			});
			if (createdSessionId) {
				await setActive!({ session: createdSessionId });
				router.replace('/(tabs)/profile');
				console.log('Session created and set active:', createdSessionId);
			} else {
				console.error('Failed to create session');
			}
		} catch (err) {
			console.error('Google login error:', err);
		} finally {
			setLoading(false);
		}
	};

	return (
		<View className='flex-1 items-center justify-center w-full bg-black relative'>
			<AnimatedList />
			<View className='bg-black/80 backdrop-blur-lg rounded-2xl p-8 absolute bottom-10 w-full' >
				<GoogleLoginButton
					loading={loading}
					onPress={handleGoogleLogin}
				/>
			</View>
		</View>
	);
};

export default LogIn;