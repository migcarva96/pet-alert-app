import { StyleSheet, TextInput, View, type TextInputProps } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Colors, Spacing, Typography } from '@/constants/theme';

export type TextFieldProps = TextInputProps & {
  label: string;
  required?: boolean;
  error?: string | null;
};

export function TextField({ label, required = false, error, style, ...rest }: TextFieldProps) {
  return (
    <View style={styles.field}>
      <ThemedText type="caption" themeColor="textSecondary">
        {label}
        {required ? <ThemedText themeColor="danger"> *</ThemedText> : null}
      </ThemedText>
      <TextInput
        placeholderTextColor={Colors.textMuted}
        style={[
          styles.input,
          rest.multiline && styles.multiline,
          { borderColor: error ? Colors.danger : Colors.border },
          style,
        ]}
        {...rest}
      />
      {error ? (
        <ThemedText type="caption" themeColor="danger">
          {error}
        </ThemedText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    gap: Spacing.one,
  },
  input: {
    ...Typography.bodyLarge,
    color: Colors.textPrimary,
    backgroundColor: Colors.surfaceBase,
    minHeight: 48,
    borderWidth: 1,
    borderRadius: Spacing.two,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
  },
  multiline: {
    minHeight: 112,
    textAlignVertical: 'top',
  },
});
