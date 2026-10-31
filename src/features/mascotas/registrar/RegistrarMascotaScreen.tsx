import { MapPinIcon, XIcon } from 'phosphor-react-native';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { RegistrarMascotaStyles } from './RegistrarMascotaStyles';
import { useRegistrarMascotaViewModel, type ModoFoto } from './useRegistrarMascotaViewModel';

import { AppBar } from '@/components/app-bar';
import { AppButton } from '@/components/app-button';
import { ChipGroup, type ChipOption } from '@/components/chip-group';
import { PetMap } from '@/components/pet-map';
import { PhotoPickerField } from '@/components/photo-picker-field';
import { TextField } from '@/components/text-field';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useTheme } from '@/hooks/use-theme';

const OPCIONES_FOTO: ChipOption<ModoFoto>[] = [
  { value: 'ninguna', label: 'Sin foto' },
  { value: 'archivo', label: 'Desde el teléfono' },
  { value: 'url', label: 'URL' },
];

export function RegistrarMascotaScreen() {
  const vm = useRegistrarMascotaViewModel();
  const theme = useTheme();

  return (
    <ThemedView style={RegistrarMascotaStyles.root}>
      <AppBar title="Registrar mascota" showBack />

      <KeyboardAvoidingView
        style={RegistrarMascotaStyles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={RegistrarMascotaStyles.content}
          keyboardShouldPersistTaps="handled"
        >
          <TextField
            label="Nombre"
            required
            value={vm.nombre}
            onChangeText={vm.setNombre}
            error={vm.errores.nombre}
            maxLength={100}
          />
          <TextField
            label="Raza"
            required
            value={vm.raza}
            onChangeText={vm.setRaza}
            error={vm.errores.raza}
            maxLength={100}
          />
          <TextField
            label="Color"
            required
            value={vm.color}
            onChangeText={vm.setColor}
            error={vm.errores.color}
            maxLength={100}
          />
          <TextField
            label="Código del collar GPS"
            placeholder="Ej. CO-458"
            autoCapitalize="characters"
            value={vm.collarGps}
            onChangeText={vm.setCollarGps}
            error={vm.errores.collar_gps}
            maxLength={50}
          />

          <View style={RegistrarMascotaStyles.section}>
            <ThemedText type="caption" themeColor="textSecondary">
              Foto
            </ThemedText>
            <ChipGroup options={OPCIONES_FOTO} value={vm.modoFoto} onChange={vm.setModoFoto} />
          </View>

          {vm.modoFoto === 'archivo' ? (
            <PhotoPickerField
              label="Archivo"
              value={vm.fotoArchivo}
              onChange={vm.setFotoArchivo}
              hint="JPG, PNG o WEBP de hasta 5 MB."
            />
          ) : null}
          {vm.modoFoto === 'url' ? (
            <TextField
              label="URL de la foto"
              placeholder="https://..."
              autoCapitalize="none"
              keyboardType="url"
              value={vm.fotoUrl}
              onChangeText={vm.setFotoUrl}
              error={vm.errores.fotoUrl}
            />
          ) : null}

          <View style={RegistrarMascotaStyles.section}>
            <ThemedText type="caption" themeColor="textSecondary">
              Ubicación
            </ThemedText>
            {vm.coordenadas ? (
              <View style={[RegistrarMascotaStyles.mapPreview, { borderColor: theme.border }]}>
                <PetMap
                  coordenadas={vm.coordenadas}
                  titulo={vm.nombre || 'Mascota'}
                  interactive={false}
                  style={RegistrarMascotaStyles.mapPreviewMap}
                />
                <Pressable
                  hitSlop={8}
                  onPress={vm.quitarCoordenadas}
                  accessibilityLabel="Quitar ubicación"
                  style={[
                    RegistrarMascotaStyles.mapRemoveButton,
                    { backgroundColor: theme.surfaceBase, borderColor: theme.border },
                  ]}
                >
                  <XIcon size={18} color={theme.textSecondary} weight="bold" />
                </Pressable>
              </View>
            ) : (
              <AppButton
                label="Usar mi ubicación actual"
                variant="secondary"
                loading={vm.isLocating}
                onPress={vm.usarUbicacionActual}
                icon={<MapPinIcon size={20} color={theme.accentBase} />}
              />
            )}
          </View>

          <SafeAreaView edges={['bottom']} style={RegistrarMascotaStyles.footer}>
            <AppButton label="Registrar mascota" loading={vm.isSaving} onPress={vm.guardar} />
          </SafeAreaView>
        </ScrollView>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}
