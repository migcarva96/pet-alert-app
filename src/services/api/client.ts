import axios, { isAxiosError } from 'axios';

import { DENUNCIAS_API_URL, MASCOTAS_API_URL } from './env';

import type { ArchivoLocal } from '@/services/entities/archivos/ArchivosTypes';

const TIMEOUT_MS = 15000;

// Los envíos con archivos tardan más que una consulta, sobre todo videos de evidencia.
export const UPLOAD_TIMEOUT_MS = 120000;

export const mascotasClient = axios.create({ baseURL: MASCOTAS_API_URL, timeout: TIMEOUT_MS });

export const denunciasClient = axios.create({ baseURL: DENUNCIAS_API_URL, timeout: TIMEOUT_MS });

/** Ambos servicios responden los errores como `{ codigo, mensaje }`. */
export class ApiError extends Error {
  constructor(
    message: string,
    public codigo: string | null = null,
    public status: number | null = null,
  ) {
    super(message);
  }
}

export function toApiError(err: unknown, mensajePorDefecto: string): ApiError {
  if (!isAxiosError<{ codigo?: string; mensaje?: string }>(err)) {
    return new ApiError(mensajePorDefecto);
  }
  if (!err.response) {
    return new ApiError('No hay conexión con el servidor', 'SIN_CONEXION');
  }
  const { data, status } = err.response;
  return new ApiError(data?.mensaje ?? mensajePorDefecto, data?.codigo ?? null, status);
}

/** Forma que espera el FormData de React Native para adjuntar un archivo local. */
export function toFormDataFile(archivo: ArchivoLocal) {
  return { uri: archivo.uri, name: archivo.name, type: archivo.mimeType } as unknown as Blob;
}

// Sin Content-Type explícito axios serializa el FormData como JSON en React Native;
// el boundary lo agrega la capa de red nativa.
export const MULTIPART_HEADERS = { 'Content-Type': 'multipart/form-data' };
