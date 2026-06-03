// -----------------------------------------------------------------------------
// Store en memoria. Se siembra una sola vez al arrancar, clonando los mocks del
// frontend para que las formas calcen al 100% con el contrato. Todas las
// mutaciones (crear/editar/eliminar) ocurren sobre estas estructuras.
//
// La capa de datos está aislada aquí a propósito: migrar a Postgres en el futuro
// significa reimplementar este módulo, sin tocar las rutas.
// -----------------------------------------------------------------------------

import { CLIENTES_MOCK, INTERACCIONES_MOCK, CONTRATOS_POR_CLIENTE } from "./seed/mock/clientes"
import { INMUEBLES_MOCK } from "./seed/mock/inmuebles"
import { CONTRATOS_MOCK, type ContratoMock } from "./seed/mock/contratos"
import { MANTENIMIENTO_MOCK, PROVEEDORES_OPCIONES } from "./seed/mock/mantenimiento"
import { SOLICITUDES_CHATBOT_MOCK } from "./seed/mock/chatbot"
import { ASESORES_MOCK } from "./seed/mock/usuarios"

import type { ClienteResumen, Interaccion, ContratoClienteResumen } from "./seed/types/cliente.types"
import type { InmuebleDetalle } from "./seed/types/inmueble.types"
import type { Cobro, CobroDetalle, PagoRegistrado, EventoCuenta, PagoReporte } from "./seed/types/pago.types"
import type { SolicitudMantenimiento, ProveedorOpcion } from "./seed/types/mantenimiento.types"
import type { SolicitudChatbot } from "./seed/types/chatbot.types"
import type {
  Usuario,
  EsquemaComisionDetalle,
  Parametros,
  TipoDocumentoReq,
  Plantilla,
} from "./seed/types/administracion.types"

const clone = <T>(v: T): T => structuredClone(v)

// --- Clientes ----------------------------------------------------------------
export const clientes: ClienteResumen[] = clone(CLIENTES_MOCK) as ClienteResumen[]
export const interaccionesPorCliente: Record<string, Interaccion[]> = clone(
  INTERACCIONES_MOCK,
) as Record<string, Interaccion[]>
export const contratosPorCliente: Record<string, ContratoClienteResumen[]> = Object.fromEntries(
  Object.entries(CONTRATOS_POR_CLIENTE).map(([id, lista]) => [
    id,
    lista.map((c) => ({ ...c, fechaInicio: "2024-02-01", fechaFin: "2026-02-01" })),
  ]),
)

// --- Inmuebles ---------------------------------------------------------------
export const inmuebles: InmuebleDetalle[] = Object.values(clone(INMUEBLES_MOCK)) as InmuebleDetalle[]

// --- Asesores (para selects del frontend) ------------------------------------
export const asesores = clone(ASESORES_MOCK)

// --- Contratos ---------------------------------------------------------------
export const contratos: ContratoMock[] = Object.values(clone(CONTRATOS_MOCK))

// --- Mantenimiento -----------------------------------------------------------
export const mantenimiento: SolicitudMantenimiento[] = Object.values(
  clone(MANTENIMIENTO_MOCK),
) as SolicitudMantenimiento[]
export const proveedores: ProveedorOpcion[] = clone(PROVEEDORES_OPCIONES) as ProveedorOpcion[]

// --- Chatbot -----------------------------------------------------------------
export const solicitudesChatbot: SolicitudChatbot[] = clone(SOLICITUDES_CHATBOT_MOCK) as SolicitudChatbot[]

// -----------------------------------------------------------------------------
// Cobros, pagos y estado de cuenta — sintetizados a partir de los contratos.
// -----------------------------------------------------------------------------

export interface CobroInterno extends Cobro {
  contratoId: string
}

export const cobros: CobroInterno[] = []
export const cobroIndex: Record<string, CobroInterno> = {}
export const estadoCuentaPorContrato: Record<string, EventoCuenta[]> = {}
export const pagosReporte: PagoReporte[] = []

