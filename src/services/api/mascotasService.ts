import {
  MULTIPART_HEADERS,
  UPLOAD_TIMEOUT_MS,
  mascotasClient,
  toApiError,
  toFormDataFile,
} from './client';
import { MASCOTAS_API_URL } from './env';

import type { Mascota, MascotaInput } from '@/services/entities/mascotas/MascotasTypes';

export async function getMascotas(): Promise<Mascota[]> {
  try {
    const { data } = await mascotasClient.get<Mascota[]>('/api/mascotas');
    return data;
  } catch (err) {
    throw toApiError(err, 'No se pudieron obtener las mascotas');
  }
}

export async function getMascota(id: Mascota['id']): Promise<Mascota> {
  try {
    const { data } = await mascotasClient.get<Mascota>(`/api/mascotas/${id}`);
    return data;
  } catch (err) {
    throw toApiError(err, 'No se pudo obtener la mascota');
  }
}

export async function registrarMascota(input: MascotaInput): Promise<Mascota> {
  const { foto, ...campos } = input;

  try {
    // Solo hace falta multipart cuando la foto es un archivo; con URL el JSON es suficiente.
    if (foto?.tipo === 'archivo') {
      const form = new FormData();
      form.append('nombre', campos.nombre);
      form.append('raza', campos.raza);
      form.append('color', campos.color);
      if (campos.collar_gps) form.append('collar_gps', campos.collar_gps);
      if (campos.coordenadas) form.append('coordenadas', JSON.stringify(campos.coordenadas));
      form.append('foto', toFormDataFile(foto.archivo));

      const { data } = await mascotasClient.post<Mascota>('/api/mascotas', form, {
        headers: MULTIPART_HEADERS,
        timeout: UPLOAD_TIMEOUT_MS,
      });
      return data;
    }

    const { data } = await mascotasClient.post<Mascota>('/api/mascotas', {
      ...campos,
      foto: foto?.tipo === 'url' ? foto.url : null,
    });
    return data;
  } catch (err) {
    throw toApiError(err, 'No se pudo registrar la mascota');
  }
}

export async function eliminarMascota(id: Mascota['id']): Promise<void> {
  try {
    await mascotasClient.delete(`/api/mascotas/${id}`);
  } catch (err) {
    throw toApiError(err, 'No se pudo eliminar la mascota');
  }
}

/** Las fotos subidas llegan como `/uploads/...`; las URL externas se usan tal cual. */
export function resolverFotoMascota(foto: string | null): string | null {
  if (!foto) return null;
  return /^https?:\/\//.test(foto) ? foto : `${MASCOTAS_API_URL}${foto}`;
}
