import type { ArchivoLocal } from '@/services/entities/archivos/ArchivosTypes';

export const TipoDenuncia = {
  Perdida: 1,
  Maltrato: 2,
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare -- patrón enum: valor y tipo comparten nombre
export type TipoDenuncia = (typeof TipoDenuncia)[keyof typeof TipoDenuncia];

export type Evidencia = {
  id: number | string;
  denuncia_id: number | string;
  nombre_archivo: string;
  /** Clave interna del servicio, NO es una URL de descarga. */
  ruta_archivo: string;
  tipo_archivo: string;
  tamano_bytes: number;
  created_at: string;
};

export type Denuncia = {
  id: number | string;
  nombre: string | null;
  raza: string | null;
  color: string | null;
  collar_gps: string | null;
  nombre_denunciante: string;
  telefono: string | null;
  correo: string | null;
  descripcion_denuncia: string;
  tipo_denuncia: TipoDenuncia;
  tipo_denuncia_descripcion: 'Pérdida' | 'Maltrato';
  /** Clave interna del servicio, NO es una URL pública. */
  foto: string | null;
  evidencias: Evidencia[];
  created_at: string;
  updated_at: string;
};

/** Cuerpo JSON de POST/PUT. En multipart viaja serializado en el campo `datos`. */
export type DenunciaDatos = {
  nombre: string | null;
  raza: string | null;
  color: string | null;
  collar_gps: string | null;
  nombre_denunciante: string;
  telefono: string | null;
  correo: string | null;
  descripcion_denuncia: string;
  tipo_denuncia: TipoDenuncia;
};

export type DenunciaInput = {
  datos: DenunciaDatos;
  foto: ArchivoLocal | null;
  evidencias: ArchivoLocal[];
};

export type DenunciasFiltros = {
  tipo_denuncia?: TipoDenuncia;
  nombre?: string;
  collar_gps?: string;
  /** ISO 8601 con zona horaria. */
  fecha_desde?: string;
  fecha_hasta?: string;
};

export type DenunciasQuery = DenunciasFiltros & {
  page: number;
  /** Máximo 100. */
  limit: number;
};

export type DenunciasPagina = {
  total: number;
  page: number;
  limit: number;
  data: Denuncia[];
};

export type ApiRespuesta<T> = {
  codigo: string;
  mensaje: string;
  data: T;
};

export type DenunciaGuardada = {
  codigo: string;
  mensaje: string;
  id_denuncia: number | string;
};
