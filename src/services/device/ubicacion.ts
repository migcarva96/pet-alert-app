import * as Location from 'expo-location';

import type { Coordenadas } from '@/services/entities/mascotas/MascotasTypes';

export async function obtenerUbicacionActual(): Promise<Coordenadas> {
  const permiso = await Location.requestForegroundPermissionsAsync();
  if (!permiso.granted) {
    throw new Error('Se necesita permiso de ubicación.');
  }

  const { coords } = await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.Balanced,
  });
  return { latitud: coords.latitude, longitud: coords.longitude };
}
