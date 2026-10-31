import { StyleSheet } from 'react-native';

import { Spacing } from '@/constants/theme';

export const DenunciaFormStyles = StyleSheet.create({
  root: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  content: {
    padding: Spacing.three,
    gap: Spacing.three,
  },
  section: {
    gap: Spacing.three,
  },
  sectionTitle: {
    marginTop: Spacing.two,
  },
  banner: {
    padding: Spacing.three,
    borderWidth: 1,
    borderRadius: Spacing.two,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: {
    gap: Spacing.two,
    paddingTop: Spacing.two,
    paddingBottom: Spacing.three,
  },
});
