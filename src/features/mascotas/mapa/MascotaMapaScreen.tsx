import { ArrowSquareOutIcon, MapPinIcon, WarningCircleIcon } from 'phosphor-react-native';
import { ActivityIndicator, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { MascotaMapaStyles } from './MascotaMapaStyles';
import { useMascotaMapaViewModel } from './useMascotaMapaViewModel';

import { AppBar } from '@/components/app-bar';
import { AppButton } from '@/components/app-button';
import { EmptyState } from '@/components/empty-state';
import { PetMap } from '@/components/pet-map';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useTheme } from '@/hooks/use-theme';
import { formatearCoordenadas } from '@/utils/formato';

export function MascotaMapaScreen() {
  const { mascota, error, abrirExterno } = useMascotaMapaViewModel();
  const theme = useTheme();

  if (!mascota || !mascota.coordenadas) {
    return (
      <ThemedView style={MascotaMapaStyles.root}>
        <AppBar title="Ubicación" showBack />
        {error ? (
          <EmptyState icon={WarningCircleIcon} message={error} />
        ) : mascota ? (
          <EmptyState icon={MapPinIcon} message="Esta mascota no tiene ubicación registrada" />
        ) : (
          <View style={MascotaMapaStyles.centered}>
            <ActivityIndicator color={theme.accentBase} />
          </View>
        )}
      </ThemedView>
    );
  }

  return (
    <ThemedView style={MascotaMapaStyles.root}>
      <AppBar title={`Ubicación de ${mascota.nombre}`} showBack />

      <PetMap
        coordenadas={mascota.coordenadas}
        titulo={mascota.nombre}
        style={MascotaMapaStyles.map}
      />

      <SafeAreaView
        edges={['bottom']}
        style={[
          MascotaMapaStyles.footer,
          { backgroundColor: theme.surfaceBase, borderColor: theme.border },
        ]}
      >
        <ThemedText type="bodyMedium" themeColor="textSecondary">
          {formatearCoordenadas(mascota.coordenadas)}
        </ThemedText>
        <AppButton
          label="Cómo llegar"
          variant="secondary"
          onPress={abrirExterno}
          icon={<ArrowSquareOutIcon size={20} color={theme.accentBase} />}
        />
      </SafeAreaView>
    </ThemedView>
  );
}
