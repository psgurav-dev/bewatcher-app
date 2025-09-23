import { MMKV } from 'react-native-mmkv';

export const mmkvStorage = new MMKV({
  id: 'movie_app_cache',
  // encryptionKey: 'your-encryption-key', // Optional: for encrypted storage
});
