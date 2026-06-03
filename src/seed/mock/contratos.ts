import type { TipoContrato, EstadoContrato } from "@/types/contrato.types"

/** Shape del mock mientras no hay API — cubre las necesidades de detalle y renovación */
export interface ContratoMock {
  id: string
  referencia: string
  tipo: TipoContrato
  estado: EstadoContrato
  inmueble: string
  direccion: string
  propietario: string
  contraparte: string
  asesor: string
  tieneCodudor: boolean
  codeudor?: string
  canon?: number
  fechaInicio?: string
  fechaFin?: string
  diaCorte?: number
  deposito?: number
  incluyeAdmin?: boolean
  adminValor?: number
  precio?: number
  arras?: number
  fechaLimiteArras?: string
  formaPago?: string
  entidadFinanciera?: string
  fechaEscrituracion?: string
}

export const CONTRATOS_MOCK: Record<string, ContratoMock> = {
  "1": {
    id: "1", referencia: "CTR-2025-001", tipo: "arriendo", estado: "activo",
    inmueble: "Apto 301 Torre A", direccion: "Cra 15 #93-47, Bogotá",
    propietario: "Ana Martínez", contraparte: "Carlos Mendoza",
    asesor: "Emily Perea", tieneCodudor: false,
    canon: 2800000, fechaInicio: "2024-02-01", fechaFin: "2026-02-01",
    diaCorte: 5, deposito: 5600000, incluyeAdmin: true, adminValor: 320000,
  },
  "2": {
    id: "2", referencia: "CTR-2025-002", tipo: "promesa_compraventa", estado: "en_firmas",
    inmueble: "Casa 12 Urb. El Prado", direccion: "Cll 50 #30-10, Medellín",
    propietario: "Pedro Vargas", contraparte: "Sofía Torres",
    asesor: "Luis Martínez", tieneCodudor: false,
    precio: 380000000, arras: 38000000, fechaLimiteArras: "2026-04-15",
    formaPago: "credito_hipotecario", entidadFinanciera: "Bancolombia",
    fechaInicio: "2026-03-15", fechaFin: "2026-09-15",
  },
  "3": {
    id: "3", referencia: "CTR-2025-003", tipo: "arriendo", estado: "por_vencer",
    inmueble: "Local 5 CC Bulevar", direccion: "Av. El Dorado #68C-61, Bogotá",
    propietario: "Inversiones XYZ", contraparte: "Tienda Moda Libre",
    asesor: "Ana Rodríguez", tieneCodudor: false,
    canon: 4800000, fechaInicio: "2024-05-15", fechaFin: "2026-05-15",
    diaCorte: 15, deposito: 9600000, incluyeAdmin: false,
  },
  "4": {
    id: "4", referencia: "CTR-2024-018", tipo: "arriendo", estado: "vencido_con_saldos",
    inmueble: "Oficina 208 Ed. Centenario", direccion: "Cra 7 #32-16, Bogotá",
    propietario: "María López", contraparte: "Consultora ABC",
    asesor: "Luis Martínez", tieneCodudor: false,
    canon: 3200000, fechaInicio: "2024-01-01", fechaFin: "2025-01-01",
    diaCorte: 1, deposito: 6400000,
  },
  "5": {
    id: "5", referencia: "CTR-2025-004", tipo: "arriendo", estado: "borrador",
    inmueble: "Apto 502 Torres del Norte", direccion: "Cll 127 #15-40, Bogotá",
    propietario: "Jorge Herrera", contraparte: "Carlos Mendoza",
    asesor: "Emily Perea", tieneCodudor: false,
    canon: 1950000, fechaInicio: "2025-05-01", fechaFin: "2026-05-01",
    diaCorte: 1, deposito: 1950000,
  },
}
