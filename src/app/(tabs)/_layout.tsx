import { Tabs } from 'expo-router';
import {
  CalendarCheckIcon,
  MegaphoneIcon,
  PawPrintIcon,
  SirenIcon,
  StorefrontIcon,
  type Icon,
} from 'phosphor-react-native';
import type { ColorValue } from 'react-native';

import { Colors, FontFamily } from '@/constants/theme';

function tabIcon(IconComponent: Icon) {
  return function TabIcon({ color, focused }: { color: ColorValue; focused: boolean }) {
    return <IconComponent size={26} color={String(color)} weight={focused ? 'fill' : 'regular'} />;
  };
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.accentBase,
        tabBarInactiveTintColor: Colors.textSecondary,
        tabBarStyle: { backgroundColor: Colors.surfaceBase, borderTopColor: Colors.border },
        tabBarLabelStyle: { fontFamily: FontFamily.semiBold, fontSize: 11 },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{ title: 'Mascotas', tabBarIcon: tabIcon(PawPrintIcon) }}
      />
      <Tabs.Screen
        name="denuncias"
        options={{ title: 'Denuncias', tabBarIcon: tabIcon(SirenIcon) }}
      />
      <Tabs.Screen
        name="reportar"
        options={{ title: 'Reportar', tabBarIcon: tabIcon(MegaphoneIcon) }}
      />
      <Tabs.Screen
        name="servicios"
        options={{ title: 'Servicios', tabBarIcon: tabIcon(CalendarCheckIcon) }}
      />
      <Tabs.Screen
        name="mercado"
        options={{ title: 'Mercado', tabBarIcon: tabIcon(StorefrontIcon) }}
      />
    </Tabs>
  );
}
