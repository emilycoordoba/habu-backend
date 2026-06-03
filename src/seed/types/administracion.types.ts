export type RolUsuario    = "administrador" | "asesor"
export type EstadoUsuario = "activo" | "inactivo"
export type TipoComision  = "administracion" | "colocacion" | "venta"
export type TipoPersona   = "natural" | "juridica" | "ambos"
export type TipoInmueble  = "residencial" | "comercial" | "ambos"
export type TipoPlantilla = "arriendo" | "promesa_compraventa" | "administracion"

// ---------------------------------------------------------------------------
// Usuarios
// ---------------------------------------------------------------------------

export interface Usuario {
  id: string
  nombre: string
  correo: string
  roles: RolUsuario[]
  estado: EstadoUsuario
  fechaCreacion: string
}

// ---------------------------------------------------------------------------
// Esquemas de comisión
// ---------------------------------------------------------------------------

export interface EsquemaComision {
  id: string
  nombre: string
  tipo: TipoComision
  porcentajeInmobiliaria: number
  porcentajeAsesor: number
  condiciones: string
  estado: "activo" | "inactivo"
}

export interface AsesorAsignado {
  usuarioId: string
  nombre: string
  correo: string
  fechaAsignacion: string
}

export interface EsquemaComisionDetalle extends EsquemaComision {
  asesores: AsesorAsignado[]
}

// ---------------------------------------------------------------------------
// Parámetros
// ---------------------------------------------------------------------------

export interface Parametros {
  moraGraciaDiasHabiles: number
  moraAplicaResidencial: boolean
  moraTasaResidencial: number
  moraTasaComercial: number
  alertaVencimientoDias: number
  alertaRenovacionDias: number
}

// ---------------------------------------------------------------------------
// Tipos de documento
// ---------------------------------------------------------------------------

export interface TipoDocumentoReq {
  id: string
  nombre: string
  tipoPersona: TipoPersona
  tipoInmueble: TipoInmueble
  requiereCodeudor: boolean
  obligatorio: boolean
}

// ---------------------------------------------------------------------------
// Plantillas
// ---------------------------------------------------------------------------

export interface PlantillaResumen {
  id: string
  nombre: string
  tipo: TipoPlantilla
  ultimaEdicion: string
}

export interface Plantilla extends PlantillaResumen {
  contenido: string
}

// ---------------------------------------------------------------------------
// Roles (lectura)
// ---------------------------------------------------------------------------

export interface PermisoModulo {
  modulo: string
  permisos: PermisoRol[]
}

export interface PermisoRol {
  clave: string
  descripcion: string
  roles: { administrador: boolean; asesor: boolean }
}
