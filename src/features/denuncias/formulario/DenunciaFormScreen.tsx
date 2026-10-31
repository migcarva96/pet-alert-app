import { PaperPlaneTiltIcon, WarningCircleIcon } from 'phosphor-react-native';
import { ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';

import { DenunciaFormStyles } from './DenunciaFormStyles';
import { useDenunciaFormViewModel, type ModoFormulario } from './useDenunciaFormViewModel';

import { AppBar } from '@/components/app-bar';
import { AppButton } from '@/components/app-button';
import { ChipGroup, type ChipOption } from '@/components/chip-group';
import { EmptyState } from '@/components/empty-state';
import { EvidenciasField } from '@/components/evidencias-field';
import { PhotoPickerField } from '@/components/photo-picker-field';
import { TextField } from '@/components/text-field';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useTheme } from '@/hooks/use-theme';
import { TipoDenuncia } from '@/services/entities/denuncias/DenunciasTypes';

const OPCIONES_TIPO: ChipOption<TipoDenuncia>[] = [
  { value: TipoDenuncia.Perdida, label: 'Pérdida' },
  { value: TipoDenuncia.Maltrato, label: 'Maltrato' },
];

export type DenunciaFormScreenProps = {
  modo: ModoFormulario;
  /** Pantalla apilada (con flecha de regreso) en lugar de pestaña. */
  standalone?: boolean;
};

export function DenunciaFormScreen({ modo, standalone = false }: DenunciaFormScreenProps) {
  const vm = useDenunciaFormViewModel(modo);
  const theme = useTheme();

  const titulo =
    modo === 'editar'
      ? 'Editar denuncia'
      : vm.esReporteRapido
        ? 'Reportar pérdida'
        : 'Nueva denuncia';

  if (vm.isLoading || vm.errorCarga) {
    return (
      <ThemedView style={DenunciaFormStyles.root}>
        <AppBar title={titulo} showBack={standalone} />
        {vm.errorCarga ? (
          <EmptyState icon={WarningCircleIcon} message={vm.errorCarga} />
        ) : (
          <View style={DenunciaFormStyles.centered}>
            <ActivityIndicator color={theme.accentBase} />
          </View>
        )}
      </ThemedView>
    );
  }

  return (
    <ThemedView style={DenunciaFormStyles.root}>
      <AppBar title={titulo} showBack={standalone} />

      <KeyboardAvoidingView
        style={DenunciaFormStyles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={DenunciaFormStyles.content}
          keyboardShouldPersistTaps="handled"
        >
          {vm.esReporteRapido ? (
            <View
              style={[
                DenunciaFormStyles.banner,
                { backgroundColor: theme.accentSoftTint, borderColor: theme.accentLight },
              ]}
            >
              <ThemedText type="bodyMedium" themeColor="primarySoft">
                Usamos los datos de tu mascota. Solo confirma tu contacto y envía.
              </ThemedText>
            </View>
          ) : (
            <View style={DenunciaFormStyles.section}>
              <ThemedText type="caption" themeColor="textSecondary">
                Tipo de denuncia
              </ThemedText>
              <ChipGroup options={OPCIONES_TIPO} value={vm.tipo} onChange={vm.setTipo} />
            </View>
          )}

          <ThemedText type="header3" style={DenunciaFormStyles.sectionTitle}>
            Tus datos
          </ThemedText>
          <TextField
            label="Nombre del denunciante"
            required
            value={vm.nombreDenunciante}
            onChangeText={vm.setNombreDenunciante}
            error={vm.errores.nombre_denunciante}
            maxLength={150}
            autoComplete="name"
          />
          <TextField
            label="Teléfono"
            keyboardType="phone-pad"
            value={vm.telefono}
            onChangeText={vm.setTelefono}
            error={vm.errores.telefono}
            maxLength={30}
            autoComplete="tel"
          />
          <TextField
            label="Correo"
            keyboardType="email-address"
            autoCapitalize="none"
            value={vm.correo}
            onChangeText={vm.setCorreo}
            error={vm.errores.correo}
            maxLength={150}
            autoComplete="email"
          />
          <ThemedText type="caption" themeColor="textMuted">
            Debes indicar al menos un teléfono o un correo.
          </ThemedText>

          <TextField
            label="Descripción"
            required
            multiline
            value={vm.descripcion}
            onChangeText={vm.setDescripcion}
            error={vm.errores.descripcion_denuncia}
            maxLength={10000}
            placeholder="¿Qué pasó, cuándo y dónde?"
          />

          <ThemedText type="header3" style={DenunciaFormStyles.sectionTitle}>
            Datos del animal (opcional)
          </ThemedText>
          <TextField label="Nombre" value={vm.nombre} onChangeText={vm.setNombre} maxLength={100} />
          <TextField label="Raza" value={vm.raza} onChangeText={vm.setRaza} maxLength={100} />
          <TextField label="Color" value={vm.color} onChangeText={vm.setColor} maxLength={100} />
          <TextField
            label="Collar GPS"
            autoCapitalize="characters"
            value={vm.collarGps}
            onChangeText={vm.setCollarGps}
            error={vm.errores.collar_gps}
            maxLength={50}
          />

          <ThemedText type="header3" style={DenunciaFormStyles.sectionTitle}>
            Adjuntos
          </ThemedText>
          <PhotoPickerField
            label={vm.tieneFotoExistente ? 'Reemplazar foto del animal' : 'Foto del animal'}
            value={vm.foto}
            onChange={vm.setFoto}
            hint="JPG, PNG o WEBP de hasta 5 MB."
          />
          {vm.maxEvidencias > 0 ? (
            <EvidenciasField
              value={vm.evidencias}
              onChange={vm.setEvidencias}
              maximo={vm.maxEvidencias}
            />
          ) : (
            <ThemedText type="bodyMedium" themeColor="textSecondary">
              Esta denuncia ya tiene el máximo de 5 evidencias.
            </ThemedText>
          )}
          {modo === 'editar' && vm.evidenciasExistentes > 0 ? (
            <ThemedText type="caption" themeColor="textMuted">
              Las {vm.evidenciasExistentes} evidencias actuales se conservan; las nuevas se suman.
            </ThemedText>
          ) : null}

          <View style={DenunciaFormStyles.footer}>
            {vm.errorGeneral ? (
              <ThemedText type="bodyMedium" themeColor="danger">
                {vm.errorGeneral}
              </ThemedText>
            ) : null}
            <AppButton
              label={modo === 'editar' ? 'Guardar cambios' : 'Enviar denuncia'}
              loading={vm.isSaving}
              onPress={vm.guardar}
              icon={<PaperPlaneTiltIcon size={20} color={theme.onAccent} weight="bold" />}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}
