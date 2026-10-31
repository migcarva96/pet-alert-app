import { StyleSheet } from 'react-native';

import { Spacing } from '@/constants/theme';

export const RegistrarMascotaStyles = StyleSheet.create({
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
    gap: Spacing.two,
  },
  mapPreview: {
    height: 160,
    borderWidth: 1,
    borderRadius: Spacing.two,
    overflow: 'hidden',
  },
  mapPreviewMap: {
    flex: 1,
  },
  mapRemoveButton: {
    position: 'absolute',
    top: Spacing.two,
    right: Spacing.two,
    padding: Spacing.one,
    borderWidth: 1,
    borderRadius: Spacing.four,
  },
  footer: {
    paddingTop: Spacing.two,
  },
});
