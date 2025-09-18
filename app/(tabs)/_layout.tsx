import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from "expo-router";

export default function TabsLayout() {
	const tabs = [
		{ name: "home", title: "Home", icon: "home" as const },
		{ name: "settings", title: "Settings", icon: "cog" as const },
		{ name: "profile", title: "Profile", icon: "user" as const },
	]
	return (
		<Tabs 
			screenOptions={{ tabBarActiveTintColor: '#EAB308', tabBarInactiveTintColor: '#94A3B8', tabBarStyle: { backgroundColor: '#0F172A', borderTopColor: '#1E293B' } }}
			
		>
			{tabs.map((tab) => (
				<Tabs.Screen
					key={tab.name}
					name={tab.name}
					options={{ title: tab.title, headerShown: false,
						tabBarIcon: ({ color, focused }) => <FontAwesome size={focused ? 28 : 24} name={tab.icon} color={color} />,
					 }}
					
				/>
			))}
		</Tabs>
	);
}
