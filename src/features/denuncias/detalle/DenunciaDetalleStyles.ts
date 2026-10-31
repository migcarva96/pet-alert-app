import { StyleSheet } from 'react-native';

import { Spacing } from '@/constants/theme';

export const DenunciaDetalleStyles = StyleSheet.create({
  root: {
    flex: 1,
  },
  content: {
    padding: Spacing.three,
    gap: Spacing.four,
  },
  header: {
    gap: Spacing.two,
  },
  section: {
    gap: Spacing.two,
  },
  card: {
    gap: Spacing.two,
    padding: Spacing.three,
    borderWidth: 1,
    borderRadius: Spacing.two,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  rowText: {
    flex: 1,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
