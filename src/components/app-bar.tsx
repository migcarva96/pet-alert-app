import { router } from 'expo-router';
import { CaretLeftIcon, PawPrintIcon } from 'phosphor-react-native';
import type { ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { Colors, Spacing } from '@/constants/theme';

export type AppBarProps = {
  title?: string;
  /** Muestra la flecha de regreso en lugar del logo (pantallas apiladas). */
  showBack?: boolean;
  right?: ReactNode;
};

export function AppBar({ title, showBack = false, right }: AppBarProps) {
  return (
    <View style={styles.wrapper}>
      <SafeAreaView edges={['top']}>
        <View style={styles.content}>
          {showBack ? (
            <Pressable onPress={() => router.back()} hitSlop={12} style={styles.leading}>
              <CaretLeftIcon size={24} color={Colors.onPrimary} weight="bold" />
            </Pressable>
          ) : (
            <View style={[styles.leading, styles.logo]}>
              <PawPrintIcon size={24} color={Colors.onAccent} weight="fill" />
            </View>
          )}
          {title ? (
            <ThemedText
              type="header3"
              themeColor="onPrimary"
              style={styles.title}
              numberOfLines={1}
            >
              {title}
            </ThemedText>
          ) : null}
          {right ? <View style={styles.right}>{right}</View> : null}
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: Colors.primaryBase,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
    paddingHorizontal: Spacing.three,
    gap: Spacing.three,
  },
  leading: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    borderRadius: 10,
    backgroundColor: Colors.accentBase,
  },
  title: {
    flex: 1,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
});
