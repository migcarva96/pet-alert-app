import { CameraIcon, ImageIcon, PaperclipIcon, XIcon } from 'phosphor-react-native';
import { Alert, Pressable, StyleSheet, View } from 'react-native';

import { AppButton } from '@/components/app-button';
import { FileIcon } from '@/components/file-icon';
import { ThemedText } from '@/components/themed-text';
import { Colors, Spacing } from '@/constants/theme';
import {
  elegirEvidenciasDocumento,
  elegirEvidenciasMultimedia,
  type OrigenImagen,
} from '@/services/device/archivos';
import type { ArchivoLocal } from '@/services/entities/archivos/ArchivosTypes';
import { formatearBytes } from '@/utils/formato';

export type EvidenciasFieldProps = {
  value: ArchivoLocal[];
  onChange: (archivos: ArchivoLocal[]) => void;
  /** Cupo disponible: la API admite 5 evidencias acumuladas por denuncia. */
  maximo: number;
};

export function EvidenciasField({ value, onChange, maximo }: EvidenciasFieldProps) {
  const disponibles = maximo - value.length;

  async function agregar(elegir: () => Promise<ArchivoLocal[]>) {
    try {
      const nuevos = await elegir();
      onChange([...value, ...nuevos].slice(0, maximo));
    } catch (err) {
      Alert.alert('Evidencias', err instanceof Error ? err.message : 'No se pudo adjuntar');
    }
  }

  const multimedia = (origen: OrigenImagen) => () =>
    agregar(() => elegirEvidenciasMultimedia(origen, disponibles));

  return (
    <View style={styles.field}>
      <ThemedText type="caption" themeColor="textSecondary">
        Evidencias ({value.length}/{maximo})
      </ThemedText>

      {value.map((archivo, index) => (
        <View key={`${archivo.uri}-${index}`} style={styles.item}>
          <FileIcon mimeType={archivo.mimeType} />
          <View style={styles.itemInfo}>
            <ThemedText type="bodyMedium" numberOfLines={1}>
              {archivo.name}
            </ThemedText>
            <ThemedText type="caption" themeColor="textMuted">
              {formatearBytes(archivo.size)}
            </ThemedText>
          </View>
          <Pressable hitSlop={8} onPress={() => onChange(value.filter((_, i) => i !== index))}>
            <XIcon size={20} color={Colors.textSecondary} />
          </Pressable>
        </View>
      ))}

      {disponibles > 0 ? (
        <View style={styles.actions}>
          <AppButton
            label="Cámara"
            variant="secondary"
            style={styles.action}
            onPress={multimedia('camara')}
            icon={<CameraIcon size={18} color={Colors.accentBase} />}
          />
          <AppButton
            label="Galería"
            variant="secondary"
            style={styles.action}
            onPress={multimedia('galeria')}
            icon={<ImageIcon size={18} color={Colors.accentBase} />}
          />
          <AppButton
            label="Archivo"
            variant="secondary"
            style={styles.action}
            onPress={() => agregar(() => elegirEvidenciasDocumento(disponibles))}
            icon={<PaperclipIcon size={18} color={Colors.accentBase} />}
          />
        </View>
      ) : null}

      <ThemedText type="caption" themeColor="textMuted">
        JPG, PNG, WEBP, PDF o MP4 de hasta 20 MB cada una.
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    gap: Spacing.two,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    padding: Spacing.three,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Spacing.two,
    backgroundColor: Colors.surfaceBase,
  },
  itemInfo: {
    flex: 1,
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  action: {
    flex: 1,
    paddingHorizontal: Spacing.two,
  },
});
