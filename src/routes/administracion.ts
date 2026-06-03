import { Router } from "express"
import { ok, fail, sendList, pageParams, matchBusqueda, nuevoId } from "../lib/http"
import { usuarios, esquemas, parametros, tiposDocumento, plantillas } from "../store"
import type { Usuario, EsquemaComisionDetalle, TipoDocumentoReq, Plantilla } from "../seed/types/administracion.types"

export const administracionRouter = Router()
export const comisionesRouter = Router()

const hoy = () => new Date().toISOString().slice(0, 10)

// --- Usuarios ----------------------------------------------------------------

administracionRouter.get("/usuarios", (req, res) => {
  const { busqueda, rol, estado } = req.query
  const { page, limit } = pageParams(req)
  const lista = usuarios.filter(
    (u) =>
      matchBusqueda(busqueda, u.nombre, u.correo) &&
      (!rol || u.roles.includes(rol as Usuario["roles"][number])) &&
      (!estado || u.estado === estado),
  )
  sendList(res, lista, page, limit)
})

administracionRouter.get("/usuarios/:id", (req, res) => {
  const u = usuarios.find((x) => x.id === req.params.id)
  if (!u) return fail(res, 404, "Usuario no encontrado")
  ok(res, u)
})

administracionRouter.post("/usuarios", (req, res) => {
  const b = req.body ?? {}
  if (!b.nombre || !b.correo) return fail(res, 400, "Nombre y correo son obligatorios")
  const nuevo: Usuario = {
    id: nuevoId("usr-"), nombre: b.nombre, correo: b.correo,
    roles: b.roles ?? ["asesor"], estado: b.estado ?? "activo", fechaCreacion: hoy(),
  }
  usuarios.unshift(nuevo)
  ok(res, nuevo, 201)
})

administracionRouter.patch("/usuarios/:id", (req, res) => {
  const u = usuarios.find((x) => x.id === req.params.id)
  if (!u) return fail(res, 404, "Usuario no encontrado")
  Object.assign(u, req.body ?? {}, { id: u.id })
  ok(res, u)
})

administracionRouter.patch("/usuarios/:id/estado", (req, res) => {
  const u = usuarios.find((x) => x.id === req.params.id)
  if (!u) return fail(res, 404, "Usuario no encontrado")
  u.estado = req.body?.estado ?? u.estado
  ok(res, { id: u.id, estado: u.estado })
})

// --- Parámetros --------------------------------------------------------------

administracionRouter.get("/parametros", (_req, res) => ok(res, parametros))

administracionRouter.patch("/parametros", (req, res) => {
  Object.assign(parametros, req.body ?? {})
  ok(res, parametros)
})

// --- Tipos de documento ------------------------------------------------------

administracionRouter.get("/tipos-documento", (req, res) => {
  const { busqueda, tipoPersona, tipoInmueble } = req.query
  const lista = tiposDocumento.filter(
    (t) =>
      matchBusqueda(busqueda, t.nombre) &&
      (!tipoPersona || t.tipoPersona === tipoPersona) &&
      (!tipoInmueble || t.tipoInmueble === tipoInmueble),
  )
  ok(res, lista)
})

administracionRouter.post("/tipos-documento", (req, res) => {
  const b = req.body ?? {}
  if (!b.nombre) return fail(res, 400, "El nombre es obligatorio")
  const nuevo: TipoDocumentoReq = {
    id: nuevoId("td-"), nombre: b.nombre, tipoPersona: b.tipoPersona, tipoInmueble: b.tipoInmueble,
    requiereCodeudor: Boolean(b.requiereCodeudor), obligatorio: Boolean(b.obligatorio),
  }
  tiposDocumento.unshift(nuevo)
  ok(res, nuevo, 201)
})

administracionRouter.patch("/tipos-documento/:id", (req, res) => {
  const t = tiposDocumento.find((x) => x.id === req.params.id)
  if (!t) return fail(res, 404, "Tipo de documento no encontrado")
  Object.assign(t, req.body ?? {}, { id: t.id })
  ok(res, t)
})

administracionRouter.delete("/tipos-documento/:id", (req, res) => {
  const i = tiposDocumento.findIndex((x) => x.id === req.params.id)
  if (i === -1) return fail(res, 404, "Tipo de documento no encontrado")
  tiposDocumento.splice(i, 1)
  res.status(204).end()
})

// --- Plantillas --------------------------------------------------------------

administracionRouter.get("/plantillas", (req, res) => {
  const lista = plantillas
    .filter((p) => matchBusqueda(req.query.busqueda, p.nombre) && (!req.query.tipo || p.tipo === req.query.tipo))
    .map(({ contenido, ...resumen }) => resumen)
  ok(res, lista)
})

