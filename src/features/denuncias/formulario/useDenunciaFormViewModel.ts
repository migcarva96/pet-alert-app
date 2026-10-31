import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert } from 'react-native';

import { crearDenuncia, editarDenuncia, getDenuncia } from '@/services/api/denunciasService';
import { getMascota } from '@/services/api/mascotasService';
import type { ArchivoLocal } from '@/services/entities/archivos/ArchivosTypes';
import { TipoDenuncia, type DenunciaDatos } from '@/services/entities/denuncias/DenunciasTypes';
import { textoOpcional } from '@/utils/formato';

/** La API admite máximo 5 evidencias acumuladas por denuncia (sumando las de ediciones). */
const MAX_EVIDENCIAS = 5;

const PATRON_GPS = /^[A-Z0-9]+(-[A-Z0-9]+)*$/;
const PATRON_TELEFONO = /^\+?[0-9 ()-]+$/;
const PATRON_CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type ModoFormulario = 'crear' | 'editar';

type Campo = 'collar_gps' | 'nombre_denunciante' | 'telefono' | 'correo' | 'descripcion_denuncia';
type Errores = Partial<Record<Campo, string>>;

type Contacto = { nombre: string; telefono: string; correo: string };

// Sin almacenamiento persistente, el último contacto usado se recuerda mientras la app
// está abierta para que reportar otra pérdida no obligue a escribirlo de nuevo.
let ultimoContacto: Contacto = { nombre: '', telefono: '', correo: '' };

