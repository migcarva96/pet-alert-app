import { StyleSheet } from 'react-native';

import { Spacing } from '@/constants/theme';

export const MascotaDetalleStyles = StyleSheet.create({
  root: {
    flex: 1,
  },
  content: {
    padding: Spacing.three,
    gap: Spacing.four,
  },
  hero: {
    alignItems: 'center',
    gap: Spacing.two,
  },
  heroText: {
    textAlign: 'center',
  },
  section: {
    gap: Spacing.two,
  },
  infoCard: {
    borderWidth: 1,
    borderRadius: Spacing.two,
    paddingHorizontal: Spacing.three,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: Spacing.three,
    paddingVertical: Spacing.three,
  },
  infoRowBorder: {
    borderBottomWidth: 1,
  },
  infoValue: {
    flexShrink: 1,
    textAlign: 'right',
  },
  mapPreview: {
    height: 180,
    borderWidth: 1,
    borderRadius: Spacing.two,
    overflow: 'hidden',
  },
  mapPreviewMap: {
    flex: 1,
  },
  mapPreviewBadge: {
    position: 'absolute',
    right: Spacing.two,
    bottom: Spacing.two,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
    borderRadius: Spacing.four,
    paddingVertical: Spacing.one,
    paddingHorizontal: Spacing.two,
  },
  actions: {
    gap: Spacing.two,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
