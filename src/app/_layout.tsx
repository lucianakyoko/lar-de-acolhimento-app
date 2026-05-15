import { Redirect, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import QueryProvider from '@/providers/QueryProvider';
import { initializeAuth, useAuthStore } from '@/store/authStore';
import { ActivityIndicator, Text, View } from 'react-native';

export default function RootLayout() {
  const { isAuthenticated, isLoading } = useAuthStore();

  useEffect(() => {
    initializeAuth();
  }, []);

  if(isLoading) {
    return (
      <SafeAreaProvider>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#FBFAF8'
          }}
        >
          <Text>Carregando...</Text>
          <ActivityIndicator size="large" color="#5B7552" />
        </View>
      </SafeAreaProvider>
    );
  }
  
  return (
    <SafeAreaProvider>
      <QueryProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="login" options={{ headerShown: false }} />
          <Stack.Screen name="(app)" options={{ headerShown: false }} />
        </Stack>
        <StatusBar style="auto" />

        {!isAuthenticated && <Redirect href="/login" />}
      </QueryProvider>
    </SafeAreaProvider>
  );
}