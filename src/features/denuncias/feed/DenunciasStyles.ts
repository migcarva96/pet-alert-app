import { StyleSheet } from 'react-native';

import { Spacing } from '@/constants/theme';

export const DenunciasStyles = StyleSheet.create({
  root: {
    flex: 1,
  },
  filters: {
    gap: Spacing.two,
    padding: Spacing.three,
    borderBottomWidth: 1,
  },
  searchRow: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderRadius: Spacing.two,
    paddingHorizontal: Spacing.three,
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
  footer: {
    paddingVertical: Spacing.three,
    alignItems: 'center',
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
