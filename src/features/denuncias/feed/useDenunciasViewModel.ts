import { useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';

import { getDenuncias } from '@/services/api/denunciasService';
import type {
  Denuncia,
  DenunciasFiltros,
  TipoDenuncia,
} from '@/services/entities/denuncias/DenunciasTypes';

const PAGE_SIZE = 20;
const DEBOUNCE_MS = 400;

export type RangoFecha = 'todo' | 'hoy' | '7-dias' | '30-dias';

function fechaDesde(rango: RangoFecha): string | undefined {
  if (rango === 'todo') return undefined;
  const desde = new Date();
  desde.setHours(0, 0, 0, 0);
  if (rango === '7-dias') desde.setDate(desde.getDate() - 6);
  if (rango === '30-dias') desde.setDate(desde.getDate() - 29);
  return desde.toISOString();
}

export function useDenunciasViewModel() {
  const [tipo, setTipo] = useState<TipoDenuncia | null>(null);
  const [rango, setRango] = useState<RangoFecha>('todo');
  const [nombre, setNombre] = useState('');
  const [collarGps, setCollarGps] = useState('');
  const [busqueda, setBusqueda] = useState({ nombre: '', collarGps: '' });

  const [denuncias, setDenuncias] = useState<Denuncia[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Descarta respuestas de filtros viejos que llegan después de una consulta más reciente.
  const ultimaPeticion = useRef(0);

  useEffect(() => {
    const timer = setTimeout(() => setBusqueda({ nombre, collarGps }), DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [nombre, collarGps]);

  const cargarPagina = useCallback(
    async (pagina: number) => {
      const peticion = ++ultimaPeticion.current;
      const filtros: DenunciasFiltros = {
        tipo_denuncia: tipo ?? undefined,
        nombre: busqueda.nombre.trim() || undefined,
        collar_gps: busqueda.collarGps.trim().toUpperCase() || undefined,
        fecha_desde: fechaDesde(rango),
      };

      try {
        const resultado = await getDenuncias({ ...filtros, page: pagina, limit: PAGE_SIZE });
        if (peticion !== ultimaPeticion.current) return;
        setDenuncias((previas) =>
          pagina === 1 ? resultado.data : [...previas, ...resultado.data],
        );
        setTotal(resultado.total);
        setPage(pagina);
        setError(null);
      } catch (err) {
        if (peticion !== ultimaPeticion.current) return;
        setError(err instanceof Error ? err.message : 'No se pudieron obtener las denuncias');
      } finally {
        if (peticion === ultimaPeticion.current) {
          setIsLoading(false);
          setIsRefreshing(false);
          setIsLoadingMore(false);
        }
      }
    },
    [tipo, rango, busqueda],
  );

  // Al cambiar filtros o volver a la pestaña se reinicia desde la primera página.
  useFocusEffect(
    useCallback(() => {
      cargarPagina(1);
    }, [cargarPagina]),
  );

  const hasMore = denuncias.length < total;

  function cargarMas() {
    if (!hasMore || isLoadingMore || isLoading || isRefreshing) return;
    setIsLoadingMore(true);
    cargarPagina(page + 1);
  }

  function refetch() {
    setIsRefreshing(true);
    cargarPagina(1);
  }

  function cambiarTipo(nuevo: TipoDenuncia | null) {
    setIsLoading(true);
    setTipo(nuevo);
  }

  function cambiarRango(nuevo: RangoFecha) {
    setIsLoading(true);
    setRango(nuevo);
  }

  return {
    tipo,
    cambiarTipo,
    rango,
    cambiarRango,
    nombre,
    setNombre,
    collarGps,
    setCollarGps,
    denuncias,
    total,
    hasMore,
    isLoading,
    isRefreshing,
    isLoadingMore,
    error,
    refetch,
    cargarMas,
  };
}
