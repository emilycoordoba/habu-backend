import { Router } from "express"
import { ok, fail, sendList, pageParams, matchBusqueda, nuevoId } from "../lib/http"
import { solicitudesChatbot } from "../store"
import type { SolicitudChatbot, EstadoSolicitud } from "../seed/types/chatbot.types"

export const chatbotRouter = Router()

const hoy = () => new Date().toISOString().slice(0, 10)

/** POST /chatbot/solicitudes — público (sin auth) */
chatbotRouter.post("/solicitudes", (req, res) => {
  const b = req.body ?? {}
  if (!b.nombre || !b.telefono) return fail(res, 400, "Nombre y teléfono son obligatorios")
  const nueva: SolicitudChatbot = {
    id: nuevoId("sol-"),
    tipo: b.tipo ?? "contacto",
    estado: "nueva",
    fecha: hoy(),
    nombre: b.nombre,
    telefono: b.telefono,
    correo: b.correo ?? "",
    inmuebleInteres: b.inmuebleInteres ?? null,
    mensaje: b.mensaje ?? null,
    fechaVisita: b.fechaVisita ?? null,
    horaVisita: b.horaVisita ?? null,
    asesorAsignado: null,
    historial: b.historial ?? [],
  }
  solicitudesChatbot.unshift(nueva)
  ok(res, { id: nueva.id, estado: "nueva" }, 201)
})

/** GET /chatbot/solicitudes */
chatbotRouter.get("/solicitudes", (req, res) => {
  const { busqueda, estado, tipo, conAsesor } = req.query
  const { page, limit } = pageParams(req)
  const lista = solicitudesChatbot.filter(
    (s) =>
      matchBusqueda(busqueda, s.nombre, s.telefono, s.correo) &&
      (!estado || s.estado === estado) &&
      (!tipo || s.tipo === tipo) &&
      (conAsesor === undefined || (conAsesor === "true" ? s.asesorAsignado !== null : s.asesorAsignado === null)),
  )
  const resumenEstados = {
    nueva: solicitudesChatbot.filter((s) => s.estado === "nueva").length,
    en_gestion: solicitudesChatbot.filter((s) => s.estado === "en_gestion").length,
    atendida: solicitudesChatbot.filter((s) => s.estado === "atendida").length,
  }
  sendList(res, lista, page, limit, { resumenEstados })
})

/** GET /chatbot/solicitudes/:id */
chatbotRouter.get("/solicitudes/:id", (req, res) => {
  const s = solicitudesChatbot.find((x) => x.id === req.params.id)
  if (!s) return fail(res, 404, "Solicitud no encontrada")
  ok(res, s)
})

/** PATCH /chatbot/solicitudes/:id/asesor */
chatbotRouter.patch("/solicitudes/:id/asesor", (req, res) => {
  const s = solicitudesChatbot.find((x) => x.id === req.params.id)
  if (!s) return fail(res, 404, "Solicitud no encontrada")
  s.asesorAsignado = req.body?.asesorAsignado ?? null
  s.estado = "en_gestion"
  ok(res, { id: s.id, estado: s.estado, asesorAsignado: s.asesorAsignado })
})

/** PATCH /chatbot/solicitudes/:id/atender */
chatbotRouter.patch("/solicitudes/:id/atender", (req, res) => {
  const s = solicitudesChatbot.find((x) => x.id === req.params.id)
  if (!s) return fail(res, 404, "Solicitud no encontrada")
  s.estado = "atendida"
  ok(res, { id: s.id, estado: "atendida" })
})
