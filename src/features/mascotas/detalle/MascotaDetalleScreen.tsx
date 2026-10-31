import {
  ClockCounterClockwiseIcon,
  CornersOutIcon,
  MegaphoneIcon,
  TrashIcon,
  WarningCircleIcon,
} from 'phosphor-react-native';
import { ActivityIndicator, Pressable, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { MascotaDetalleStyles } from './MascotaDetalleStyles';
import { useMascotaDetalleViewModel } from './useMascotaDetalleViewModel';

import { AppBar } from '@/components/app-bar';
import { AppButton } from '@/components/app-button';
import { EmptyState } from '@/components/empty-state';
import { PetMap } from '@/components/pet-map';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { DenunciaCard } from '@/features/denuncias/components/DenunciaCard';
import { MascotaAvatar } from '@/features/mascotas/components/MascotaAvatar';
import { useTheme } from '@/hooks/use-theme';
import { formatearFecha } from '@/utils/formato';

export function MascotaDetalleScreen() {
  const {
    mascota,
    historial,
    totalHistorial,
    isLoading,
    isDeleting,
    error,
    errorHistorial,
    reintentar,
    reportarPerdida,
    abrirEnMapa,
    confirmarEliminar,
  } = useMascotaDetalleViewModel();
  const theme = useTheme();

  if (isLoading || !mascota) {
    return (
      <ThemedView style={MascotaDetalleStyles.root}>
        <AppBar title="Mascota" showBack />
        {error ? (
          <EmptyState
            icon={WarningCircleIcon}
            message={error}
            actionLabel="Reintentar"
            onAction={reintentar}
          />
        ) : (
          <View style={MascotaDetalleStyles.centered}>
            <ActivityIndicator color={theme.accentBase} />
          </View>
        )}
      </ThemedView>
    );
  }

  const filas: [string, string][] = [
    ['Raza', mascota.raza],
    ['Color', mascota.color],
    ['Collar GPS', mascota.collar_gps ?? 'Sin collar'],
    ['Ubicación', mascota.coordenadas ? 'Localizada' : 'Sin localizar'],
    ['Registrada', formatearFecha(mascota.created_at)],
    ['Actualizada', formatearFecha(mascota.updated_at)],
  ];

  return (
    <ThemedView style={MascotaDetalleStyles.root}>
      <AppBar title={mascota.nombre} showBack />

      <ScrollView contentContainerStyle={MascotaDetalleStyles.content}>
        <View style={MascotaDetalleStyles.hero}>
          <MascotaAvatar foto={mascota.foto} size={160} />
          <ThemedText type="header1" style={MascotaDetalleStyles.heroText}>
            {mascota.nombre}
          </ThemedText>
        </View>

        <View
          style={[
            MascotaDetalleStyles.infoCard,
            { backgroundColor: theme.surfaceBase, borderColor: theme.border },
          ]}
        >
          {filas.map(([label, valor], index) => (
            <View
              key={label}
              style={[
                MascotaDetalleStyles.infoRow,
                index < filas.length - 1 && [
                  MascotaDetalleStyles.infoRowBorder,
                  { borderColor: theme.border },
                ],
              ]}
            >
              <ThemedText type="bodyMedium" themeColor="textSecondary">
                {label}
              </ThemedText>
              <ThemedText type="bodyBoldLarge" style={MascotaDetalleStyles.infoValue}>
                {valor}
              </ThemedText>
            </View>
          ))}
        </View>

        {mascota.coordenadas ? (
          <View style={MascotaDetalleStyles.section}>
            <ThemedText type="header3">Ubicación</ThemedText>
            <Pressable
              onPress={abrirEnMapa}
              style={[MascotaDetalleStyles.mapPreview, { borderColor: theme.border }]}
            >
              <PetMap
                coordenadas={mascota.coordenadas}
                titulo={mascota.nombre}
                interactive={false}
                style={MascotaDetalleStyles.mapPreviewMap}
              />
              <View
                style={[
                  MascotaDetalleStyles.mapPreviewBadge,
                  { backgroundColor: theme.primaryBase },
                ]}
              >
                <CornersOutIcon size={16} color={theme.onPrimary} weight="bold" />
                <ThemedText type="caption" themeColor="onPrimary">
                  Ver mapa
                </ThemedText>
              </View>
            </Pressable>
          </View>
        ) : null}

        <View style={MascotaDetalleStyles.actions}>
          <AppButton
            label="Reportar como perdida"
            onPress={reportarPerdida}
            icon={<MegaphoneIcon size={20} color={theme.onAccent} weight="bold" />}
          />
        </View>

        <View style={MascotaDetalleStyles.section}>
          <ThemedText type="header3">Historial de denuncias</ThemedText>
          {!mascota.collar_gps ? (
            <ThemedText type="bodyMedium" themeColor="textSecondary">
              El historial se consulta por collar GPS. Esta mascota no tiene uno registrado.
            </ThemedText>
          ) : errorHistorial ? (
            <ThemedText type="bodyMedium" themeColor="danger">
              {errorHistorial}
            </ThemedText>
          ) : historial.length === 0 ? (
            <EmptyState
              icon={ClockCounterClockwiseIcon}
              message="Esta mascota no tiene denuncias registradas"
            />
          ) : (
            <>
              {historial.map((denuncia) => (
                <DenunciaCard key={String(denuncia.id)} denuncia={denuncia} />
              ))}
              {totalHistorial > historial.length ? (
                <ThemedText type="caption" themeColor="textMuted">
                  Mostrando {historial.length} de {totalHistorial} denuncias.
                </ThemedText>
              ) : null}
            </>
          )}
        </View>

        <SafeAreaView edges={['bottom']}>
          <AppButton
            label="Eliminar mascota"
            variant="danger"
            loading={isDeleting}
            onPress={confirmarEliminar}
            icon={<TrashIcon size={20} color={theme.danger} />}
          />
        </SafeAreaView>
      </ScrollView>
    </ThemedView>
  );
}
