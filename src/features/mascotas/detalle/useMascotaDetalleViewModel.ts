import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useCallback, useState } from 'react';
import { Alert } from 'react-native';

import { getDenuncias } from '@/services/api/denunciasService';
import { eliminarMascota, getMascota } from '@/services/api/mascotasService';
import type { Denuncia } from '@/services/entities/denuncias/DenunciasTypes';
import type { Mascota } from '@/services/entities/mascotas/MascotasTypes';

const LIMITE_HISTORIAL = 20;

export function useMascotaDetalleViewModel() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [mascota, setMascota] = useState<Mascota | null>(null);
  const [historial, setHistorial] = useState<Denuncia[]>([]);
  const [totalHistorial, setTotalHistorial] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errorHistorial, setErrorHistorial] = useState<string | null>(null);

  const cargar = useCallback(async () => {
    setError(null);
    try {
      const resultado = await getMascota(id);
      setMascota(resultado);

      // El historial se cruza por collar GPS: sin collar no hay forma de asociar denuncias.
      if (resultado.collar_gps) {
        try {
          const pagina = await getDenuncias({
            collar_gps: resultado.collar_gps,
            page: 1,
            limit: LIMITE_HISTORIAL,
          });
          setHistorial(pagina.data);
          setTotalHistorial(pagina.total);
          setErrorHistorial(null);
        } catch (err) {
          setErrorHistorial(err instanceof Error ? err.message : 'No se pudo cargar el historial');
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo obtener la mascota');
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  // Al volver de reportar una pérdida el historial debe incluir la nueva denuncia.
  useFocusEffect(
    useCallback(() => {
      cargar();
    }, [cargar]),
  );

  function reportarPerdida() {
    router.push({ pathname: '/denuncias/nueva', params: { mascotaId: id } });
  }

  function abrirEnMapa() {
    router.push({ pathname: '/mascotas/[id]/mapa', params: { id } });
  }

  function confirmarEliminar() {
    if (!mascota) return;
    Alert.alert('Eliminar mascota', `¿Seguro que quieres eliminar a ${mascota.nombre}?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: async () => {
          setIsDeleting(true);
          try {
            await eliminarMascota(mascota.id);
            router.back();
          } catch (err) {
            Alert.alert('Error', err instanceof Error ? err.message : 'No se pudo eliminar');
            setIsDeleting(false);
          }
        },
      },
    ]);
  }

  return {
    mascota,
    historial,
    totalHistorial,
    isLoading,
    isDeleting,
    error,
    errorHistorial,
    reintentar: cargar,
    reportarPerdida,
    abrirEnMapa,
    confirmarEliminar,
  };
}
