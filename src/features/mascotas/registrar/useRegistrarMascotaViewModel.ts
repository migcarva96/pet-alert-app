import { router } from 'expo-router';
import { useState } from 'react';
import { Alert } from 'react-native';

import { ApiError } from '@/services/api/client';
import { registrarMascota } from '@/services/api/mascotasService';
import { obtenerUbicacionActual } from '@/services/device/ubicacion';
import type { ArchivoLocal } from '@/services/entities/archivos/ArchivosTypes';
import type { Coordenadas, FotoMascotaInput } from '@/services/entities/mascotas/MascotasTypes';
import { textoOpcional } from '@/utils/formato';

export type ModoFoto = 'ninguna' | 'archivo' | 'url';

type Errores = Partial<Record<'nombre' | 'raza' | 'color' | 'collar_gps' | 'fotoUrl', string>>;

const PATRON_GPS = /^[A-Z0-9]+(-[A-Z0-9]+)*$/;

export function useRegistrarMascotaViewModel() {
  const [nombre, setNombre] = useState('');
  const [raza, setRaza] = useState('');
  const [color, setColor] = useState('');
  const [collarGps, setCollarGps] = useState('');
  const [modoFoto, setModoFoto] = useState<ModoFoto>('ninguna');
  const [fotoArchivo, setFotoArchivo] = useState<ArchivoLocal | null>(null);
  const [fotoUrl, setFotoUrl] = useState('');
  const [coordenadas, setCoordenadas] = useState<Coordenadas | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errores, setErrores] = useState<Errores>({});

  function validar(): Errores {
    const nuevos: Errores = {};
    if (!nombre.trim()) nuevos.nombre = 'El nombre es obligatorio';
    if (!raza.trim()) nuevos.raza = 'La raza es obligatoria';
    if (!color.trim()) nuevos.color = 'El color es obligatorio';
    const gps = collarGps.trim().toUpperCase();
    if (gps && !PATRON_GPS.test(gps))
      nuevos.collar_gps = 'Solo letras, números y guiones (ej. CO-458)';
    if (modoFoto === 'url' && !/^https?:\/\/\S+$/i.test(fotoUrl.trim())) {
      nuevos.fotoUrl = 'Ingresa una URL http(s) válida';
    }
    return nuevos;
  }

  async function usarUbicacionActual() {
    setIsLocating(true);
    try {
      setCoordenadas(await obtenerUbicacionActual());
    } catch (err) {
      Alert.alert(
        'Ubicación',
        err instanceof Error ? err.message : 'No se pudo obtener la ubicación',
      );
    } finally {
      setIsLocating(false);
    }
  }

  function construirFoto(): FotoMascotaInput {
    if (modoFoto === 'archivo' && fotoArchivo) return { tipo: 'archivo', archivo: fotoArchivo };
    if (modoFoto === 'url') return { tipo: 'url', url: fotoUrl.trim() };
    return null;
  }

  async function guardar() {
    const nuevos = validar();
    setErrores(nuevos);
    if (Object.keys(nuevos).length > 0) return;

    setIsSaving(true);
    try {
      const mascota = await registrarMascota({
        nombre: nombre.trim(),
        raza: raza.trim(),
        color: color.trim(),
        collar_gps: textoOpcional(collarGps)?.toUpperCase() ?? null,
        coordenadas,
        foto: construirFoto(),
      });
      router.replace({ pathname: '/mascotas/[id]', params: { id: String(mascota.id) } });
    } catch (err) {
      if (err instanceof ApiError && err.status === 409) {
        setErrores({ collar_gps: err.message });
      } else {
        Alert.alert(
          'No se pudo registrar',
          err instanceof Error ? err.message : 'Intenta de nuevo',
        );
      }
    } finally {
      setIsSaving(false);
    }
  }

  return {
    nombre,
    setNombre,
    raza,
    setRaza,
    color,
    setColor,
    collarGps,
    setCollarGps,
    modoFoto,
    setModoFoto,
    fotoArchivo,
    setFotoArchivo,
    fotoUrl,
    setFotoUrl,
    coordenadas,
    quitarCoordenadas: () => setCoordenadas(null),
    usarUbicacionActual,
    isLocating,
    isSaving,
    errores,
    guardar,
  };
}
