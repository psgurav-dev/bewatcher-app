import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { persistQueryClient } from '@tanstack/react-query-persist-client';

import { persistor, store } from '@/store';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import './global.css';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
	const [queryClient] = useState(
		() =>
			new QueryClient({
				defaultOptions: {
					queries: {
						gcTime: 1000 * 60 * 60 * 24, // 24 hours
						staleTime: 1000 * 60 * 5, // 5 minutes
					},
				},
			}),
	);

	const [isRestoringClient, setIsRestoringClient] = useState(true);

	const [loaded, error] = useFonts({
		BricolageGrotesque: require('@/assets/fonts/Bricolage_Grotesque/static/BricolageGrotesque_48pt_Condensed-Bold.ttf'),
		Manrope: require('@/assets/fonts/Manrope/static/Manrope-Bold.ttf'),
		ZalondoItalic: require('@/assets/fonts/Zalando_Sans_Expanded/static/ZalandoSansExpanded-BlackItalic.ttf'),
		Zalondo: require('@/assets/fonts/Zalando_Sans_Expanded/static/ZalandoSansExpanded-Medium.ttf'),
	});

	useEffect(() => {
		const setupPersistence = async () => {
			// Create the async storage persister
			const asyncStoragePersister = createAsyncStoragePersister({
				storage: AsyncStorage,
				key: 'REACT_QUERY_OFFLINE_CACHE',
				throttleTime: 1000,
			});

			// Persist the query client
			try {
				await persistQueryClient({
					queryClient,
					persister: asyncStoragePersister,
					maxAge: 1000 * 60 * 60 * 24, // 24 hours
					buster: '', // Optional: version string to force cache invalidation
				});
			} catch (error) {
				console.error('Failed to setup query persistence:', error);
			} finally {
				setIsRestoringClient(false);
			}
		};

		setupPersistence();
	}, [queryClient]);

	useEffect(() => {
		if ((loaded || error) && !isRestoringClient) {
			SplashScreen.hideAsync();
		}
	}, [loaded, error, isRestoringClient]);

	// Show loading while fonts are loading or query client is being restored
	if ((!loaded && !error) || isRestoringClient) {
		return (
			<View
				style={{
					flex: 1,
					justifyContent: 'center',
					alignItems: 'center',
					backgroundColor: 'black',
				}}
			>
				<ActivityIndicator size="large" color="#ffffff" />
			</View>
		);
	}

	return (
		<Provider store={store}>
			<PersistGate loading={null} persistor={persistor}>
				<QueryClientProvider client={queryClient}>
					<Stack screenOptions={{ animation: 'none' }}>
						<Stack.Screen name="(tabs)" options={{ headerShown: false }} />
						<Stack.Screen name="movie/[id]" options={{ headerShown: false }} />
					</Stack>
				</QueryClientProvider>
			</PersistGate>
		</Provider>
	);
}
