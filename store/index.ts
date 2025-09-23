import AsyncStorage from '@react-native-async-storage/async-storage';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import moviesReducer from './slices/moviesSlice';
import uiReducer from './slices/uiSlice';

// Persist config
const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['movies', 'ui'], // Only persist these reducers
};

// Persist config for movies (only persist favorites and watchlist)
const moviesPersistConfig = {
  key: 'movies',
  storage: AsyncStorage,
  whitelist: ['favorites', 'watchlist'], // Only persist these fields
};

const rootReducer = combineReducers({
  movies: persistReducer(moviesPersistConfig, moviesReducer),
  ui: uiReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
