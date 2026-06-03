import { Router } from "express"
import { ok, fail, sendList, pageParams, nuevoId } from "../lib/http"
import { upload, urlSimulada } from "../lib/upload"
import { cobros, cobroIndex, detalleCobro, pagosReporte, contratos } from "../store"
import type { ContratoEnMora, CobroMora } from "../seed/types/pago.types"

export const cobrosRouter = Router()
export const reportesRouter = Router()

/** GET /cobros/mora  (debe ir antes de /:cobroId) */
cobrosRouter.get("/mora", (req, res) => {
  const { contratoId } = req.query
  const { page, limit } = pageParams(req)
  let enMora = cobros.filter((c) => c.estado === "en_mora")
  if (contratoId) enMora = enMora.filter((c) => c.contratoId === contratoId)

  const porContrato = new Map<string, typeof enMora>()
  for (const c of enMora) {
    const arr = porContrato.get(c.contratoId) ?? []
    arr.push(c)
    porContrato.set(c.contratoId, arr)
  }

  const lista: ContratoEnMora[] = [...porContrato.entries()].map(([contratoId, items]) => {
    const ctr = contratos.find((x) => x.id === contratoId)
    const maxDias = Math.max(...items.map((i) => i.diasMora ?? 0))
    const cobrosEnMora: CobroMora[] = items.map((i) => ({
      id: i.id, tipo: i.tipo, periodo: i.periodo, fechaLimite: i.fechaLimite,
      diasMora: i.diasMora ?? 0, valor: i.valor, interesesMora: i.interesesMora ?? 0,
    }))
    return {
      contrato: { id: contratoId, referencia: ctr?.referencia ?? "—", tipo: ctr?.tipo ?? "arriendo" },
      inmueble: { nombre: ctr?.inmueble ?? "—", direccion: ctr?.direccion ?? "—", esResidencial: items[0].esInmuebleResidencial },
      cliente: { id: "cli", nombre: ctr?.contraparte ?? "—" },
      cobrosEnMora,
      urgencia: maxDias > 40 ? "alta" : maxDias > 20 ? "media" : "baja",
    }
  })

  const resumen = {
    totalEnMora: enMora.reduce((s, c) => s + c.valor, 0),
    interesesAcumulados: enMora.reduce((s, c) => s + (c.interesesMora ?? 0), 0),
    contratosAfectados: porContrato.size,
  }
  sendList(res, lista, page, limit, { resumen })
})

/** GET /cobros/:cobroId */
cobrosRouter.get("/:cobroId", (req, res) => {
  const cobro = cobroIndex[req.params.cobroId]
  if (!cobro) return fail(res, 404, "Cobro no encontrado")
  ok(res, detalleCobro(cobro))
})

/** POST /cobros/:cobroId/pagos (multipart) */
cobrosRouter.post("/:cobroId/pagos", upload.single("comprobante"), (req, res) => {
  const cobro = cobroIndex[req.params.cobroId]
  if (!cobro) return fail(res, 404, "Cobro no encontrado")
  const fecha = String(req.body?.fecha ?? new Date().toISOString().slice(0, 10))
  cobro.estado = "pagado"
  cobro.comprobante = { url: urlSimulada(req.file?.originalname ?? "comprobante"), fechaPago: fecha }
  ok(res, {
    pagoId: nuevoId("pag-"),
    cobroId: cobro.id,
    nuevoEstadoCobro: cobro.estado,
    comprobante: cobro.comprobante,
  }, 201)
})

/** GET /reportes/pagos */
reportesRouter.get("/pagos", (req, res) => {
  const { desde, hasta, tipo } = req.query
  const { page, limit } = pageParams(req)
  let lista = pagosReporte.slice()
  if (desde) lista = lista.filter((p) => p.fecha >= String(desde))
  if (hasta) lista = lista.filter((p) => p.fecha <= String(hasta))
  if (tipo) lista = lista.filter((p) => p.tipoCobro === tipo)
  const resumen = { totalRecibido: lista.reduce((s, p) => s + p.valor, 0) }
  sendList(res, lista, page, limit, { resumen })
})
