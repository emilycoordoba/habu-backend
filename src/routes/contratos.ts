import { Router } from "express"
import { ok, fail, sendList, pageParams, matchBusqueda, nuevoId } from "../lib/http"
import { upload, urlSimulada } from "../lib/upload"
import {
  contratos,
  cobros,
  estadoCuentaPorContrato,
} from "../store"
import type { ContratoMock } from "../seed/mock/contratos"
import type {
  EstadoContrato,
  ContratoResumen,
  ContratoDetalle,
  DocumentoContrato,
  FirmaContrato,
  EventoHistorial,
} from "../seed/types/contrato.types"

export const contratosRouter = Router()

const ESTADOS: EstadoContrato[] = [
  "borrador", "en_firmas", "activo", "en_escrituracion", "pendiente_registro",
  "por_vencer", "vencido_con_saldos", "terminacion_en_disputa", "terminado_anticipadamente", "finalizado",
]

// Documentos, firmas e historial viven aquí (el mock de contratos no los traía).
const documentosPorContrato: Record<string, DocumentoContrato[]> = {}
const firmasPorContrato: Record<string, FirmaContrato[]> = {}
const historialPorContrato: Record<string, EventoHistorial[]> = {}

function docsDe(id: string): DocumentoContrato[] {
  return (documentosPorContrato[id] ??= [
    { id: "doc-1", nombre: "Cédula del arrendatario", tipo: "identificacion", estado: "recibido", fechaSubida: "2025-01-20", urlArchivo: urlSimulada("cedula") },
    { id: "doc-2", nombre: "Certificado laboral", tipo: "soporte", estado: "pendiente" },
  ])
}
function firmasDe(c: ContratoMock): FirmaContrato[] {
  const firmado = ["activo", "por_vencer", "vencido_con_saldos", "finalizado"].includes(c.estado)
  return (firmasPorContrato[c.id] ??= [
    { id: "fir-1", parte: c.propietario, rol: "Arrendador", estado: firmado ? "firmado" : "pendiente", fechaFirma: firmado ? c.fechaInicio : undefined },
    { id: "fir-2", parte: c.contraparte, rol: "Arrendatario", estado: firmado ? "firmado" : "pendiente", fechaFirma: firmado ? c.fechaInicio : undefined },
  ])
}
function histDe(c: ContratoMock): EventoHistorial[] {
  return (historialPorContrato[c.id] ??= [
    { id: "h-1", tipo: "creacion", descripcion: "Contrato creado", fecha: c.fechaInicio ?? "2025-01-15", usuario: c.asesor },
  ])
}

function aResumen(c: ContratoMock): ContratoResumen {
  return {
    id: c.id, referencia: c.referencia, tipo: c.tipo, estado: c.estado,
    inmueble: c.inmueble, direccion: c.direccion,
    propietario: c.propietario, contraparte: c.contraparte, asesor: c.asesor,
    fechaInicio: c.fechaInicio ?? "—", fechaFin: c.fechaFin ?? "—",
    valorCanon: c.canon ?? c.precio ?? 0,
  }
}

function aDetalle(c: ContratoMock): ContratoDetalle {
  const ciudad = c.direccion.split(",").pop()?.trim() ?? ""
  const persona = (nombre: string) => ({
    id: nuevoId("p-"), nombre, documento: "—", tipoDocumento: "CC" as const,
    telefono: "300 000 0000", email: "contacto@correo.com",
  })
  return {
    id: c.id, referencia: c.referencia, tipo: c.tipo, estado: c.estado,
    fechaInicio: c.fechaInicio ?? "—", fechaFin: c.fechaFin ?? "—", asesor: c.asesor,
    inmueble: { id: `inm-${c.id}`, nombre: c.inmueble, direccion: c.direccion, ciudad },
    propietario: persona(c.propietario),
    contraparte: persona(c.contraparte),
    codeudor: c.tieneCodudor && c.codeudor ? { nombre: c.codeudor, documento: "—" } : undefined,
    condicionesArriendo: c.tipo === "arriendo" ? {
      valorCanon: c.canon ?? 0, diaCorte: c.diaCorte ?? 5,
      incluyeAdministracion: Boolean(c.incluyeAdmin), valorAdministracion: c.adminValor,
      tieneDeposito: Boolean(c.deposito), valorDeposito: c.deposito,
      duracionMeses: 12,
    } : undefined,
    condicionesPromesa: c.tipo === "promesa_compraventa" ? {
      precioVenta: c.precio ?? 0, valorArras: c.arras ?? 0,
      fechaLimiteArras: c.fechaLimiteArras ?? "—", formaPago: (c.formaPago as never) ?? "contado",
      entidadFinanciera: c.entidadFinanciera, fechaEscrituracion: c.fechaEscrituracion,
    } : undefined,
    documentos: docsDe(c.id),
    firmas: firmasDe(c),
    historial: histDe(c),
  }
}

