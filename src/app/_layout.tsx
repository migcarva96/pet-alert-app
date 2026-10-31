import { DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';

import { FontAssets } from '@/constants/theme';

// Puede rechazar si el splash ya se ocultó; no es un error accionable.
SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts(FontAssets);
  const ready = fontsLoaded || Boolean(fontError);

  useEffect(() => {
    if (ready) SplashScreen.hideAsync().catch(() => {});
  }, [ready]);

  if (!ready) return null;

  return (
    <ThemeProvider value={DefaultTheme}>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="mascotas/nueva" options={{ presentation: 'modal' }} />
      </Stack>
    </ThemeProvider>
  );
}
