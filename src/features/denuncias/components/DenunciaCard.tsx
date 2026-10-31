import { router } from 'expo-router';
import { PaperclipIcon } from 'phosphor-react-native';
import { Pressable, StyleSheet, View } from 'react-native';

import { TipoDenunciaBadge } from './TipoDenunciaBadge';

import { ThemedText } from '@/components/themed-text';
import { Colors, Spacing } from '@/constants/theme';
import type { Denuncia } from '@/services/entities/denuncias/DenunciasTypes';
import { formatearFecha } from '@/utils/formato';

export function DenunciaCard({ denuncia }: { denuncia: Denuncia }) {
  const animal = [denuncia.raza, denuncia.color].filter(Boolean).join(' · ');

  return (
    <Pressable
      onPress={() =>
        router.push({ pathname: '/denuncias/[id]', params: { id: String(denuncia.id) } })
      }
      style={styles.card}
    >
      <View style={styles.header}>
        <TipoDenunciaBadge tipo={denuncia.tipo_denuncia} />
        <ThemedText type="caption" themeColor="textMuted">
          {formatearFecha(denuncia.created_at)}
        </ThemedText>
      </View>

      <ThemedText type="bodyBoldLarge">{denuncia.nombre ?? 'Animal sin nombre'}</ThemedText>
      {animal ? (
        <ThemedText type="caption" themeColor="textSecondary">
          {animal}
          {denuncia.collar_gps ? ` · Collar ${denuncia.collar_gps}` : ''}
        </ThemedText>
      ) : null}

      <ThemedText type="bodyMedium" themeColor="textSecondary" numberOfLines={2}>
        {denuncia.descripcion_denuncia}
      </ThemedText>

      {denuncia.evidencias.length > 0 ? (
        <View style={styles.footer}>
          <PaperclipIcon size={14} color={Colors.textMuted} />
          <ThemedText type="caption" themeColor="textMuted">
            {denuncia.evidencias.length} evidencia{denuncia.evidencias.length === 1 ? '' : 's'}
          </ThemedText>
        </View>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: Spacing.one,
    padding: Spacing.three,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Spacing.two,
    backgroundColor: Colors.surfaceBase,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.one,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
    marginTop: Spacing.one,
  },
});
