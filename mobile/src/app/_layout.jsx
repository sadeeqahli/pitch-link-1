import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect } from 'react';
// Import Convex provider
import { ConvexProvider } from "convex/react";
import convex from '@/utils/convex.ts';
// Import debug utilities
import '@/utils/dev/debugUtils';

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      cacheTime: 1000 * 60 * 30, // 30 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export default function RootLayout() {
  useEffect(() => {
    // Hide splash screen after app is loaded
    SplashScreen.hideAsync();
  }, []);

  return (
    <ConvexProvider client={convex}>
      <QueryClientProvider client={queryClient}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <Stack screenOptions={{ headerShown: false }} initialRouteName="index">
            <Stack.Screen name="index" />
          </Stack>
        </GestureHandlerRootView>
      </QueryClientProvider>
    </ConvexProvider>
  );
}