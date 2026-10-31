# PetAlert 🐾

Aplicación móvil (iOS y Android) para registrar mascotas, ubicarlas en un mapa y reportar casos de **pérdida** o **maltrato** animal. Es el cliente del proyecto final de _Sistemas Distribuidos_ (EAFIT): consume dos microservicios independientes, uno de mascotas y otro de denuncias.

Construida con [Expo](https://expo.dev) SDK 58, React Native, TypeScript y Expo Router.

## Funcionalidades

### Mascotas

- Listado de mascotas registradas.
- Registro con nombre, raza, color, collar GPS (opcional), ubicación actual del dispositivo y foto (desde cámara/galería o por URL).
- Detalle de la mascota con su **historial de denuncias**, cruzado por el código del collar GPS.
- Mapa con la última ubicación conocida (Apple Maps en iOS, Google Maps en Android).
- Eliminación de mascotas.

### Denuncias

- Feed paginado (20 por página, scroll infinito) con filtros por tipo, nombre, collar GPS y rango de fechas.
- Crear y editar denuncias de tipo _Pérdida_ o _Maltrato_, con datos de la mascota y del denunciante.
- Foto principal (JPG/PNG/WEBP, máx. 5 MB) y hasta 5 evidencias (imágenes, PDF o MP4, máx. 20 MB c/u).
- Detalle de la denuncia con sus evidencias adjuntas.

### Próximamente

- **Servicios**: agenda de spa, peluquería, guardería, paseos y veterinaria.
- **Mercado**: tienda de alimentos, accesorios y productos de salud.

Estas pestañas existen como pantallas informativas, sin lógica aún.

## Arquitectura

```
┌──────────────────────┐   HTTP (JSON / multipart)
│   PetAlert (Expo)    │
│                      │
│  mascotasService  ───┼──▶  API Mascotas  (:3000)
│  denunciasService ───┼──▶  API Denuncias (:3001)
└──────────────────────┘
```

- Cada servicio tiene su propio cliente `axios` ([src/services/api/client.ts](src/services/api/client.ts)). Ambos responden los errores como `{ codigo, mensaje }`, que la app normaliza en `ApiError`.
- Las fotos y evidencias se envían como `multipart/form-data`. La app valida formato y tamaño antes de subir y reconstruye el nombre del archivo para que la extensión coincida con el MIME (requisito de las APIs).
- Las pantallas siguen un patrón **MVVM**: cada pantalla (`*Screen.tsx`) tiene su hook `use*ViewModel.ts` con el estado y la lógica, y un archivo `*Styles.ts`.

## Estructura del proyecto

```
src/
├── app/                    # Rutas (Expo Router). Solo definen pantallas y navegación
│   ├── (tabs)/             # Pestañas: Mascotas, Denuncias, Reportar, Servicios, Mercado
│   ├── mascotas/           # nueva, [id], [id]/mapa
│   └── denuncias/          # nueva, [id], [id]/editar
├── features/               # Pantallas por dominio (Screen + ViewModel + Styles)
│   ├── mascotas/           # lista, registrar, detalle, mapa
│   ├── denuncias/          # feed, formulario, detalle
│   ├── servicios/
│   └── mercado/
├── components/             # Componentes de UI reutilizables
├── services/
│   ├── api/                # Clientes HTTP y servicios de cada microservicio
│   ├── device/             # Cámara, galería, documentos y ubicación
│   └── entities/           # Tipos de dominio (Mascota, Denuncia, Archivo)
├── constants/theme.ts      # Colores y tipografía (Open Sans)
├── hooks/
└── utils/                  # Formato de fechas y helpers de mapas
```

## Requisitos

- Node.js LTS y npm.
- Los microservicios de **mascotas** y **denuncias** corriendo y accesibles desde el dispositivo.
- Un **development build**: la app usa módulos nativos (`expo-maps`, entre otros) que no están en Expo Go.
- Xcode (iOS) o Android Studio (Android) para compilar localmente, o una cuenta de [EAS](https://docs.expo.dev/eas/) para compilar en la nube.

## Configuración

Copia el archivo de ejemplo y ajusta los valores:

```bash
cp .env.example .env
```

| Variable                        | Descripción                                                                                          |
| ------------------------------- | ---------------------------------------------------------------------------------------------------- |
| `EXPO_PUBLIC_MASCOTAS_API_URL`  | URL base del servicio de mascotas (por defecto `http://localhost:3000`).                             |
| `EXPO_PUBLIC_DENUNCIAS_API_URL` | URL base del servicio de denuncias (por defecto `http://localhost:3001`).                            |
| `GOOGLE_MAPS_ANDROID_API_KEY`   | Llave de Google Maps para Android. Solo se usa al generar el build, no viaja en el bundle de la app. |

> En un dispositivo físico `localhost` apunta al teléfono. Usa la IP LAN de tu computador, p. ej. `http://192.168.1.10:3000`.

## Ejecución

```bash
npm install

# Compila e instala el development build (la primera vez o al cambiar dependencias nativas)
npm run ios        # o: npm run android

# En adelante basta con iniciar el servidor de desarrollo
npm start
```

## Scripts

| Comando                | Descripción                        |
| ---------------------- | ---------------------------------- |
| `npm start`            | Servidor de desarrollo de Expo.    |
| `npm run ios`          | Compila y abre la app en iOS.      |
| `npm run android`      | Compila y abre la app en Android.  |
| `npm run lint`         | ESLint (`expo lint`).              |
| `npm run typecheck`    | Verificación de tipos con `tsc`.   |
| `npm run format`       | Formatea el código con Prettier.   |
| `npm run format:check` | Verifica el formato sin modificar. |

Para instalar dependencias usa siempre `npx expo install <paquete>`, que elige versiones compatibles con el SDK.

## Stack

- **Expo SDK 58** · React Native 0.88 · React 19 · TypeScript
- **Expo Router** con rutas tipadas y React Compiler
- `expo-maps`, `expo-location`, `expo-image-picker`, `expo-document-picker`, `expo-image`
- `axios` para HTTP, `phosphor-react-native` para íconos, Open Sans como tipografía

## Licencia

Ver [LICENSE](LICENSE).
