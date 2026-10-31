import {
  BoneIcon,
  PackageIcon,
  PillIcon,
  ShoppingBagIcon,
  StorefrontIcon,
  TagIcon,
} from 'phosphor-react-native';

import { ComingSoon, type ComingSoonItem } from '@/components/coming-soon';

const CATEGORIAS: ComingSoonItem[] = [
  {
    icon: BoneIcon,
    titulo: 'Alimentos y snacks',
    descripcion: 'Concentrados, premios y dietas especiales.',
  },
  { icon: ShoppingBagIcon, titulo: 'Accesorios', descripcion: 'Collares, camas, juguetes y más.' },
  {
    icon: PillIcon,
    titulo: 'Salud e higiene',
    descripcion: 'Antipulgas, vitaminas y cuidado diario.',
  },
  { icon: TagIcon, titulo: 'Ofertas', descripcion: 'Descuentos de tiendas aliadas.' },
  { icon: PackageIcon, titulo: 'Envíos a domicilio', descripcion: 'Recibe tus pedidos en casa.' },
];

export function MercadoScreen() {
  return (
    <ComingSoon
      appBarTitle="Mercado"
      icon={StorefrontIcon}
      titulo="Todo para tu mascota en un solo lugar"
      descripcion="Muy pronto podrás comprar productos de tiendas aliadas sin salir de PetAlert."
      items={CATEGORIAS}
    />
  );
}
