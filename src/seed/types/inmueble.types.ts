export type TipoInmueble     = "casa" | "apartamento" | "local" | "otro"
export type ModalidadInmueble = "arriendo" | "venta" | "ambos"
export type EstadoInmueble =
  | "disponible"
  | "arrendado"
  | "en_proceso_venta"
  | "vendido"
  | "en_mantenimiento"

// ---------------------------------------------------------------------------
// Shapes de respuesta de la API
// ---------------------------------------------------------------------------

/** Fila en el listado GET /inmuebles */
export interface InmuebleResumen {
  id: string
  tipo: TipoInmueble
  modalidad: ModalidadInmueble
  estado: EstadoInmueble
  publicado: boolean
  direccion: string
  /** Ej: "Bogotá — Chapinero" */
  ubicacion: string
  /** m² */
  area: number
  /** COP — canon mensual o precio de venta según modalidad */
  precio: number
  propietario: string
  propietarioId: string
  fechaRegistro: string
  /** URL de la primera foto, si existe */
  fotoPrincipal?: string
}

/** Detalle completo GET /inmuebles/:id */
export interface InmuebleDetalle extends Omit<InmuebleResumen, "fotoPrincipal"> {
  coordenadas?: [number, number]
  fotos: FotoInmueble[]
  historial: CambioHistorial[]
  contratoActivo?: {
    id: string
    referencia: string
    tipo: "arriendo" | "promesa_compraventa"
    estado: string
    fechaFin: string
  }
}

export interface FotoInmueble {
  id: string
  url: string
  descripcion?: string
}

export interface CambioHistorial {
  id: string
  fecha: string
  campo: string
  valorAnterior: string
  valorNuevo: string
  usuario: string
}

// ---------------------------------------------------------------------------
// Config UI (labels y estilos — no vienen de la API)
// ---------------------------------------------------------------------------

export const TIPO_INMUEBLE_LABELS: Record<TipoInmueble, string> = {
  casa:        "Casa",
  apartamento: "Apartamento",
  local:       "Local",
  otro:        "Otro",
}

export const MODALIDAD_LABELS: Record<ModalidadInmueble, string> = {
  arriendo: "Arriendo",
  venta:    "Venta",
  ambos:    "Arriendo y venta",
}

export const ESTADO_INMUEBLE_CONFIG: Record<EstadoInmueble, { label: string; className: string }> = {
  disponible:        { label: "Disponible",          className: "badge-green" },
  arrendado:         { label: "Arrendado",            className: "badge-blue" },
  en_proceso_venta:  { label: "En proceso de venta",  className: "badge-purple" },
  vendido:           { label: "Vendido",              className: "badge-gray" },
  en_mantenimiento:  { label: "En mantenimiento",     className: "badge-amber" },
}
