import { HourglassIcon, type Icon } from 'phosphor-react-native';
import { ScrollView, StyleSheet, View } from 'react-native';

import { AppBar } from '@/components/app-bar';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors, Spacing } from '@/constants/theme';

export type ComingSoonItem = {
  icon: Icon;
  titulo: string;
  descripcion: string;
};

export type ComingSoonProps = {
  /** Título de la barra superior. */
  appBarTitle: string;
  icon: Icon;
  titulo: string;
  descripcion: string;
  items: ComingSoonItem[];
};

/** Pantalla de una funcionalidad anunciada que todavía no está disponible. */
export function ComingSoon({
  appBarTitle,
  icon: HeroIcon,
  titulo,
  descripcion,
  items,
}: ComingSoonProps) {
  return (
    <ThemedView style={styles.root}>
      <AppBar title={appBarTitle} />

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.hero}>
          <View style={styles.heroIcon}>
            <HeroIcon size={56} color={Colors.accentBase} weight="duotone" />
          </View>

          <View style={styles.badge}>
            <HourglassIcon size={14} color={Colors.warning} weight="bold" />
            <ThemedText type="caption" themeColor="warning">
              Próximamente
            </ThemedText>
          </View>

          <ThemedText type="header2" style={styles.centeredText}>
            {titulo}
          </ThemedText>
          <ThemedText type="bodyLarge" themeColor="textSecondary" style={styles.centeredText}>
            {descripcion}
          </ThemedText>
        </View>

        <View style={styles.items}>
          {items.map(({ icon: ItemIcon, titulo: itemTitulo, descripcion: itemDescripcion }) => (
            <View key={itemTitulo} style={styles.item}>
              <View style={styles.itemIcon}>
                <ItemIcon size={24} color={Colors.accentBase} />
              </View>
              <View style={styles.itemText}>
                <ThemedText type="bodyBoldLarge">{itemTitulo}</ThemedText>
                <ThemedText type="bodyMedium" themeColor="textSecondary">
                  {itemDescripcion}
                </ThemedText>
              </View>
            </View>
          ))}
        </View>

        <ThemedText type="caption" themeColor="textMuted" style={styles.centeredText}>
          Estamos trabajando en esta funcionalidad. Te avisaremos cuando esté disponible.
        </ThemedText>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  content: {
    padding: Spacing.three,
    paddingTop: Spacing.five,
    gap: Spacing.four,
  },
  hero: {
    alignItems: 'center',
    gap: Spacing.two,
  },
  heroIcon: {
    width: 112,
    height: 112,
    borderRadius: 56,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.accentSoftTint,
    marginBottom: Spacing.two,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
    borderWidth: 1,
    borderColor: Colors.warning,
    borderRadius: Spacing.four,
    backgroundColor: Colors.warningSoft,
    paddingVertical: Spacing.half,
    paddingHorizontal: Spacing.two,
  },
  centeredText: {
    textAlign: 'center',
  },
  items: {
    gap: Spacing.two,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    padding: Spacing.three,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Spacing.two,
    backgroundColor: Colors.surfaceBase,
    opacity: 0.85,
  },
  itemIcon: {
    width: 44,
    height: 44,
    borderRadius: Spacing.two,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surfaceElevated,
  },
  itemText: {
    flex: 1,
    gap: Spacing.half,
  },
});