const buscar = (id: string) => contratos.find((c) => c.id === id)

/** GET /contratos */
contratosRouter.get("/", (req, res) => {
  const { busqueda, estado, tipo, asesor } = req.query
  const { page, limit } = pageParams(req)
  const lista = contratos.filter(
    (c) =>
      matchBusqueda(busqueda, c.referencia, c.inmueble, c.propietario, c.contraparte) &&
      (!estado || c.estado === estado) &&
      (!tipo || c.tipo === tipo) &&
      (!asesor || c.asesor === asesor),
  )
  const resumenEstados = Object.fromEntries(
    ESTADOS.map((e) => [e, contratos.filter((c) => c.estado === e).length]),
  ) as Record<EstadoContrato, number>
  sendList(res, lista.map(aResumen), page, limit, { resumenEstados })
})

/** GET /contratos/:id */
contratosRouter.get("/:id", (req, res) => {
  const c = buscar(req.params.id)
  if (!c) return fail(res, 404, "Contrato no encontrado")
  ok(res, aDetalle(c))
})

function crearContrato(tipo: ContratoMock["tipo"], b: Record<string, unknown>): ContratoMock {
  const id = nuevoId("ctr-")
  const nuevo: ContratoMock = {
    id, referencia: `CTR-2025-${id.slice(-3)}`, tipo, estado: "borrador",
    inmueble: `Inmueble ${b.inmuebleId ?? ""}`, direccion: "Por definir",
    propietario: "Propietario", contraparte: "Contraparte", asesor: String(b.asesor ?? "Emily Perea"),
    tieneCodudor: Boolean((b as { tieneCodeudor?: boolean }).tieneCodeudor),
    canon: Number((b as { valorCanon?: number }).valorCanon) || undefined,
    precio: Number((b as { precioVenta?: number }).precioVenta) || undefined,
    fechaInicio: String((b as { fechaInicio?: string }).fechaInicio ?? new Date().toISOString().slice(0, 10)),
    diaCorte: Number((b as { diaCorte?: number }).diaCorte) || 5,
  }
  contratos.unshift(nuevo)
  return nuevo
}

/** POST /contratos/arriendo */
contratosRouter.post("/arriendo", (req, res) => {
  const c = crearContrato("arriendo", req.body ?? {})
  ok(res, { id: c.id, referencia: c.referencia, estado: "borrador" }, 201)
})

/** POST /contratos/promesa */
contratosRouter.post("/promesa", (req, res) => {
  const c = crearContrato("promesa_compraventa", req.body ?? {})
  ok(res, { id: c.id, referencia: c.referencia, estado: "borrador" }, 201)
})

/** POST /contratos/:id/renovar */
contratosRouter.post("/:id/renovar", (req, res) => {
  const c = buscar(req.params.id)
  if (!c) return fail(res, 404, "Contrato no encontrado")
  c.fechaFin = String(req.body?.nuevaFechaFin ?? c.fechaFin)
  if (req.body?.nuevoValorCanon) c.canon = Number(req.body.nuevoValorCanon)
  c.estado = "activo"
  ok(res, { id: c.id, estado: c.estado, fechaFin: c.fechaFin, valorCanon: c.canon ?? 0 })
})

/** POST /contratos/:id/terminar */
contratosRouter.post("/:id/terminar", (req, res) => {
  const c = buscar(req.params.id)
  if (!c) return fail(res, 404, "Contrato no encontrado")
  c.estado = req.body?.enDisputa ? "terminacion_en_disputa" : "terminado_anticipadamente"
  ok(res, { id: c.id, estado: c.estado })
})

