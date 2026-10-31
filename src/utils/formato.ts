export function formatearFecha(fecha: string | null | undefined) {
  if (!fecha) return '--';
  const date = new Date(fecha);
  if (Number.isNaN(date.getTime())) return '--';
  return date.toLocaleString('es-CO', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatearBytes(bytes: number | undefined) {
  if (bytes === undefined) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function formatearCoordenadas(coordenadas: { latitud: number; longitud: number }) {
  return `${coordenadas.latitud.toFixed(5)}, ${coordenadas.longitud.toFixed(5)}`;
}

/** Convierte cadenas vacías en `null`, que es lo que esperan los campos opcionales de las APIs. */
export function textoOpcional(valor: string) {
  const limpio = valor.trim();
  return limpio === '' ? null : limpio;
}
