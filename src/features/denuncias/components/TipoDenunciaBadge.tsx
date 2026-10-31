import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Colors, Spacing } from '@/constants/theme';
import { TipoDenuncia } from '@/services/entities/denuncias/DenunciasTypes';

export function TipoDenunciaBadge({ tipo }: { tipo: TipoDenuncia }) {
  const esPerdida = tipo === TipoDenuncia.Perdida;
  const color = esPerdida ? Colors.warning : Colors.danger;

  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: esPerdida ? Colors.warningSoft : Colors.dangerSoft, borderColor: color },
      ]}
    >
      <View style={[styles.dot, { backgroundColor: color }]} />
      <ThemedText type="caption" themeColor={esPerdida ? 'warning' : 'danger'}>
        {esPerdida ? 'Pérdida' : 'Maltrato'}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
    borderWidth: 1,
    borderRadius: Spacing.four,
    paddingVertical: Spacing.half,
    paddingHorizontal: Spacing.two,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
});
