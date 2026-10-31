import { Image } from 'expo-image';
import { CameraIcon, ImageIcon, TrashIcon } from 'phosphor-react-native';
import { Alert, StyleSheet, View } from 'react-native';

import { AppButton } from '@/components/app-button';
import { ThemedText } from '@/components/themed-text';
import { Colors, Spacing } from '@/constants/theme';
import { elegirFoto, type OrigenImagen } from '@/services/device/archivos';
import type { ArchivoLocal } from '@/services/entities/archivos/ArchivosTypes';

export type PhotoPickerFieldProps = {
  label: string;
  value: ArchivoLocal | null;
  onChange: (archivo: ArchivoLocal | null) => void;
  hint?: string;
};

export function PhotoPickerField({ label, value, onChange, hint }: PhotoPickerFieldProps) {
  async function elegir(origen: OrigenImagen) {
    try {
      const archivo = await elegirFoto(origen);
      if (archivo) onChange(archivo);
    } catch (err) {
      Alert.alert('Foto', err instanceof Error ? err.message : 'No se pudo cargar la foto');
    }
  }

  return (
    <View style={styles.field}>
      <ThemedText type="caption" themeColor="textSecondary">
        {label}
      </ThemedText>

      {value ? (
        <View style={styles.previewRow}>
          <Image source={{ uri: value.uri }} style={styles.preview} contentFit="cover" />
          <View style={styles.previewInfo}>
            <ThemedText type="bodyMedium" numberOfLines={1}>
              {value.name}
            </ThemedText>
            <AppButton
              label="Quitar"
              variant="danger"
              onPress={() => onChange(null)}
              icon={<TrashIcon size={18} color={Colors.danger} />}
            />
          </View>
        </View>
      ) : (
        <View style={styles.actions}>
          <AppButton
            label="Cámara"
            variant="secondary"
            style={styles.action}
            onPress={() => elegir('camara')}
            icon={<CameraIcon size={20} color={Colors.accentBase} />}
          />
          <AppButton
            label="Galería"
            variant="secondary"
            style={styles.action}
            onPress={() => elegir('galeria')}
            icon={<ImageIcon size={20} color={Colors.accentBase} />}
          />
        </View>
      )}

      {hint ? (
        <ThemedText type="caption" themeColor="textMuted">
          {hint}
        </ThemedText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    gap: Spacing.two,
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  action: {
    flex: 1,
  },
  previewRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  preview: {
    width: 96,
    height: 96,
    borderRadius: Spacing.two,
    backgroundColor: Colors.surfaceElevated,
  },
  previewInfo: {
    flex: 1,
    gap: Spacing.two,
  },
});
