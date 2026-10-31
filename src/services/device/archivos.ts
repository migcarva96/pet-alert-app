import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';

import type { ArchivoLocal } from '@/services/entities/archivos/ArchivosTypes';

const MB = 1024 * 1024;

/** Límites de las APIs: foto JPG/PNG/WEBP de 5 MB; evidencias además PDF/MP4 de 20 MB. */
export const TIPOS_IMAGEN: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
};

export const TIPOS_EVIDENCIA: Record<string, string> = {
  ...TIPOS_IMAGEN,
  'application/pdf': 'pdf',
  'video/mp4': 'mp4',
};

export const MAX_FOTO_BYTES = 5 * MB;
export const MAX_EVIDENCIA_BYTES = 20 * MB;

const EXTENSION_A_MIME: Record<string, string> = {
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
  pdf: 'application/pdf',
  mp4: 'video/mp4',
};

export class ArchivoInvalidoError extends Error {}

function inferirMime(nombre: string | null | undefined, mime: string | null | undefined) {
  if (mime) return mime;
  const extension = nombre?.split('.').pop()?.toLowerCase() ?? '';
  return EXTENSION_A_MIME[extension] ?? 'application/octet-stream';
}

/**
 * Las APIs verifican que la extensión del nombre coincida con el MIME, así que el
 * nombre se reconstruye a partir del tipo detectado.
 */
function normalizar(
  uri: string,
  nombreOriginal: string | null | undefined,
  mimeOriginal: string | null | undefined,
  size: number | undefined,
  permitidos: Record<string, string>,
  maxBytes: number,
): ArchivoLocal {
  const mimeType = inferirMime(nombreOriginal, mimeOriginal);
  const extension = permitidos[mimeType];
  if (!extension) {
    const formatos = [...new Set(Object.values(permitidos))].join(', ').toUpperCase();
    throw new ArchivoInvalidoError(`Formato no permitido. Usa ${formatos}.`);
  }
  if (size !== undefined && size > maxBytes) {
    throw new ArchivoInvalidoError(`El archivo supera el máximo de ${maxBytes / MB} MB.`);
  }

  const base = nombreOriginal?.replace(/\.[^.]+$/, '') || `archivo-${Date.now()}`;
  return { uri, name: `${base}.${extension}`, mimeType, size };
}

export type OrigenImagen = 'camara' | 'galeria';

async function lanzarSelectorImagen(
  origen: OrigenImagen,
  opciones: ImagePicker.ImagePickerOptions,
) {
  const permiso =
    origen === 'camara'
      ? await ImagePicker.requestCameraPermissionsAsync()
      : await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!permiso.granted) {
    throw new ArchivoInvalidoError(
      origen === 'camara' ? 'Se necesita permiso de cámara.' : 'Se necesita permiso de galería.',
    );
  }

  const comunes: ImagePicker.ImagePickerOptions = {
    quality: 0.8,
    // En iOS convierte HEIC a JPEG; la API no acepta HEIC.
    preferredAssetRepresentationMode:
      ImagePicker.UIImagePickerPreferredAssetRepresentationMode.Compatible,
    ...opciones,
  };

  const resultado =
    origen === 'camara'
      ? await ImagePicker.launchCameraAsync(comunes)
      : await ImagePicker.launchImageLibraryAsync(comunes);

  return resultado.canceled ? [] : resultado.assets;
}

/** Una imagen para la foto principal. `null` si el usuario canceló. */
export async function elegirFoto(origen: OrigenImagen): Promise<ArchivoLocal | null> {
  const [asset] = await lanzarSelectorImagen(origen, { mediaTypes: 'images' });
  if (!asset) return null;
  return normalizar(
    asset.uri,
    asset.fileName,
    asset.mimeType,
    asset.fileSize,
    TIPOS_IMAGEN,
    MAX_FOTO_BYTES,
  );
}

/** Fotos o videos de la cámara/galería como evidencias. */
export async function elegirEvidenciasMultimedia(
  origen: OrigenImagen,
  limite: number,
): Promise<ArchivoLocal[]> {
  const assets = await lanzarSelectorImagen(origen, {
    mediaTypes: origen === 'camara' ? 'images' : ['images', 'videos'],
    allowsMultipleSelection: origen === 'galeria' && limite > 1,
    selectionLimit: limite,
  });
  return assets
    .slice(0, limite)
    .map((asset) =>
      normalizar(
        asset.uri,
        asset.fileName,
        asset.mimeType,
        asset.fileSize,
        TIPOS_EVIDENCIA,
        MAX_EVIDENCIA_BYTES,
      ),
    );
}

/** PDF, MP4 o imágenes desde el explorador de archivos. */
export async function elegirEvidenciasDocumento(limite: number): Promise<ArchivoLocal[]> {
  const resultado = await DocumentPicker.getDocumentAsync({
    type: Object.keys(TIPOS_EVIDENCIA),
    multiple: limite > 1,
    copyToCacheDirectory: true,
  });
  if (resultado.canceled) return [];

  return resultado.assets
    .slice(0, limite)
    .map((asset) =>
      normalizar(
        asset.uri,
        asset.name,
        asset.mimeType,
        asset.size,
        TIPOS_EVIDENCIA,
        MAX_EVIDENCIA_BYTES,
      ),
    );
}
