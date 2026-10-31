import type { ConfigContext, ExpoConfig } from 'expo/config';

// Extiende app.json con valores secretos que no deben quedar en el repositorio.
export default ({ config }: ConfigContext): ExpoConfig => ({
  ...(config as ExpoConfig),
  android: {
    ...config.android,
    config: {
      ...config.android?.config,
      // expo-maps usa el SDK de Google Maps en Android; en iOS usa Apple Maps y no requiere llave.
      googleMaps: { apiKey: process.env.GOOGLE_MAPS_ANDROID_API_KEY },
    },
  },
});
