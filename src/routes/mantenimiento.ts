import { Router } from "express"
import { ok, fail, sendList, pageParams, matchBusqueda, nuevoId } from "../lib/http"
import { upload, urlSimulada } from "../lib/upload"
import { mantenimiento, proveedores } from "../store"
import type { SolicitudMantenimiento, EstadoMantenimiento, EvidenciaMantenimiento, ProveedorOpcion } from "../seed/types/mantenimiento.types"

export const mantenimientoRouter = Router()

const hoy = () => new Date().toISOString().slice(0, 10)
const evidenciasDe = (files?: Express.Multer.File[]): EvidenciaMantenimiento[] =>
  (files ?? []).map((f) => ({ id: nuevoId("ev-"), nombre: f.originalname, url: urlSimulada(f.originalname), fechaCarga: hoy() }))

// --- Proveedores (rutas declaradas antes de /:id para evitar colisiones) ------

mantenimientoRouter.get("/proveedores", (req, res) => {
  const lista = proveedores.filter((p) => matchBusqueda(req.query.busqueda, p.nombre, p.especialidad))
  ok(res, lista)
})

mantenimientoRouter.post("/proveedores", (req, res) => {
  const b = req.body ?? {}
  if (!b.nombre) return fail(res, 400, "El nombre del proveedor es obligatorio")
  const nuevo: ProveedorOpcion = {
    id: nuevoId("prov-"), nombre: b.nombre, especialidad: b.especialidad ?? "",
    telefono: b.telefono ?? "", correo: b.correo, calificacion: b.calificacion,
  }
  proveedores.unshift(nuevo)
  ok(res, nuevo, 201)
})

mantenimientoRouter.patch("/proveedores/:id", (req, res) => {
  const p = proveedores.find((x) => x.id === req.params.id)
  if (!p) return fail(res, 404, "Proveedor no encontrado")
  Object.assign(p, req.body ?? {}, { id: p.id })
  ok(res, p)
})

mantenimientoRouter.delete("/proveedores/:id", (req, res) => {
  const i = proveedores.findIndex((x) => x.id === req.params.id)
  if (i === -1) return fail(res, 404, "Proveedor no encontrado")
  proveedores.splice(i, 1)
  res.status(204).end()
})

// --- Solicitudes -------------------------------------------------------------

const ESTADOS: EstadoMantenimiento[] = ["pendiente", "en_proceso", "finalizado", "cancelado"]

mantenimientoRouter.get("/", (req, res) => {
  const { busqueda, estado, prioridad } = req.query
  const { page, limit } = pageParams(req)
  const lista = mantenimiento.filter(
    (m) =>
      matchBusqueda(busqueda, m.inmuebleDireccion, m.descripcion, m.proveedorNombre) &&
      (!estado || m.estado === estado) &&
      (!prioridad || m.prioridad === prioridad),
  )
  const resumenEstados = Object.fromEntries(
    ESTADOS.map((e) => [e, mantenimiento.filter((m) => m.estado === e).length]),
  ) as Record<EstadoMantenimiento, number>
  sendList(res, lista, page, limit, { resumenEstados })
})

mantenimientoRouter.get("/:id", (req, res) => {
  const m = mantenimiento.find((x) => x.id === req.params.id)
  if (!m) return fail(res, 404, "Solicitud no encontrada")
  ok(res, m)
})

mantenimientoRouter.post("/", upload.array("evidencias"), (req, res) => {
  const b = req.body ?? {}
  if (!b.descripcion) return fail(res, 400, "La descripción es obligatoria")
  const nueva: SolicitudMantenimiento = {
    id: nuevoId("man-"),
    inmuebleId: b.inmuebleId ?? "",
    inmuebleDireccion: b.inmuebleDireccion ?? `Inmueble ${b.inmuebleId ?? ""}`,
    inmuebleUbicacion: b.inmuebleUbicacion ?? "",
    descripcion: b.descripcion,
    prioridad: b.prioridad ?? "media",
    estado: "pendiente",
    fechaRegistro: hoy(),
    registradoPor: "Emily Perea",
    historial: [{ id: nuevoId("h-"), estado: "pendiente", fecha: hoy(), nota: "Solicitud registrada", usuario: "Emily Perea" }],
    evidencias: evidenciasDe(req.files as Express.Multer.File[]),
  }
  mantenimiento.unshift(nueva)
  ok(res, nueva, 201)
})

mantenimientoRouter.patch("/:id/asignar", (req, res) => {
  const m = mantenimiento.find((x) => x.id === req.params.id)
  if (!m) return fail(res, 404, "Solicitud no encontrada")
  const prov = proveedores.find((p) => p.id === req.body?.proveedorId)
  if (!prov) return fail(res, 400, "Proveedor no válido")
  m.proveedorId = prov.id
  m.proveedorNombre = prov.nombre
  m.proveedorEspecialidad = prov.especialidad
  m.estado = "en_proceso"
  m.historial.unshift({ id: nuevoId("h-"), estado: "en_proceso", fecha: hoy(), nota: req.body?.notas ?? `Asignado a ${prov.nombre}`, usuario: "Emily Perea" })
  ok(res, m)
})

mantenimientoRouter.patch("/:id/estado", upload.array("evidencias"), (req, res) => {
  const m = mantenimiento.find((x) => x.id === req.params.id)
  if (!m) return fail(res, 404, "Solicitud no encontrada")
  m.estado = req.body?.estado ?? m.estado
  m.historial.unshift({ id: nuevoId("h-"), estado: m.estado, fecha: hoy(), nota: req.body?.nota, usuario: "Emily Perea" })
  m.evidencias.push(...evidenciasDe(req.files as Express.Multer.File[]))
  ok(res, m)
})

mantenimientoRouter.patch("/:id/costo", upload.single("factura"), (req, res) => {
  const m = mantenimiento.find((x) => x.id === req.params.id)
  if (!m) return fail(res, 404, "Solicitud no encontrada")
  m.costo = Number(req.body?.costo) || 0
  if (req.file) m.evidencias.push({ id: nuevoId("ev-"), nombre: req.file.originalname, url: urlSimulada(req.file.originalname), fechaCarga: hoy() })
  ok(res, m)
})
