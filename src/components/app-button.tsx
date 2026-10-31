import type { ReactNode } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, type ViewStyle } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Colors, Spacing } from '@/constants/theme';

type Variant = 'primary' | 'secondary' | 'danger';

const VARIANTS: Record<
  Variant,
  { background: string; border: string; text: 'onAccent' | 'accentBase' | 'danger' }
> = {
  primary: { background: Colors.accentBase, border: Colors.accentBase, text: 'onAccent' },
  secondary: { background: Colors.surfaceBase, border: Colors.border, text: 'accentBase' },
  danger: { background: Colors.dangerSoft, border: Colors.danger, text: 'danger' },
};

export type AppButtonProps = {
  label: string;
  onPress: () => void;
  variant?: Variant;
  icon?: ReactNode;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
};

export function AppButton({
  label,
  onPress,
  variant = 'primary',
  icon,
  loading = false,
  disabled = false,
  style,
}: AppButtonProps) {
  const colors = VARIANTS[variant];
  const isDisabled = disabled || loading;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: colors.background, borderColor: colors.border },
        (pressed || isDisabled) && styles.dimmed,
        style,
      ]}
    >
      {loading ? <ActivityIndicator color={Colors[colors.text]} /> : icon}
      <ThemedText type="button" themeColor={colors.text}>
        {label}
      </ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.two,
    minHeight: 48,
    borderWidth: 1,
    borderRadius: Spacing.two,
    paddingHorizontal: Spacing.three,
  },
  dimmed: {
    opacity: 0.6,
  },
});
