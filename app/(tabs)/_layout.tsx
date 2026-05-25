import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from "expo-router";

export default function TabsLayout() {

	const tabs = [
		{ name: "home", title: "Home", icon: "home" as const },
		{ name: "search", title: "Search", icon: "search" as const },
		{ name: "profile", title: "Profile", icon: "user" as const },
	]

	return (
		<Tabs
			screenOptions={{
				tabBarActiveTintColor: '#2640F4',
				tabBarInactiveTintColor: '#94A3B8',
				tabBarStyle: { backgroundColor: '#131314', borderTopColor: '#0F172A', alignItems: 'center', justifyContent: 'center' },
				tabBarLabelStyle: { fontSize: 10, fontWeight: '500', marginBottom: 4, fontFamily: 'Manrope', color: "#fff" },
			}}
		>
			{tabs.map((tab) => (
				<Tabs.Screen
					key={tab.name}
					name={tab.name}
					options={{
						title: tab.title,
						headerShown: false,
						tabBarIcon: ({ color, focused }) => (
							<FontAwesome size={focused ? 28 : 24} name={tab.icon} color={color} />
						),
					}}
				/>
			))}
		</Tabs>
	);
}
