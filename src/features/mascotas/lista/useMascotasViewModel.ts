import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';

import { getMascotas } from '@/services/api/mascotasService';
import type { Mascota } from '@/services/entities/mascotas/MascotasTypes';

export function useMascotasViewModel() {
  const [mascotas, setMascotas] = useState<Mascota[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cargar = useCallback(async () => {
    setError(null);
    try {
      setMascotas(await getMascotas());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudieron obtener las mascotas');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  // Se recarga al volver a la pestaña para reflejar registros y eliminaciones.
  useFocusEffect(
    useCallback(() => {
      cargar();
    }, [cargar]),
  );

  function refetch() {
    setIsRefreshing(true);
    cargar();
  }

  return { mascotas, isLoading, isRefreshing, error, refetch };
}
