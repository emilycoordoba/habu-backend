export type TipoContrato   = "arriendo" | "promesa_compraventa"
export type EstadoContrato =
  | "borrador"
  | "en_firmas"
  | "activo"
  | "en_escrituracion"
  | "pendiente_registro"
  | "por_vencer"
  | "vencido_con_saldos"
  | "terminacion_en_disputa"
  | "terminado_anticipadamente"
  | "finalizado"

export type TipoCobro =
  | "canon"
  | "comision_administracion"
  | "comision_colocacion"
  | "arras"
  | "deposito"
  | "penalizacion"
  | "precio_venta"

export type FormaPago = "contado" | "credito_hipotecario" | "mixto"

// ---------------------------------------------------------------------------
// Shapes de respuesta de la API
// ---------------------------------------------------------------------------

/** Fila en el listado GET /contratos */
export interface ContratoResumen {
  id: string
  referencia: string
  tipo: TipoContrato
  estado: EstadoContrato
  /** Nombre descriptivo del inmueble */
  inmueble: string
  direccion: string
  /** Nombre completo del propietario / vendedor */
  propietario: string
  /** Nombre completo del arrendatario / comprador */
  contraparte: string
  asesor: string
  fechaInicio: string
  fechaFin: string
  /** Canon mensual (arriendo) o precio de venta (promesa) */
  valorCanon: number
}

/** Detalle completo GET /contratos/:id */
export interface ContratoDetalle {
  id: string
  referencia: string
  tipo: TipoContrato
  estado: EstadoContrato
  fechaInicio: string
  fechaFin: string
  asesor: string

  inmueble: {
    id: string
    nombre: string
    direccion: string
    ciudad: string
  }

  propietario: {
    id: string
    nombre: string
    documento: string
    tipoDocumento: "CC" | "NIT" | "CE" | "PAS"
    telefono: string
    email: string
  }

  contraparte: {
    id: string
    nombre: string
    documento: string
    tipoDocumento: "CC" | "NIT" | "CE" | "PAS"
    telefono: string
    email: string
  }

  codeudor?: {
    nombre: string
    documento: string
  }

  condicionesArriendo?: {
    valorCanon: number
    diaCorte: number
    incluyeAdministracion: boolean
    valorAdministracion?: number
    tieneDeposito: boolean
    valorDeposito?: number
    duracionMeses: number
  }

  condicionesPromesa?: {
    precioVenta: number
    valorArras: number
    fechaLimiteArras: string
    formaPago: FormaPago
    entidadFinanciera?: string
    fechaAprobacionCredito?: string
    valorContado?: number
    valorCredito?: number
    fechaEscrituracion?: string
    notaria?: string
  }

  documentos: DocumentoContrato[]
  firmas: FirmaContrato[]
  historial: EventoHistorial[]
}

export interface DocumentoContrato {
  id: string
  nombre: string
  tipo: string
  estado: "pendiente" | "recibido" | "rechazado"
  fechaSubida?: string
  urlArchivo?: string
}

export interface FirmaContrato {
  id: string
  parte: string
  rol: string
  estado: "pendiente" | "firmado"
  fechaFirma?: string
}

export interface EventoHistorial {
  id: string
  tipo: string
  descripcion: string
  fecha: string
  usuario?: string
}

/** Alias retrocompatible */
export type Contrato = ContratoResumen

// ---------------------------------------------------------------------------
// Config UI (labels y estilos — no vienen de la API)
// ---------------------------------------------------------------------------

export const LABELS_POR_TIPO: Record<TipoContrato, { propietario: string; contraparte: string; canon: string }> = {
  arriendo:            { propietario: "Arrendador",  contraparte: "Arrendatario", canon: "Canon" },
  promesa_compraventa: { propietario: "Vendedor",    contraparte: "Comprador",    canon: "Precio" },
}

export const ESTADO_CONTRATO_CONFIG: Record<EstadoContrato, { label: string; className: string }> = {
  borrador:                  { label: "Borrador",               className: "badge-gray" },
  en_firmas:                 { label: "En firmas",              className: "badge-blue" },
  activo:                    { label: "Activo",                 className: "badge-green" },
  en_escrituracion:          { label: "En escrituración",       className: "badge-indigo" },
  pendiente_registro:        { label: "Pendiente registro",     className: "badge-orange" },
  por_vencer:                { label: "Por vencer",             className: "badge-yellow" },
  vencido_con_saldos:        { label: "Vencido con saldos",     className: "badge-red" },
  terminacion_en_disputa:    { label: "Terminación en disputa", className: "badge-red" },
  terminado_anticipadamente: { label: "Term. anticipada",       className: "badge-gray" },
  finalizado:                { label: "Finalizado",             className: "badge-gray" },
}
