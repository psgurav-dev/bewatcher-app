import { View, Text, TextInput } from 'react-native'


const SearchBar = () => {

	const handleSearch = (query: string) => {
		console.log('Searching for:', query);
		const timeout = setTimeout(() => {
			console.log('Search completed for:', query);
		}, 500);
		return () => clearTimeout(timeout);
	}

	return (
		<View>
			<TextInput placeholder="Search movies..." 
				className='bg-white text-black p-2 rounded-lg border border-primary-base'
				onChangeText={handleSearch}
			/>
		</View>
	)
}

export default SearchBar