import { useQueryClient } from '@tanstack/react-query';
import React from 'react';
import { Alert, Pressable, Text, View } from 'react-native';

const ReactQueryInspector = () => {
  const queryClient = useQueryClient();

  const inspectCache = () => {
    const cache = queryClient.getQueryCache();
    const queries = cache.getAll();
    
    console.log('🔍 React Query Cache:', {
      totalQueries: queries.length,
      queries: queries.map(query => ({
        queryKey: query.queryKey,
        state: query.state.status,
        dataUpdatedAt: query.state.dataUpdatedAt,
        // isFetching: query.state.isFetching,
        isStale: query.isStale(),
      }))
    });
    
    // Log individual query data
    queries.forEach(query => {
      console.log(`📝 Query [${query.queryKey.join('.')}]:`, query.state.data);
    });
  };

  const clearCache = () => {
    Alert.alert(
      'Clear Query Cache',
      'This will clear all cached query data.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: () => {
            queryClient.clear();
            console.log('🗑️ React Query cache cleared');
          }
        }
      ]
    );
  };

  return (
    <View className="flex-1 bg-black p-4">
      <Text className="text-white text-xl font-bold mb-4">React Query Inspector</Text>
      
      <View className="flex-row gap-2 mb-4">
        <Pressable 
          onPress={inspectCache}
          className="bg-purple-600 px-4 py-2 rounded"
        >
          <Text className="text-white">Inspect Cache</Text>
        </Pressable>
        
        <Pressable 
          onPress={clearCache}
          className="bg-red-600 px-4 py-2 rounded"
        >
          <Text className="text-white">Clear Cache</Text>
        </Pressable>
      </View>

      <Text className="text-gray-400 text-sm">
        Check console for detailed cache information
      </Text>
    </View>
  );
};


export default ReactQueryInspector