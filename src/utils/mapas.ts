import { Alert, Linking, Platform } from 'react-native';

import type { Coordenadas } from '@/services/entities/mascotas/MascotasTypes';

/** Abre la app de mapas del sistema (Apple Maps / Google Maps) en las coordenadas. */
export function abrirEnAppDeMapas({ latitud, longitud }: Coordenadas, etiqueta: string) {
  const nombre = encodeURIComponent(etiqueta);
  const url =
    Platform.OS === 'ios'
      ? `https://maps.apple.com/?ll=${latitud},${longitud}&q=${nombre}`
      : `geo:${latitud},${longitud}?q=${latitud},${longitud}(${nombre})`;
  Linking.openURL(url).catch(() => Alert.alert('Mapa', 'No se pudo abrir la aplicación de mapas'));
}
