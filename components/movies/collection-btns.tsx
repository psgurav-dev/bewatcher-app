import { View, Text } from 'react-native'
import React, { useTransition } from 'react'

interface PropsTypes {
	id: string
}
const CollectionButtons = (props: PropsTypes) => {
	const [isPending, startTransition] = useTransition()
	return (
		<View>
			<Text>CollectionButtons</Text>
		</View>
	)
}

export default CollectionButtons