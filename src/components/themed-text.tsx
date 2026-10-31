import { Text, type TextProps } from 'react-native';

import { ThemeColor, Typography } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type ThemedTextType = keyof typeof Typography;

export type ThemedTextProps = TextProps & {
  type?: ThemedTextType;
  themeColor?: ThemeColor;
};

export function ThemedText({ style, type = 'bodyMedium', themeColor, ...rest }: ThemedTextProps) {
  const theme = useTheme();

  return (
    <Text
      style={[{ color: theme[themeColor ?? 'textPrimary'] }, Typography[type], style]}
      {...rest}
    />
  );
}
