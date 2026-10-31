import { DenunciaFormScreen } from '@/features/denuncias/formulario/DenunciaFormScreen';

/** Reporte rápido de pérdida desde el detalle de una mascota (`?mascotaId=`). */
export default function NuevaDenunciaRoute() {
  return <DenunciaFormScreen modo="crear" standalone />;
}
