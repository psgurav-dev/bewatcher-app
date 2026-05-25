import { View, Text, Pressable } from 'react-native'
import { useState } from 'react'
import Animated from 'react-native-reanimated';

const data = [
	{ name: "home", title: "Home", icon: "home" as const },
	{ name: "settings", title: "Settings", icon: "cog" as const },
	{ name: "profile", title: "Profile", icon: "user" as const },

]

const AnimatedTabBar = () => {
	return (
		<View>
			<Text>Animated Tab Bar</Text>
		</View>
	)
}

const TabBarComponent = () => {
	const [selectedIndex, setSelectedIndex] = useState(0);

	return (
		<Animated.View>
			{data.map((item, index) => (
				<Pressable
					key={item.name}
					onPress={() => setSelectedIndex(index)}
					style={{ margin: 10, padding: 10, backgroundColor: selectedIndex === index ? 'yellow' : 'gray', borderRadius: 10 }}
				>
					<Text style={{ color: selectedIndex === index ? 'black' : 'white', fontWeight: 'bold' }}>{item.title}</Text>
				</Pressable>
			))}
		</Animated.View>
	)
};

export default AnimatedTabBar;