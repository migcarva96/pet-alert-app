import { isRunningInExpoGo } from 'expo';
import { MapPinIcon } from 'phosphor-react-native';
import { Platform, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Colors, Spacing } from '@/constants/theme';
import type { Coordenadas } from '@/services/entities/mascotas/MascotasTypes';

// expo-maps registra su vista nativa al importarse y no está incluido en Expo Go:
// se carga de forma diferida para que la app siga funcionando ahí con el respaldo.
const ExpoMaps: typeof import('expo-maps') | null =
  // eslint-disable-next-line @typescript-eslint/no-require-imports -- carga diferida intencional
  Platform.OS !== 'web' && !isRunningInExpoGo() ? require('expo-maps') : null;

export type PetMapProps = {
  coordenadas: Coordenadas;
  titulo: string;
  zoom?: number;
  /** Sin gestos: para vistas previas dentro de un scroll. */
  interactive?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function PetMap({ coordenadas, titulo, zoom = 15, interactive = true, style }: PetMapProps) {
  const coordinates = { latitude: coordenadas.latitud, longitude: coordenadas.longitud };
  const cameraPosition = { coordinates, zoom };

  if (ExpoMaps && Platform.OS === 'ios') {
    return (
      <View style={style} pointerEvents={interactive ? 'auto' : 'none'}>
        <ExpoMaps.AppleMaps.View
          style={StyleSheet.absoluteFill}
          cameraPosition={cameraPosition}
          markers={[
            {
              id: 'mascota',
              coordinates,
              title: titulo,
              systemImage: 'pawprint.fill',
              tintColor: Colors.accentBase,
            },
          ]}
          uiSettings={{ compassEnabled: interactive, scaleBarEnabled: interactive }}
        />
      </View>
    );
  }

  if (ExpoMaps && Platform.OS === 'android') {
    return (
      <View style={style} pointerEvents={interactive ? 'auto' : 'none'}>
        <ExpoMaps.GoogleMaps.View
          style={StyleSheet.absoluteFill}
          cameraPosition={cameraPosition}
          markers={[{ id: 'mascota', coordinates, title: titulo, showCallout: interactive }]}
          uiSettings={{
            compassEnabled: interactive,
            mapToolbarEnabled: false,
            zoomControlsEnabled: interactive,
            scrollGesturesEnabled: interactive,
            zoomGesturesEnabled: interactive,
            rotationGesturesEnabled: interactive,
            tiltGesturesEnabled: interactive,
          }}
        />
      </View>
    );
  }

  return (
    <View style={[styles.fallback, style]}>
      <MapPinIcon size={32} color={Colors.accentBase} weight="duotone" />
      <ThemedText type="caption" themeColor="textSecondary" style={styles.fallbackText}>
        El mapa requiere un development build (no está disponible en Expo Go ni en web).
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  fallback: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.two,
    padding: Spacing.three,
    backgroundColor: Colors.accentSoftTint,
  },
  fallbackText: {
    textAlign: 'center',
  },
});
