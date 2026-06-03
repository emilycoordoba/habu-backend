export type TipoPersona    = "natural" | "juridica"
export type TipoDocumento  = "CC" | "NIT" | "CE" | "PAS"
export type TipoCliente    = "propietario" | "arrendatario" | "prospecto" | "codeudor"
export type TipoInteraccion = "visita" | "llamada" | "mensaje" | "nota"

// ---------------------------------------------------------------------------
// Shapes de respuesta de la API
// ---------------------------------------------------------------------------

/** Fila en el listado GET /clientes */
export interface ClienteResumen {
  id: string
  tipoPersona: TipoPersona
  nombre: string
  documento: string
  tipoDocumento: TipoDocumento
  tipos: TipoCliente[]
  telefono: string
  email: string
  ciudad: string
  fechaRegistro: string
  representanteLegal?: string
  activo: boolean
}

/** Detalle completo GET /clientes/:id — agrega contadores para las tabs */
export interface ClienteDetalle extends ClienteResumen {
  totalContratos: number
  totalInmuebles: number
  totalInteracciones: number
}

/** Fila en GET /clientes/:id/interacciones */
export interface Interaccion {
  id: string
  tipo: TipoInteraccion
  fecha: string
  hora?: string
  descripcion: string
  asesor: string
  /** Solo cuando tipo === "visita" */
  inmueble?: string
  inmuebleId?: string
}

/** Fila en GET /clientes/:id/contratos */
export interface ContratoClienteResumen {
  id: string
  referencia: string
  tipo: "arriendo" | "promesa_compraventa"
  estado: string
  inmueble: string
  direccion: string
  /** Rol del cliente en este contrato */
  rol: TipoCliente
  fechaInicio: string
  fechaFin: string
}

/** Fila en GET /clientes/:id/inmuebles */
export interface InmuebleClienteResumen {
  id: string
  tipo: import("./inmueble.types").TipoInmueble
  modalidad: import("./inmueble.types").ModalidadInmueble
  estado: import("./inmueble.types").EstadoInmueble
  direccion: string
  ubicacion: string
  area: number
  precio: number
}

// ---------------------------------------------------------------------------
// Config UI (labels y estilos — no vienen de la API)
// ---------------------------------------------------------------------------

export const TIPO_CLIENTE_CONFIG: Record<TipoCliente, { label: string; className: string }> = {
  propietario:  { label: "Propietario",  className: "badge-blue" },
  arrendatario: { label: "Arrendatario", className: "badge-green" },
  prospecto:    { label: "Prospecto",    className: "badge-amber" },
  codeudor:     { label: "Codeudor",     className: "badge-purple" },
}

export const TIPO_INTERACCION_LABELS: Record<TipoInteraccion, string> = {
  visita:   "Visita",
  llamada:  "Llamada",
  mensaje:  "Mensaje",
  nota:     "Nota",
}

/** Alias retrocompatible — los componentes que usaban `Cliente` siguen funcionando */
export type Cliente = ClienteResumen
