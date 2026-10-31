import {
  EnvelopeIcon,
  ImageIcon,
  PencilSimpleIcon,
  PhoneIcon,
  UserIcon,
  WarningCircleIcon,
} from 'phosphor-react-native';
import type { ReactNode } from 'react';
import { ActivityIndicator, Pressable, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { DenunciaDetalleStyles } from './DenunciaDetalleStyles';
import { useDenunciaDetalleViewModel } from './useDenunciaDetalleViewModel';

import { AppBar } from '@/components/app-bar';
import { EmptyState } from '@/components/empty-state';
import { FileIcon } from '@/components/file-icon';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { TipoDenunciaBadge } from '@/features/denuncias/components/TipoDenunciaBadge';
import { useTheme } from '@/hooks/use-theme';
import { formatearBytes, formatearFecha } from '@/utils/formato';

function Seccion({ titulo, children }: { titulo: string; children: ReactNode }) {
  const theme = useTheme();
  return (
    <View style={DenunciaDetalleStyles.section}>
      <ThemedText type="header3">{titulo}</ThemedText>
      <View
        style={[
          DenunciaDetalleStyles.card,
          { backgroundColor: theme.surfaceBase, borderColor: theme.border },
        ]}
      >
        {children}
      </View>
    </View>
  );
}

export function DenunciaDetalleScreen() {
  const { denuncia, isLoading, error, reintentar, editar } = useDenunciaDetalleViewModel();
  const theme = useTheme();

  if (isLoading || !denuncia) {
    return (
      <ThemedView style={DenunciaDetalleStyles.root}>
        <AppBar title="Denuncia" showBack />
        {error ? (
          <EmptyState
            icon={WarningCircleIcon}
            message={error}
            actionLabel="Reintentar"
            onAction={reintentar}
          />
        ) : (
          <View style={DenunciaDetalleStyles.centered}>
            <ActivityIndicator color={theme.accentBase} />
          </View>
        )}
      </ThemedView>
    );
  }

  const animal = [
    ['Nombre', denuncia.nombre],
    ['Raza', denuncia.raza],
    ['Color', denuncia.color],
    ['Collar GPS', denuncia.collar_gps],
  ].filter((fila): fila is [string, string] => Boolean(fila[1]));

  return (
    <ThemedView style={DenunciaDetalleStyles.root}>
      <AppBar
        title={`Denuncia #${denuncia.id}`}
        showBack
        right={
          <Pressable hitSlop={12} onPress={editar}>
            <PencilSimpleIcon size={24} color={theme.onPrimary} />
          </Pressable>
        }
      />

      <ScrollView contentContainerStyle={DenunciaDetalleStyles.content}>
        <View style={DenunciaDetalleStyles.header}>
          <TipoDenunciaBadge tipo={denuncia.tipo_denuncia} />
          <ThemedText type="header2">{denuncia.nombre ?? 'Animal sin nombre'}</ThemedText>
          <ThemedText type="caption" themeColor="textMuted">
            Creada {formatearFecha(denuncia.created_at)} · Actualizada{' '}
            {formatearFecha(denuncia.updated_at)}
          </ThemedText>
        </View>

        <Seccion titulo="Descripción">
          <ThemedText type="bodyLarge">{denuncia.descripcion_denuncia}</ThemedText>
        </Seccion>

        {animal.length > 0 ? (
          <Seccion titulo="Animal">
            {animal.map(([label, valor]) => (
              <View key={label} style={DenunciaDetalleStyles.row}>
                <ThemedText
                  type="bodyMedium"
                  themeColor="textSecondary"
                  style={DenunciaDetalleStyles.rowText}
                >
                  {label}
                </ThemedText>
                <ThemedText type="bodyBoldLarge">{valor}</ThemedText>
              </View>
            ))}
          </Seccion>
        ) : null}

        <Seccion titulo="Denunciante">
          <View style={DenunciaDetalleStyles.row}>
            <UserIcon size={20} color={theme.accentBase} />
            <ThemedText type="bodyLarge">{denuncia.nombre_denunciante}</ThemedText>
          </View>
          {denuncia.telefono ? (
            <View style={DenunciaDetalleStyles.row}>
              <PhoneIcon size={20} color={theme.accentBase} />
              <ThemedText type="bodyLarge">{denuncia.telefono}</ThemedText>
            </View>
          ) : null}
          {denuncia.correo ? (
            <View style={DenunciaDetalleStyles.row}>
              <EnvelopeIcon size={20} color={theme.accentBase} />
              <ThemedText type="bodyLarge">{denuncia.correo}</ThemedText>
            </View>
          ) : null}
        </Seccion>

        <SafeAreaView edges={['bottom']}>
          <Seccion titulo={`Adjuntos (${denuncia.evidencias.length + (denuncia.foto ? 1 : 0)})`}>
            {denuncia.foto ? (
              <View style={DenunciaDetalleStyles.row}>
                <ImageIcon size={24} color={theme.accentBase} />
                <ThemedText type="bodyMedium" style={DenunciaDetalleStyles.rowText}>
                  Foto del animal
                </ThemedText>
              </View>
            ) : null}
            {denuncia.evidencias.map((evidencia) => (
              <View key={String(evidencia.id)} style={DenunciaDetalleStyles.row}>
                <FileIcon mimeType={evidencia.tipo_archivo} />
                <View style={DenunciaDetalleStyles.rowText}>
                  <ThemedText type="bodyMedium" numberOfLines={1}>
                    {evidencia.nombre_archivo}
                  </ThemedText>
                  <ThemedText type="caption" themeColor="textMuted">
                    {formatearBytes(evidencia.tamano_bytes)}
                  </ThemedText>
                </View>
              </View>
            ))}
            {!denuncia.foto && denuncia.evidencias.length === 0 ? (
              <ThemedText type="bodyMedium" themeColor="textSecondary">
                Sin adjuntos
              </ThemedText>
            ) : null}
          </Seccion>
        </SafeAreaView>
      </ScrollView>
    </ThemedView>
  );
}
