import { StyleSheet } from 'react-native';

import { Spacing } from '@/constants/theme';

export const MascotaMapaStyles = StyleSheet.create({
  root: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  footer: {
    gap: Spacing.two,
    padding: Spacing.three,
    borderTopWidth: 1,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
