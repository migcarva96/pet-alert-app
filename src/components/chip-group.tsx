import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Colors, Spacing } from '@/constants/theme';

export type ChipOption<T> = { value: T; label: string };

export type ChipGroupProps<T> = {
  options: ChipOption<T>[];
  value: T;
  onChange: (value: T) => void;
};

export function ChipGroup<T extends string | number | null>({
  options,
  value,
  onChange,
}: ChipGroupProps<T>) {
  return (
    <View style={styles.group}>
      {options.map((option) => {
        const activo = option.value === value;

        return (
          <Pressable
            key={String(option.value)}
            onPress={() => onChange(option.value)}
            style={[
              styles.chip,
              {
                backgroundColor: activo ? Colors.primarySoft : Colors.surfaceBase,
                borderColor: activo ? Colors.primarySoft : Colors.border,
              },
            ]}
          >
            <ThemedText type="caption" themeColor={activo ? 'onPrimary' : 'textSecondary'}>
              {option.label}
            </ThemedText>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  group: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  chip: {
    height: 36,
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: Spacing.four,
    paddingHorizontal: Spacing.three,
  },
});
