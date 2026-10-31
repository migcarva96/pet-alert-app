import { SirenIcon } from 'phosphor-react-native';
import { ActivityIndicator, FlatList, RefreshControl, TextInput, View } from 'react-native';

import { DenunciasStyles } from './DenunciasStyles';
import { useDenunciasViewModel, type RangoFecha } from './useDenunciasViewModel';

import { AppBar } from '@/components/app-bar';
import { ChipGroup, type ChipOption } from '@/components/chip-group';
import { EmptyState } from '@/components/empty-state';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Typography } from '@/constants/theme';
import { DenunciaCard } from '@/features/denuncias/components/DenunciaCard';
import { useTheme } from '@/hooks/use-theme';
import { TipoDenuncia, type Denuncia } from '@/services/entities/denuncias/DenunciasTypes';

const OPCIONES_TIPO: ChipOption<TipoDenuncia | null>[] = [
  { value: null, label: 'Todas' },
  { value: TipoDenuncia.Perdida, label: 'Pérdida' },
  { value: TipoDenuncia.Maltrato, label: 'Maltrato' },
];

const OPCIONES_RANGO: ChipOption<RangoFecha>[] = [
  { value: 'todo', label: 'Siempre' },
  { value: 'hoy', label: 'Hoy' },
  { value: '7-dias', label: '7 días' },
  { value: '30-dias', label: '30 días' },
];

export function DenunciasScreen() {
  const vm = useDenunciasViewModel();
  const theme = useTheme();
  const inputStyle = [
    DenunciasStyles.searchInput,
    Typography.bodyMedium,
    { borderColor: theme.border, backgroundColor: theme.surfaceBase, color: theme.textPrimary },
  ];

  return (
    <ThemedView style={DenunciasStyles.root}>
      <AppBar title="Denuncias" />

      <View
        style={[
          DenunciasStyles.filters,
          { backgroundColor: theme.surfaceBase, borderColor: theme.border },
        ]}
      >
        <View style={DenunciasStyles.searchRow}>
          <TextInput
            style={inputStyle}
            placeholder="Nombre del animal"
            placeholderTextColor={theme.textMuted}
            value={vm.nombre}
            onChangeText={vm.setNombre}
          />
          <TextInput
            style={inputStyle}
            placeholder="Collar GPS"
            placeholderTextColor={theme.textMuted}
            autoCapitalize="characters"
            value={vm.collarGps}
            onChangeText={vm.setCollarGps}
          />
        </View>
        <ChipGroup options={OPCIONES_TIPO} value={vm.tipo} onChange={vm.cambiarTipo} />
        <ChipGroup options={OPCIONES_RANGO} value={vm.rango} onChange={vm.cambiarRango} />
      </View>

      {vm.isLoading ? (
        <View style={DenunciasStyles.centered}>
          <ActivityIndicator color={theme.accentBase} />
        </View>
      ) : (
        <FlatList
          style={DenunciasStyles.list}
          contentContainerStyle={[
            DenunciasStyles.listContent,
            vm.denuncias.length === 0 && DenunciasStyles.listContentEmpty,
          ]}
          data={vm.denuncias}
          keyExtractor={(item: Denuncia) => String(item.id)}
          renderItem={({ item }) => <DenunciaCard denuncia={item} />}
          onEndReached={vm.cargarMas}
          onEndReachedThreshold={0.4}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          refreshControl={
            <RefreshControl
              refreshing={vm.isRefreshing}
              onRefresh={vm.refetch}
              tintColor={theme.accentBase}
              colors={[theme.accentBase]}
            />
          }
          ListHeaderComponent={
            vm.denuncias.length > 0 ? (
              <ThemedText type="caption" themeColor="textMuted">
                {vm.total} resultado{vm.total === 1 ? '' : 's'}
              </ThemedText>
            ) : undefined
          }
          ListFooterComponent={
            vm.isLoadingMore ? (
              <View style={DenunciasStyles.footer}>
                <ActivityIndicator color={theme.accentBase} />
              </View>
            ) : vm.error && vm.denuncias.length > 0 ? (
              <ThemedText type="bodyMedium" themeColor="danger">
                {vm.error}
              </ThemedText>
            ) : undefined
          }
          ListEmptyComponent={
            <EmptyState
              icon={SirenIcon}
              message={vm.error ?? 'No hay denuncias con los filtros seleccionados'}
              actionLabel={vm.error ? 'Reintentar' : undefined}
              onAction={vm.error ? vm.refetch : undefined}
            />
          }
        />
      )}
    </ThemedView>
  );
}
