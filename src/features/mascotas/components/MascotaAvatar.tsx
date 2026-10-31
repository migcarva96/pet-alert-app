import { Image } from 'expo-image';
import { PawPrintIcon } from 'phosphor-react-native';
import { StyleSheet, View } from 'react-native';

import { Colors } from '@/constants/theme';
import { resolverFotoMascota } from '@/services/api/mascotasService';

export function MascotaAvatar({ foto, size }: { foto: string | null; size: number }) {
  const uri = resolverFotoMascota(foto);
  const dimension = { width: size, height: size, borderRadius: size / 4 };

  if (!uri) {
    return (
      <View style={[styles.placeholder, dimension]}>
        <PawPrintIcon size={size / 2} color={Colors.accentBase} weight="duotone" />
      </View>
    );
  }

  return (
    <Image source={{ uri }} style={[styles.image, dimension]} contentFit="cover" transition={150} />
  );
}

const styles = StyleSheet.create({
  placeholder: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.accentSoftTint,
  },
  image: {
    backgroundColor: Colors.surfaceElevated,
  },
});
