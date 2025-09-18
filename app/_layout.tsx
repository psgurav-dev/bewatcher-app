import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import "./global.css";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <Stack screenOptions={{ animation: "none" }} >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="movie/[id]" options={{ headerShown: false }} />
      </Stack>
    </SafeAreaProvider>
  );
}
