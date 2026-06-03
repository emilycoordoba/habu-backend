import type { TipoContrato, TipoCobro } from "./contrato.types"

export type EstadoCobro      = "pendiente" | "pagado" | "en_mora"
export type TipoEventoCuenta = "cobro_generado" | "pago_recibido" | "mora_iniciada" | "interes_mora"

// ---------------------------------------------------------------------------
// Cobros
// ---------------------------------------------------------------------------

export interface Cobro {
  id: string
  tipo: TipoCobro
  estado: EstadoCobro
  /** Ej: "Marzo 2025" — solo cobros recurrentes */
  periodo?: string
  fechaLimite: string
  valor: number
  diasMora?: number
  /** COP — solo inmuebles comerciales */
  interesesMora?: number
  /** Determina si aplica ley 820 (sin intereses de mora) */
  esInmuebleResidencial: boolean
  comprobante?: {
    url: string
    fechaPago: string
  }
}

export interface CobroDetalle extends Cobro {
  contrato: {
    id: string
    referencia: string
    tipo: TipoContrato
  }
  inmueble: {
    nombre: string
    direccion: string
  }
  cliente: {
    id: string
    nombre: string
    email: string
    telefono: string
  }
  historialPagos: PagoRegistrado[]
}

export interface PagoRegistrado {
  id: string
  fecha: string
  valor: number
  notas?: string
  comprobanteUrl?: string
  registradoPor?: string
}

// ---------------------------------------------------------------------------
// Resumen cobros de un contrato
// ---------------------------------------------------------------------------

export interface ResumenCobros {
  totalPendiente: number
  totalEnMora: number
  totalPagado: number
}

// ---------------------------------------------------------------------------
// Estado de cuenta (timeline)
// ---------------------------------------------------------------------------

export interface EventoCuenta {
  id: string
  tipo: TipoEventoCuenta
  fecha: string
  descripcion: string
  /** Positivo = cargo, negativo = abono */
  monto: number
  saldoAcumulado: number
  notas?: string
  cobroId?: string
  pagoId?: string
}

// ---------------------------------------------------------------------------
// Mora
// ---------------------------------------------------------------------------

export interface CobroMora {
  id: string
  tipo: TipoCobro
  periodo?: string
  fechaLimite: string
  diasMora: number
  valor: number
  interesesMora: number
}

export interface ContratoEnMora {
  contrato: {
    id: string
    referencia: string
    tipo: TipoContrato
  }
  inmueble: {
    nombre: string
    direccion: string
    esResidencial: boolean
  }
  cliente: {
    id: string
    nombre: string
  }
  cobrosEnMora: CobroMora[]
  urgencia: "alta" | "media" | "baja"
}

export interface ResumenMora {
  totalEnMora: number
  interesesAcumulados: number
  contratosAfectados: number
}

// ---------------------------------------------------------------------------
// Reportes
// ---------------------------------------------------------------------------

export interface PagoReporte {
  pagoId: string
  fecha: string
  contrato: {
    id: string
    referencia: string
    tipo: TipoContrato
  }
  inmueble: {
    nombre: string
    direccion: string
  }
  cliente: {
    nombre: string
  }
  tipoCobro: TipoCobro
  periodo?: string
  valor: number
}
