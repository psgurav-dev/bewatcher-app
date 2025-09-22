import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect } from 'react';
import './global.css';

const queryClient = new QueryClient();
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
	const [loaded, error] = useFonts({
		BricolageGrotesque: require('@/assets/fonts/Bricolage_Grotesque/static/BricolageGrotesque_48pt_Condensed-Bold.ttf'),
		Manrope: require('@/assets/fonts/Manrope/static/Manrope-Bold.ttf'),
		ZalondoItalic: require('@/assets/fonts/Zalando_Sans_Expanded/static/ZalandoSansExpanded-BlackItalic.ttf'),
		Zalondo: require('@/assets/fonts/Zalando_Sans_Expanded/static/ZalandoSansExpanded-Medium.ttf'),
	});

	useEffect(() => {
		if (loaded || error) {
			SplashScreen.hideAsync();
		}
	}, [loaded, error]);

	if (!loaded && !error) {
		return null;
	}
	return (
		<QueryClientProvider client={queryClient}>
			<Stack screenOptions={{ animation: 'none' }}>
				<Stack.Screen name="(tabs)" options={{ headerShown: false }} />
				<Stack.Screen name="movie/[id]" options={{ headerShown: false }} />
			</Stack>
		</QueryClientProvider>
	);
}