const MESES = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio"]
const esComercial = (nombre: string) => /local|oficina|cc |bodega|consultora/i.test(nombre)

function sembrarCobros(): void {
  for (const c of contratos) {
    const canon = c.canon ?? c.precio ?? 0
    if (!canon) continue
    const residencial = !esComercial(c.inmueble)
    const dia = String(c.diaCorte ?? 5).padStart(2, "0")
    const eventos: EventoCuenta[] = []
    let saldo = 0

    MESES.forEach((mes, i) => {
      const num = String(i + 1).padStart(2, "0")
      const fechaLimite = `2025-${num}-${dia}`
      // Mora en los dos últimos periodos para contratos con saldos; pendiente el último para el resto.
      let estado: Cobro["estado"] = "pagado"
      if (c.estado === "vencido_con_saldos") estado = i >= 4 ? "en_mora" : "pagado"
      else estado = i === MESES.length - 1 ? "pendiente" : "pagado"

      const diasMora = estado === "en_mora" ? 15 + (MESES.length - i) * 10 : undefined
      const interesesMora =
        estado === "en_mora" && !residencial ? Math.round(canon * 0.03 * ((diasMora ?? 0) / 30)) : 0

      const cobro: CobroInterno = {
        id: `cob-${c.id}-${i + 1}`,
        contratoId: c.id,
        tipo: "canon",
        estado,
        periodo: `${mes} 2025`,
        fechaLimite,
        valor: canon,
        diasMora,
        interesesMora: interesesMora || undefined,
        esInmuebleResidencial: residencial,
        comprobante:
          estado === "pagado"
            ? { url: "https://placehold.co/600x800?text=Comprobante", fechaPago: `2025-${num}-${dia}` }
            : undefined,
      }
      cobros.push(cobro)
      cobroIndex[cobro.id] = cobro

      // Estado de cuenta: cargo del cobro y, si está pagado, el abono.
      saldo += canon
      eventos.push({
        id: `ev-${c.id}-${i}-cargo`,
        tipo: "cobro_generado",
        fecha: fechaLimite,
        descripcion: `Cobro de canon — ${mes} 2025`,
        monto: canon,
        saldoAcumulado: saldo,
        cobroId: cobro.id,
      })
      if (estado === "pagado") {
        saldo -= canon
        eventos.push({
          id: `ev-${c.id}-${i}-abono`,
          tipo: "pago_recibido",
          fecha: `2025-${num}-${dia}`,
          descripcion: `Pago recibido — ${mes} 2025`,
          monto: -canon,
          saldoAcumulado: saldo,
          cobroId: cobro.id,
        })
        pagosReporte.push({
          pagoId: `pag-${c.id}-${i + 1}`,
          fecha: `2025-${num}-${dia}`,
          contrato: { id: c.id, referencia: c.referencia, tipo: c.tipo },
          inmueble: { nombre: c.inmueble, direccion: c.direccion },
          cliente: { nombre: c.contraparte },
          tipoCobro: "canon",
          periodo: `${mes} 2025`,
          valor: canon,
        })
      }
    })
    estadoCuentaPorContrato[c.id] = eventos
  }
}

sembrarCobros()

export function detalleCobro(cobro: CobroInterno): CobroDetalle {
  const c = contratos.find((x) => x.id === cobro.contratoId)
  const historialPagos: PagoRegistrado[] =
    cobro.estado === "pagado" && cobro.comprobante
      ? [
          {
            id: `pag-${cobro.id}`,
            fecha: cobro.comprobante.fechaPago,
            valor: cobro.valor,
            comprobanteUrl: cobro.comprobante.url,
            registradoPor: "Emily Perea",
          },
        ]
      : []
  return {
    ...cobro,
    contrato: { id: c?.id ?? cobro.contratoId, referencia: c?.referencia ?? "—", tipo: c?.tipo ?? "arriendo" },
    inmueble: { nombre: c?.inmueble ?? "—", direccion: c?.direccion ?? "—" },
    cliente: { id: "cli", nombre: c?.contraparte ?? "—", email: "cliente@correo.com", telefono: "300 000 0000" },
    historialPagos,
  }
}

