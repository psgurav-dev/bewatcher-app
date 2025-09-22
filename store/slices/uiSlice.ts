import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UIState {
	theme: 'light' | 'dark';
	isLoading: boolean;
	activeTab: string;
	searchVisible: boolean;
	filterModalVisible: boolean;
	selectedGenres: number[];
	sortBy: 'popularity' | 'rating' | 'release_date';
}

const initialState: UIState = {
	theme: 'dark',
	isLoading: false,
	activeTab: 'home',
	searchVisible: false,
	filterModalVisible: false,
	selectedGenres: [],
	sortBy: 'popularity',
};

const uiSlice = createSlice({
	name: 'ui',
	initialState,
	reducers: {
		setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
			state.theme = action.payload;
		},

		setLoading: (state, action: PayloadAction<boolean>) => {
			state.isLoading = action.payload;
		},

		setActiveTab: (state, action: PayloadAction<string>) => {
			state.activeTab = action.payload;
		},

		toggleSearch: (state) => {
			state.searchVisible = !state.searchVisible;
		},

		setSearchVisible: (state, action: PayloadAction<boolean>) => {
			state.searchVisible = action.payload;
		},

		toggleFilterModal: (state) => {
			state.filterModalVisible = !state.filterModalVisible;
		},

		setSelectedGenres: (state, action: PayloadAction<number[]>) => {
			state.selectedGenres = action.payload;
		},

		setSortBy: (state, action: PayloadAction<'popularity' | 'rating' | 'release_date'>) => {
			state.sortBy = action.payload;
		},
	},
});

export const {
	setTheme,
	setLoading,
	setActiveTab,
	toggleSearch,
	setSearchVisible,
	toggleFilterModal,
	setSelectedGenres,
	setSortBy,
} = uiSlice.actions;

export default uiSlice.reducer;