administracionRouter.get("/plantillas/:id", (req, res) => {
  const p = plantillas.find((x) => x.id === req.params.id)
  if (!p) return fail(res, 404, "Plantilla no encontrada")
  ok(res, p)
})

administracionRouter.post("/plantillas", (req, res) => {
  const b = req.body ?? {}
  if (!b.nombre) return fail(res, 400, "El nombre es obligatorio")
  const nueva: Plantilla = {
    id: nuevoId("pl-"), nombre: b.nombre, tipo: b.tipo, ultimaEdicion: hoy(), contenido: b.contenido ?? "",
  }
  plantillas.unshift(nueva)
  ok(res, nueva, 201)
})

administracionRouter.put("/plantillas/:id", (req, res) => {
  const p = plantillas.find((x) => x.id === req.params.id)
  if (!p) return fail(res, 404, "Plantilla no encontrada")
  p.nombre = req.body?.nombre ?? p.nombre
  p.contenido = req.body?.contenido ?? p.contenido
  p.ultimaEdicion = hoy()
  ok(res, p)
})

administracionRouter.delete("/plantillas/:id", (req, res) => {
  const i = plantillas.findIndex((x) => x.id === req.params.id)
  if (i === -1) return fail(res, 404, "Plantilla no encontrada")
  plantillas.splice(i, 1)
  res.status(204).end()
})

// --- Comisiones (montado en /comisiones) -------------------------------------

const sinAsesores = (e: EsquemaComisionDetalle) => {
  const { asesores, ...resto } = e
  return resto
}

comisionesRouter.get("/esquemas", (req, res) => {
  const { busqueda, tipo, estado } = req.query
  const { page, limit } = pageParams(req)
  const lista = esquemas.filter(
    (e) =>
      matchBusqueda(busqueda, e.nombre, e.condiciones) &&
      (!tipo || e.tipo === tipo) &&
      (!estado || e.estado === estado),
  )
  sendList(res, lista.map(sinAsesores), page, limit)
})

comisionesRouter.get("/esquemas/:id", (req, res) => {
  const e = esquemas.find((x) => x.id === req.params.id)
  if (!e) return fail(res, 404, "Esquema no encontrado")
  ok(res, e)
})

comisionesRouter.post("/esquemas", (req, res) => {
  const b = req.body ?? {}
  if (!b.nombre) return fail(res, 400, "El nombre es obligatorio")
  const nuevo: EsquemaComisionDetalle = {
    id: nuevoId("esq-"), nombre: b.nombre, tipo: b.tipo,
    porcentajeInmobiliaria: Number(b.porcentajeInmobiliaria) || 0,
    porcentajeAsesor: Number(b.porcentajeAsesor) || 0,
    condiciones: b.condiciones ?? "", estado: b.estado ?? "activo", asesores: [],
  }
  esquemas.unshift(nuevo)
  ok(res, sinAsesores(nuevo), 201)
})

comisionesRouter.patch("/esquemas/:id", (req, res) => {
  const e = esquemas.find((x) => x.id === req.params.id)
  if (!e) return fail(res, 404, "Esquema no encontrado")
  Object.assign(e, req.body ?? {}, { id: e.id, asesores: e.asesores })
  ok(res, sinAsesores(e))
})

comisionesRouter.delete("/esquemas/:id", (req, res) => {
  const i = esquemas.findIndex((x) => x.id === req.params.id)
  if (i === -1) return fail(res, 404, "Esquema no encontrado")
  esquemas.splice(i, 1)
  res.status(204).end()
})

comisionesRouter.post("/esquemas/:id/asesores", (req, res) => {
  const e = esquemas.find((x) => x.id === req.params.id)
  if (!e) return fail(res, 404, "Esquema no encontrado")
  const u = usuarios.find((x) => x.id === req.body?.usuarioId)
  if (!u) return fail(res, 400, "Usuario no válido")
  const asignado = { usuarioId: u.id, nombre: u.nombre, correo: u.correo, fechaAsignacion: hoy() }
  if (!e.asesores.some((a) => a.usuarioId === u.id)) e.asesores.push(asignado)
  ok(res, asignado, 201)
})

comisionesRouter.delete("/esquemas/:id/asesores/:usuarioId", (req, res) => {
  const e = esquemas.find((x) => x.id === req.params.id)
  if (!e) return fail(res, 404, "Esquema no encontrado")
  e.asesores = e.asesores.filter((a) => a.usuarioId !== req.params.usuarioId)
  res.status(204).end()
})