export function useDenunciaFormViewModel(modo: ModoFormulario) {
  const { id, mascotaId } = useLocalSearchParams<{ id?: string; mascotaId?: string }>();

  const [tipo, setTipo] = useState<TipoDenuncia>(TipoDenuncia.Perdida);
  const [nombre, setNombre] = useState('');
  const [raza, setRaza] = useState('');
  const [color, setColor] = useState('');
  const [collarGps, setCollarGps] = useState('');
  const [nombreDenunciante, setNombreDenunciante] = useState(ultimoContacto.nombre);
  const [telefono, setTelefono] = useState(ultimoContacto.telefono);
  const [correo, setCorreo] = useState(ultimoContacto.correo);
  const [descripcion, setDescripcion] = useState('');
  const [foto, setFoto] = useState<ArchivoLocal | null>(null);
  const [evidencias, setEvidencias] = useState<ArchivoLocal[]>([]);
  const [evidenciasExistentes, setEvidenciasExistentes] = useState(0);
  const [tieneFotoExistente, setTieneFotoExistente] = useState(false);

  const [isLoading, setIsLoading] = useState(modo === 'editar' || Boolean(mascotaId));
  const [isSaving, setIsSaving] = useState(false);
  const [errorCarga, setErrorCarga] = useState<string | null>(null);
  const [errores, setErrores] = useState<Errores>({});
  const [errorGeneral, setErrorGeneral] = useState<string | null>(null);

  useEffect(() => {
    let isCurrent = true;

    async function prellenar() {
      try {
        if (modo === 'editar' && id) {
          const denuncia = await getDenuncia(id);
          if (!isCurrent) return;
          setTipo(denuncia.tipo_denuncia);
          setNombre(denuncia.nombre ?? '');
          setRaza(denuncia.raza ?? '');
          setColor(denuncia.color ?? '');
          setCollarGps(denuncia.collar_gps ?? '');
          setNombreDenunciante(denuncia.nombre_denunciante);
          setTelefono(denuncia.telefono ?? '');
          setCorreo(denuncia.correo ?? '');
          setDescripcion(denuncia.descripcion_denuncia);
          setEvidenciasExistentes(denuncia.evidencias.length);
          setTieneFotoExistente(Boolean(denuncia.foto));
        } else if (mascotaId) {
          // Reporte rápido de pérdida: se reusan los datos de la mascota registrada.
          const mascota = await getMascota(mascotaId);
          if (!isCurrent) return;
          setTipo(TipoDenuncia.Perdida);
          setNombre(mascota.nombre);
          setRaza(mascota.raza);
          setColor(mascota.color);
          setCollarGps(mascota.collar_gps ?? '');
          setDescripcion(`${mascota.nombre} se perdió. `);
        }
      } catch (err) {
        if (isCurrent) setErrorCarga(err instanceof Error ? err.message : 'No se pudo cargar');
      } finally {
        if (isCurrent) setIsLoading(false);
      }
    }

    prellenar();

    return () => {
      isCurrent = false;
    };
  }, [modo, id, mascotaId]);

  function validar(): Errores {
    const nuevos: Errores = {};
    const gps = collarGps.trim().toUpperCase();
    if (gps && !PATRON_GPS.test(gps)) nuevos.collar_gps = 'Solo letras, números y guiones';
    if (!nombreDenunciante.trim()) nuevos.nombre_denunciante = 'Tu nombre es obligatorio';
    if (!descripcion.trim()) nuevos.descripcion_denuncia = 'Describe lo ocurrido';

    const tel = telefono.trim();
    const mail = correo.trim();
    if (!tel && !mail) {
      nuevos.telefono = 'Ingresa un teléfono o un correo';
    }
    if (tel && (!PATRON_TELEFONO.test(tel) || tel.replace(/\D/g, '').length < 7)) {
      nuevos.telefono = 'Teléfono inválido (mínimo 7 dígitos)';
    }
    if (mail && !PATRON_CORREO.test(mail)) nuevos.correo = 'Correo inválido';
    return nuevos;
  }

  function construirDatos(): DenunciaDatos {
    return {
      nombre: textoOpcional(nombre),
      raza: textoOpcional(raza),
      color: textoOpcional(color),
      collar_gps: textoOpcional(collarGps)?.toUpperCase() ?? null,
      nombre_denunciante: nombreDenunciante.trim(),
      telefono: textoOpcional(telefono),
      correo: textoOpcional(correo),
      descripcion_denuncia: descripcion.trim(),
      tipo_denuncia: tipo,
    };
  }

  function limpiar() {
    setTipo(TipoDenuncia.Perdida);
    setNombre('');
    setRaza('');
    setColor('');
    setCollarGps('');
    setDescripcion('');
    setFoto(null);
    setEvidencias([]);
    setErrores({});
  }

  async function guardar() {
    const nuevos = validar();
    setErrores(nuevos);
    setErrorGeneral(null);
    if (Object.keys(nuevos).length > 0) return;

    const input = { datos: construirDatos(), foto, evidencias };
    setIsSaving(true);
    try {
      ultimoContacto = { nombre: nombreDenunciante, telefono, correo };

      if (modo === 'editar' && id) {
        await editarDenuncia(id, input);
        router.back();
        return;
      }

      const { id_denuncia, mensaje } = await crearDenuncia(input);
      const destino = { pathname: '/denuncias/[id]', params: { id: String(id_denuncia) } } as const;
      // Desde la pestaña el formulario queda limpio para un nuevo reporte; como pantalla
      // apilada (reporte rápido) se reemplaza por el detalle para no volver al formulario.
      if (mascotaId) {
        router.replace(destino);
      } else {
        limpiar();
        Alert.alert('Denuncia creada', mensaje, [
          { text: 'Ver', onPress: () => router.push(destino) },
        ]);
      }
    } catch (err) {
      setErrorGeneral(err instanceof Error ? err.message : 'No se pudo guardar la denuncia');
    } finally {
      setIsSaving(false);
    }
  }

  return {
    modo,
    esReporteRapido: Boolean(mascotaId),
    tipo,
    setTipo,
    nombre,
    setNombre,
    raza,
    setRaza,
    color,
    setColor,
    collarGps,
    setCollarGps,
    nombreDenunciante,
    setNombreDenunciante,
    telefono,
    setTelefono,
    correo,
    setCorreo,
    descripcion,
    setDescripcion,
    foto,
    setFoto,
    tieneFotoExistente,
    evidencias,
    setEvidencias,
    maxEvidencias: MAX_EVIDENCIAS - evidenciasExistentes,
    evidenciasExistentes,
    isLoading,
    isSaving,
    errorCarga,
    errores,
    errorGeneral,
    guardar,
  };
}
