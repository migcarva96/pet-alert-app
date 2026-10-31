import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';

import { getMascota } from '@/services/api/mascotasService';
import type { Mascota } from '@/services/entities/mascotas/MascotasTypes';
import { abrirEnAppDeMapas } from '@/utils/mapas';

export function useMascotaMapaViewModel() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [mascota, setMascota] = useState<Mascota | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isCurrent = true;

    getMascota(id)
      .then((resultado) => {
        if (isCurrent) setMascota(resultado);
      })
      .catch((err) => {
        if (isCurrent)
          setError(err instanceof Error ? err.message : 'No se pudo obtener la mascota');
      });

    return () => {
      isCurrent = false;
    };
  }, [id]);

  function abrirExterno() {
    if (mascota?.coordenadas) abrirEnAppDeMapas(mascota.coordenadas, mascota.nombre);
  }

  return { mascota, error, abrirExterno };
}