/** PATCH /contratos/:id/firmas */
contratosRouter.patch("/:id/firmas", (req, res) => {
  const c = buscar(req.params.id)
  if (!c) return fail(res, 404, "Contrato no encontrado")
  const firmas = firmasDe(c)
  for (const f of firmas) {
    f.estado = "firmado"
    f.fechaFirma = new Date().toISOString().slice(0, 10)
  }
  c.estado = "activo"
  ok(res, { id: c.id, estado: c.estado, firmas })
})

/** POST /contratos/:id/escriturar */
contratosRouter.post("/:id/escriturar", (req, res) => {
  const c = buscar(req.params.id)
  if (!c) return fail(res, 404, "Contrato no encontrado")
  c.estado = "pendiente_registro"
  c.fechaEscrituracion = String(req.body?.fechaEscrituracion ?? "")
  ok(res, { id: c.id, estado: "pendiente_registro" })
})

/** GET /contratos/:id/documentos */
contratosRouter.get("/:id/documentos", (req, res) => {
  if (!buscar(req.params.id)) return fail(res, 404, "Contrato no encontrado")
  ok(res, docsDe(req.params.id))
})

/** POST /contratos/:id/documentos (multipart) */
contratosRouter.post("/:id/documentos", upload.single("archivo"), (req, res) => {
  if (!buscar(req.params.id)) return fail(res, 404, "Contrato no encontrado")
  const doc: DocumentoContrato = {
    id: nuevoId("doc-"),
    nombre: String(req.body?.nombre ?? req.file?.originalname ?? "Documento"),
    tipo: String(req.body?.tipo ?? "soporte"),
    estado: "recibido",
    fechaSubida: new Date().toISOString().slice(0, 10),
    urlArchivo: urlSimulada(req.file?.originalname ?? "documento"),
  }
  docsDe(req.params.id).unshift(doc)
  ok(res, doc, 201)
})

/** PATCH /contratos/:id/documentos/:docId */
contratosRouter.patch("/:id/documentos/:docId", (req, res) => {
  const doc = docsDe(req.params.id).find((d) => d.id === req.params.docId)
  if (!doc) return fail(res, 404, "Documento no encontrado")
  doc.estado = req.body?.estado ?? doc.estado
  ok(res, doc)
})

/** DELETE /contratos/:id/documentos/:docId */
contratosRouter.delete("/:id/documentos/:docId", (req, res) => {
  documentosPorContrato[req.params.id] = docsDe(req.params.id).filter((d) => d.id !== req.params.docId)
  res.status(204).end()
})

/** GET /contratos/:id/documentos/:docId/descargar */
contratosRouter.get("/:id/documentos/:docId/descargar", (_req, res) => {
  res.redirect("https://placehold.co/600x800?text=Documento+PDF")
})

/** DELETE /contratos/:id */
contratosRouter.delete("/:id", (req, res) => {
  const i = contratos.findIndex((c) => c.id === req.params.id)
  if (i === -1) return fail(res, 404, "Contrato no encontrado")
  contratos.splice(i, 1)
  res.status(204).end()
})

/** GET /contratos/:id/cobros */
contratosRouter.get("/:id/cobros", (req, res) => {
  if (!buscar(req.params.id)) return fail(res, 404, "Contrato no encontrado")
  const { estado, tipo } = req.query
  const { page, limit } = pageParams(req)
  let lista = cobros.filter((c) => c.contratoId === req.params.id)
  if (estado) lista = lista.filter((c) => c.estado === estado)
  if (tipo) lista = lista.filter((c) => c.tipo === tipo)
  const todos = cobros.filter((c) => c.contratoId === req.params.id)
  const resumen = {
    totalPendiente: todos.filter((c) => c.estado === "pendiente").reduce((s, c) => s + c.valor, 0),
    totalEnMora: todos.filter((c) => c.estado === "en_mora").reduce((s, c) => s + c.valor, 0),
    totalPagado: todos.filter((c) => c.estado === "pagado").reduce((s, c) => s + c.valor, 0),
  }
  const limpios = lista.map(({ contratoId, ...rest }) => rest)
  sendList(res, limpios, page, limit, { resumen })
})

/** GET /contratos/:id/estado-cuenta */
contratosRouter.get("/:id/estado-cuenta", (req, res) => {
  if (!buscar(req.params.id)) return fail(res, 404, "Contrato no encontrado")
  const eventos = estadoCuentaPorContrato[req.params.id] ?? []
  const saldoActual = eventos.length ? eventos[eventos.length - 1].saldoAcumulado : 0
  res.json({ data: eventos, saldoActual })
})
