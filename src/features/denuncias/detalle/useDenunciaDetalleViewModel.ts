import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useCallback, useState } from 'react';

import { getDenuncia } from '@/services/api/denunciasService';
import type { Denuncia } from '@/services/entities/denuncias/DenunciasTypes';

export function useDenunciaDetalleViewModel() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [denuncia, setDenuncia] = useState<Denuncia | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const cargar = useCallback(async () => {
    setError(null);
    try {
      setDenuncia(await getDenuncia(id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo obtener la denuncia');
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  // Recarga al volver de editar.
  useFocusEffect(
    useCallback(() => {
      cargar();
    }, [cargar]),
  );

  function editar() {
    router.push({ pathname: '/denuncias/[id]/editar', params: { id } });
  }

  return { denuncia, isLoading, error, reintentar: cargar, editar };
}
