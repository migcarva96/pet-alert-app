import type { Icon } from 'phosphor-react-native';
import { StyleSheet, View } from 'react-native';

import { AppButton } from '@/components/app-button';
import { ThemedText } from '@/components/themed-text';
import { Colors, Spacing } from '@/constants/theme';

export type EmptyStateProps = {
  icon: Icon;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
};

export function EmptyState({
  icon: IconComponent,
  message,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <View style={styles.centered}>
      <IconComponent size={80} weight="thin" color={Colors.accentBase} />
      <ThemedText type="bodyMedium" themeColor="accentBase" style={styles.text}>
        {message}
      </ThemedText>
      {actionLabel && onAction ? (
        <AppButton label={actionLabel} onPress={onAction} variant="secondary" />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.two,
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.five,
  },
  text: {
    textAlign: 'center',
  },
});
