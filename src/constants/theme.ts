/**
 * Paleta de colores centralizada de la app (Slate Ink & Premium Navy — modo claro).
 * Cualquier color usado en pantallas debe salir de aquí, nunca como hex inline en un componente.
 */

import {
  OpenSans_400Regular,
  OpenSans_500Medium,
  OpenSans_600SemiBold,
  OpenSans_700Bold,
} from '@expo-google-fonts/open-sans';
import { Platform } from 'react-native';

export const Colors = {
  // Marca y acento
  primaryBase: '#182238',
  primaryPress: '#0F1728',
  primarySoft: '#2D3E61',
  accentBase: '#3B7BBA',
  accentLight: '#5E9ED8',
  accentSoftTint: '#EBF3FA',

  // Neutros
  backgroundMain: '#F8FAFC',
  surfaceBase: '#FFFFFF',
  surfaceElevated: '#F1F5F9',
  border: '#E2E8F0',
  textMuted: '#94A3B8',
  textSecondary: '#64748B',
  textPrimary: '#0F172A',

  // Estados
  success: '#0D9488',
  successSoft: '#F0FDF4',
  warning: '#D97706',
  warningSoft: '#FFFBEB',
  danger: '#DC2626',
  dangerSoft: '#FEF2F2',
  info: '#2563EB',
  infoSoft: '#EFF6FF',

  // Texto sobre fondos de color (siempre blanco por contraste WCAG)
  onPrimary: '#FFFFFF',
  onAccent: '#FFFFFF',
} as const;

export type ThemeColor = keyof typeof Colors;

/** Archivos de Open Sans que `useFonts` carga en el layout raíz. */
export const FontAssets = {
  OpenSans_400Regular,
  OpenSans_500Medium,
  OpenSans_600SemiBold,
  OpenSans_700Bold,
};

/** Con `useFonts` el nombre de familia es la clave registrada, igual en iOS y Android. */
export const FontFamily = {
  regular: 'OpenSans_400Regular',
  medium: 'OpenSans_500Medium',
  semiBold: 'OpenSans_600SemiBold',
  bold: 'OpenSans_700Bold',
} as const;

export const Typography = {
  header1: { fontFamily: FontFamily.bold, fontSize: 28, lineHeight: 36, letterSpacing: -0.56 },
  header2: { fontFamily: FontFamily.semiBold, fontSize: 22, lineHeight: 28, letterSpacing: -0.22 },
  header3: { fontFamily: FontFamily.semiBold, fontSize: 18, lineHeight: 24, letterSpacing: 0 },
  bodyLarge: { fontFamily: FontFamily.regular, fontSize: 16, lineHeight: 22, letterSpacing: 0 },
  bodyBoldLarge: {
    fontFamily: FontFamily.semiBold,
    fontSize: 16,
    lineHeight: 22,
    letterSpacing: 0,
  },
  bodyMedium: { fontFamily: FontFamily.regular, fontSize: 14, lineHeight: 20, letterSpacing: 0 },
  caption: { fontFamily: FontFamily.medium, fontSize: 12, lineHeight: 16, letterSpacing: 0.12 },
  button: { fontFamily: FontFamily.semiBold, fontSize: 14, lineHeight: 20, letterSpacing: 0.14 },
} as const;

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
