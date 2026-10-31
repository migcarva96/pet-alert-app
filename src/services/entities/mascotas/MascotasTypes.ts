import type { ArchivoLocal } from '@/services/entities/archivos/ArchivosTypes';

export type Coordenadas = {
  latitud: number;
  longitud: number;
};

export type Mascota = {
  id: number | string;
  nombre: string;
  raza: string;
  color: string;
  collar_gps: string | null;
  /** Ruta relativa `/uploads/...` (archivo subido) o URL http(s) externa. */
  foto: string | null;
  coordenadas: Coordenadas | null;
  created_at: string;
  updated_at: string;
};

/** La foto es un archivo o una URL, nunca ambos (la API responde 400 FOTO_AMBIGUA). */
export type FotoMascotaInput =
  { tipo: 'archivo'; archivo: ArchivoLocal } | { tipo: 'url'; url: string } | null;

export type MascotaInput = {
  nombre: string;
  raza: string;
  color: string;
  collar_gps: string | null;
  coordenadas: Coordenadas | null;
  foto: FotoMascotaInput;
};
