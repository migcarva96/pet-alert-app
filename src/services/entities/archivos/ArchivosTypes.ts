/** Archivo elegido en el dispositivo (cámara, galería o documentos) listo para multipart. */
export type ArchivoLocal = {
  uri: string;
  name: string;
  mimeType: string;
  size?: number;
};
