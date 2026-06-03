import { Router } from "express"
import { ok, fail, sendList, pageParams, matchBusqueda, nuevoId } from "../lib/http"
import {
  clientes,
  interaccionesPorCliente,
  contratosPorCliente,
  inmuebles,
} from "../store"
import type { ClienteResumen, Interaccion } from "../seed/types/cliente.types"

export const clientesRouter = Router()

/** GET /clientes */
clientesRouter.get("/", (req, res) => {
  const { busqueda, tipo, tipoPersona, activo } = req.query
  const { page, limit } = pageParams(req)
  let lista = clientes.filter(
    (c) =>
      matchBusqueda(busqueda, c.nombre, c.documento, c.email) &&
      (!tipo || c.tipos.includes(tipo as ClienteResumen["tipos"][number])) &&
      (!tipoPersona || c.tipoPersona === tipoPersona) &&
      (activo === undefined || c.activo === (activo === "true")),
  )
  sendList(res, lista, page, limit)
})

/** GET /clientes/:id */
clientesRouter.get("/:id", (req, res) => {
  const c = clientes.find((x) => x.id === req.params.id)
  if (!c) return fail(res, 404, "Cliente no encontrado")
  ok(res, {
    ...c,
    totalContratos: (contratosPorCliente[c.id] ?? []).length,
    totalInmuebles: inmuebles.filter((i) => i.propietarioId === c.id).length,
    totalInteracciones: (interaccionesPorCliente[c.id] ?? []).length,
  })
})

/** POST /clientes */
clientesRouter.post("/", (req, res) => {
  const b = req.body ?? {}
  if (!b.nombre || !b.documento) return fail(res, 400, "Nombre y documento son obligatorios")
  const nuevo: ClienteResumen = {
    id: nuevoId("cli-"),
    tipoPersona: b.tipoPersona,
    nombre: b.nombre,
    documento: b.documento,
    tipoDocumento: b.tipoDocumento,
    tipos: b.tipos ?? [],
    telefono: b.telefono ?? "",
    email: b.email ?? "",
    ciudad: b.ciudad ?? "",
    fechaRegistro: new Date().toISOString().slice(0, 10),
    representanteLegal: b.representanteLegal,
    activo: true,
  }
  clientes.unshift(nuevo)
  ok(res, nuevo, 201)
})

/** PUT /clientes/:id */
clientesRouter.put("/:id", (req, res) => {
  const c = clientes.find((x) => x.id === req.params.id)
  if (!c) return fail(res, 404, "Cliente no encontrado")
  Object.assign(c, req.body ?? {}, { id: c.id, fechaRegistro: c.fechaRegistro })
  ok(res, c)
})

/** PATCH /clientes/:id/estado */
clientesRouter.patch("/:id/estado", (req, res) => {
  const c = clientes.find((x) => x.id === req.params.id)
  if (!c) return fail(res, 404, "Cliente no encontrado")
  c.activo = Boolean(req.body?.activo)
  ok(res, { id: c.id, activo: c.activo })
})

/** GET /clientes/:id/contratos */
clientesRouter.get("/:id/contratos", (req, res) => {
  ok(res, contratosPorCliente[req.params.id] ?? [])
})

/** GET /clientes/:id/inmuebles */
clientesRouter.get("/:id/inmuebles", (req, res) => {
  const lista = inmuebles
    .filter((i) => i.propietarioId === req.params.id)
    .map((i) => ({
      id: i.id,
      tipo: i.tipo,
      modalidad: i.modalidad,
      estado: i.estado,
      direccion: i.direccion,
      ubicacion: i.ubicacion,
      area: i.area,
      precio: i.precio,
    }))
  ok(res, lista)
})

/** GET /clientes/:id/interacciones */
clientesRouter.get("/:id/interacciones", (req, res) => {
  const { tipo } = req.query
  const { page, limit } = pageParams(req)
  let lista = interaccionesPorCliente[req.params.id] ?? []
  if (tipo) lista = lista.filter((i) => i.tipo === tipo)
  sendList(res, lista, page, limit)
})

/** POST /clientes/:id/interacciones */
clientesRouter.post("/:id/interacciones", (req, res) => {
  const b = req.body ?? {}
  if (!b.tipo || !b.descripcion) return fail(res, 400, "Tipo y descripción son obligatorios")
  const nueva: Interaccion = {
    id: nuevoId("int-"),
    tipo: b.tipo,
    fecha: b.fecha ?? new Date().toISOString().slice(0, 10),
    hora: b.hora,
    descripcion: b.descripcion,
    asesor: "Emily Perea",
    inmuebleId: b.inmuebleId,
  }
  const arr = interaccionesPorCliente[req.params.id] ?? (interaccionesPorCliente[req.params.id] = [])
  arr.unshift(nueva)
  ok(res, nueva, 201)
})
