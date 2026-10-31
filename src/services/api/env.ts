// En un dispositivo físico `localhost` es el teléfono: usar la IP LAN del computador en `.env`.
export const MASCOTAS_API_URL = process.env.EXPO_PUBLIC_MASCOTAS_API_URL ?? 'http://localhost:3000';

export const DENUNCIAS_API_URL =
  process.env.EXPO_PUBLIC_DENUNCIAS_API_URL ?? 'http://localhost:3001';
