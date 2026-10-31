import {
  BathtubIcon,
  CalendarCheckIcon,
  DogIcon,
  HouseIcon,
  ScissorsIcon,
  StethoscopeIcon,
} from 'phosphor-react-native';

import { ComingSoon, type ComingSoonItem } from '@/components/coming-soon';

const SERVICIOS: ComingSoonItem[] = [
  { icon: BathtubIcon, titulo: 'Spa y baño', descripcion: 'Baños, limpieza y cuidado del pelaje.' },
  { icon: ScissorsIcon, titulo: 'Peluquería', descripcion: 'Cortes y arreglos según su raza.' },
  { icon: HouseIcon, titulo: 'Guardería', descripcion: 'Cuidado por días mientras no estás.' },
  { icon: DogIcon, titulo: 'Paseos', descripcion: 'Paseadores de confianza cerca de ti.' },
  {
    icon: StethoscopeIcon,
    titulo: 'Veterinaria',
    descripcion: 'Citas de control, vacunas y consultas.',
  },
];

export function ServiciosScreen() {
  return (
    <ComingSoon
      appBarTitle="Servicios"
      icon={CalendarCheckIcon}
      titulo="Agenda servicios para tu mascota"
      descripcion="Muy pronto podrás reservar citas con centros aliados directamente desde PetAlert."
      items={SERVICIOS}
    />
  );
}
