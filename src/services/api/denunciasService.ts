import {
  MULTIPART_HEADERS,
  UPLOAD_TIMEOUT_MS,
  denunciasClient,
  toApiError,
  toFormDataFile,
} from './client';

import type {
  ApiRespuesta,
  Denuncia,
  DenunciaGuardada,
  DenunciaInput,
  DenunciasPagina,
  DenunciasQuery,
} from '@/services/entities/denuncias/DenunciasTypes';

function toFormData({ datos, foto, evidencias }: DenunciaInput) {
  const form = new FormData();
  form.append('datos', JSON.stringify(datos));
  if (foto) form.append('foto', toFormDataFile(foto));
  for (const evidencia of evidencias) {
    form.append('evidencias', toFormDataFile(evidencia));
  }
  return form;
}

export async function getDenuncias(query: DenunciasQuery): Promise<DenunciasPagina> {
  // La API rechaza parámetros vacíos (esquema estricto), así que se omiten.
  const params = Object.fromEntries(
    Object.entries(query).filter(([, valor]) => valor !== undefined && valor !== ''),
  );

  try {
    const { data } = await denunciasClient.get<DenunciasPagina>('/api/denuncias', { params });
    return { total: data.total, page: data.page, limit: data.limit, data: data.data };
  } catch (err) {
    throw toApiError(err, 'No se pudieron obtener las denuncias');
  }
}

export async function getDenuncia(id: Denuncia['id']): Promise<Denuncia> {
  try {
    const { data } = await denunciasClient.get<ApiRespuesta<Denuncia>>(`/api/denuncias/${id}`);
    return data.data;
  } catch (err) {
    throw toApiError(err, 'No se pudo obtener la denuncia');
  }
}

export async function crearDenuncia(input: DenunciaInput): Promise<DenunciaGuardada> {
  try {
    const { data } = await denunciasClient.post<DenunciaGuardada>(
      '/api/denuncias',
      toFormData(input),
      { headers: MULTIPART_HEADERS, timeout: UPLOAD_TIMEOUT_MS },
    );
    return data;
  } catch (err) {
    throw toApiError(err, 'No se pudo crear la denuncia');
  }
}

/** Reemplazo completo de los datos; los archivos nuevos se suman a los existentes. */
export async function editarDenuncia(
  id: Denuncia['id'],
  input: DenunciaInput,
): Promise<DenunciaGuardada> {
  try {
    const { data } = await denunciasClient.put<DenunciaGuardada>(
      `/api/denuncias/${id}`,
      toFormData(input),
      { headers: MULTIPART_HEADERS, timeout: UPLOAD_TIMEOUT_MS },
    );
    return data;
  } catch (err) {
    throw toApiError(err, 'No se pudo actualizar la denuncia');
  }
}
