import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { PlacesProvider } from '../context/PlacesContext';

export default function RootLayout() {
  return (
    <PlacesProvider>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </PlacesProvider>
  );
}