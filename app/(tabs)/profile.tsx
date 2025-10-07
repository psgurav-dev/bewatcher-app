import { useAuth, useClerk, useUser } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { Text, View, TouchableOpacity, ActivityIndicator } from "react-native";

export default function ProfileScreen() {
  const { isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();

  if (!isLoaded) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!isSignedIn) {
    router.replace('/(auth)/login');
    return null;
  }

  const handleSignOut = async () => {
    try {
      await signOut();
      router.replace('/(auth)/login');
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
    }
  };

  return (
    <View className="flex-1 items-center justify-center">
      <Text className="text-lg font-bold">Profile Screen</Text>
      <Text className="text-base mt-4">Welcome, {user?.firstName}!</Text>
      <TouchableOpacity
        className="bg-red-600 rounded-xl px-4 py-2 my-4 w-[90%] items-center"
        onPress={handleSignOut}
      >
        <Text
          className="text-white text-lg"
          style={{ fontWeight: '600', fontFamily: 'Manrope' }}
        >
          Sign Out
        </Text>
      </TouchableOpacity>
    </View>
  );
}