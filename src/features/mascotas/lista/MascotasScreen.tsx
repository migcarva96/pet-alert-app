import { router } from 'expo-router';
import { CaretRightIcon, CellSignalFullIcon, PawPrintIcon, PlusIcon } from 'phosphor-react-native';
import { ActivityIndicator, FlatList, Pressable, RefreshControl, View } from 'react-native';

import { MascotasStyles } from './MascotasStyles';
import { useMascotasViewModel } from './useMascotasViewModel';

import { AppBar } from '@/components/app-bar';
import { EmptyState } from '@/components/empty-state';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { MascotaAvatar } from '@/features/mascotas/components/MascotaAvatar';
import { useTheme } from '@/hooks/use-theme';
import type { Mascota } from '@/services/entities/mascotas/MascotasTypes';

export function MascotasScreen() {
  const { mascotas, isLoading, isRefreshing, error, refetch } = useMascotasViewModel();
  const theme = useTheme();

  function renderItem({ item }: { item: Mascota }) {
    return (
      <Pressable
        onPress={() => router.push({ pathname: '/mascotas/[id]', params: { id: String(item.id) } })}
        style={[
          MascotasStyles.card,
          { backgroundColor: theme.surfaceBase, borderColor: theme.border },
        ]}
      >
        <MascotaAvatar foto={item.foto} size={64} />
        <View style={MascotasStyles.cardBody}>
          <ThemedText type="bodyBoldLarge">{item.nombre}</ThemedText>
          <ThemedText type="bodyMedium" themeColor="textSecondary">
            {item.raza} · {item.color}
          </ThemedText>
          {item.collar_gps ? (
            <View style={[MascotasStyles.badge, { backgroundColor: theme.successSoft }]}>
              <CellSignalFullIcon size={12} color={theme.success} weight="bold" />
              <ThemedText type="caption" themeColor="success">
                {item.collar_gps}
              </ThemedText>
            </View>
          ) : null}
        </View>
        <CaretRightIcon size={20} color={theme.textMuted} />
      </Pressable>
    );
  }

  return (
    <ThemedView style={MascotasStyles.root}>
      <AppBar
        title="Mis mascotas"
        right={
          <Pressable hitSlop={12} onPress={() => router.push('/mascotas/nueva')}>
            <PlusIcon size={24} color={theme.onPrimary} weight="bold" />
          </Pressable>
        }
      />

      {error && mascotas.length > 0 ? (
        <ThemedText type="bodyMedium" themeColor="danger" style={MascotasStyles.error}>
          {error}
        </ThemedText>
      ) : null}

      {isLoading ? (
        <View style={MascotasStyles.centered}>
          <ActivityIndicator color={theme.accentBase} />
        </View>
      ) : (
        <FlatList
          style={MascotasStyles.list}
          contentContainerStyle={[
            MascotasStyles.listContent,
            mascotas.length === 0 && MascotasStyles.listContentEmpty,
          ]}
          data={mascotas}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={refetch}
              tintColor={theme.accentBase}
              colors={[theme.accentBase]}
            />
          }
          ListEmptyComponent={
            <EmptyState
              icon={PawPrintIcon}
              message={error ?? 'Aún no tienes mascotas registradas'}
              actionLabel={error ? 'Reintentar' : 'Registrar mascota'}
              onAction={error ? refetch : () => router.push('/mascotas/nueva')}
            />
          }
        />
      )}
    </ThemedView>
  );
}