// -----------------------------------------------------------------------------
// Administración — datos sembrados.
// -----------------------------------------------------------------------------

export const usuarios: Usuario[] = [
  { id: "u1", nombre: "Emily Perea", correo: "admin@habu.com.co", roles: ["administrador"], estado: "activo", fechaCreacion: "2024-08-01" },
  { id: "u2", nombre: "Ana Rodríguez", correo: "asesor@habu.com.co", roles: ["asesor"], estado: "activo", fechaCreacion: "2024-09-10" },
  { id: "u3", nombre: "Luis Martínez", correo: "luis.martinez@habu.com.co", roles: ["asesor"], estado: "activo", fechaCreacion: "2024-10-05" },
  { id: "u4", nombre: "Jorge Castaño", correo: "jorge.castano@habu.com.co", roles: ["asesor"], estado: "inactivo", fechaCreacion: "2025-01-20" },
]

export const esquemas: EsquemaComisionDetalle[] = [
  {
    id: "esq-1", nombre: "Administración estándar", tipo: "administracion",
    porcentajeInmobiliaria: 60, porcentajeAsesor: 40,
    condiciones: "Aplica a contratos de arriendo residencial con administración incluida.",
    estado: "activo",
    asesores: [{ usuarioId: "u2", nombre: "Ana Rodríguez", correo: "asesor@habu.com.co", fechaAsignacion: "2025-01-15" }],
  },
  {
    id: "esq-2", nombre: "Colocación arriendo", tipo: "colocacion",
    porcentajeInmobiliaria: 50, porcentajeAsesor: 50,
    condiciones: "Comisión única equivalente a un canon al cerrar el arriendo.",
    estado: "activo", asesores: [],
  },
  {
    id: "esq-3", nombre: "Venta inmuebles", tipo: "venta",
    porcentajeInmobiliaria: 70, porcentajeAsesor: 30,
    condiciones: "3% sobre el precio de venta de la promesa de compraventa.",
    estado: "inactivo", asesores: [],
  },
]

export const parametros: Parametros = {
  moraGraciaDiasHabiles: 5,
  moraAplicaResidencial: false,
  moraTasaResidencial: 0,
  moraTasaComercial: 3,
  alertaVencimientoDias: 30,
  alertaRenovacionDias: 60,
}

export const tiposDocumento: TipoDocumentoReq[] = [
  { id: "td-1", nombre: "Cédula de ciudadanía", tipoPersona: "natural", tipoInmueble: "ambos", requiereCodeudor: false, obligatorio: true },
  { id: "td-2", nombre: "Certificado de ingresos", tipoPersona: "natural", tipoInmueble: "residencial", requiereCodeudor: false, obligatorio: true },
  { id: "td-3", nombre: "Cámara de comercio", tipoPersona: "juridica", tipoInmueble: "comercial", requiereCodeudor: false, obligatorio: true },
  { id: "td-4", nombre: "Certificación laboral del codeudor", tipoPersona: "natural", tipoInmueble: "residencial", requiereCodeudor: true, obligatorio: false },
]

export const plantillas: Plantilla[] = [
  { id: "pl-1", nombre: "Contrato de arriendo residencial", tipo: "arriendo", ultimaEdicion: "2025-04-10", contenido: "<h2>Contrato de Arrendamiento</h2><p>Entre {{propietario}} y {{arrendatario}}...</p>" },
  { id: "pl-2", nombre: "Promesa de compraventa", tipo: "promesa_compraventa", ultimaEdicion: "2025-03-22", contenido: "<h2>Promesa de Compraventa</h2><p>El vendedor {{vendedor}} promete vender...</p>" },
  { id: "pl-3", nombre: "Contrato de administración", tipo: "administracion", ultimaEdicion: "2025-02-15", contenido: "<h2>Mandato de Administración</h2><p>El propietario {{propietario}} encarga...</p>" },
]
