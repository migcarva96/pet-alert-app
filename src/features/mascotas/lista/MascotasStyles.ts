import { StyleSheet } from 'react-native';

import { Spacing } from '@/constants/theme';

export const MascotasStyles = StyleSheet.create({
  root: {
    flex: 1,
  },
  list: {
    flex: 1,
  },
  listContent: {
    padding: Spacing.three,
    gap: Spacing.two,
  },
  listContentEmpty: {
    flexGrow: 1,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    padding: Spacing.three,
    borderWidth: 1,
    borderRadius: Spacing.two,
  },
  cardBody: {
    flex: 1,
    gap: Spacing.half,
  },
  badge: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
    borderRadius: Spacing.four,
    paddingVertical: Spacing.half,
    paddingHorizontal: Spacing.two,
    marginTop: Spacing.one,
  },
  error: {
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.three,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
