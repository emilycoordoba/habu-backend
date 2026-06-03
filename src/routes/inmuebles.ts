import { Router } from "express"
import { ok, fail, sendList, pageParams, matchBusqueda, nuevoId } from "../lib/http"
import { upload, urlSimulada } from "../lib/upload"
import { inmuebles } from "../store"
import type { EstadoInmueble, InmuebleResumen, FotoInmueble, CambioHistorial } from "../seed/types/inmueble.types"

export const inmueblesRouter = Router()

const ESTADOS: EstadoInmueble[] = ["disponible", "arrendado", "en_proceso_venta", "vendido", "en_mantenimiento"]

function aResumen(i: (typeof inmuebles)[number]): InmuebleResumen {
  return {
    id: i.id, tipo: i.tipo, modalidad: i.modalidad, estado: i.estado, publicado: i.publicado,
    direccion: i.direccion, ubicacion: i.ubicacion, area: i.area, precio: i.precio,
    propietario: i.propietario, propietarioId: i.propietarioId, fechaRegistro: i.fechaRegistro,
    fotoPrincipal: i.fotos[0]?.url,
  }
}

/** GET /inmuebles */
inmueblesRouter.get("/", (req, res) => {
  const { busqueda, tipo, modalidad, estado, disponibles, propietarioId } = req.query
  const { page, limit } = pageParams(req)
  const lista = inmuebles.filter(
    (i) =>
      matchBusqueda(busqueda, i.direccion, i.ubicacion, i.propietario) &&
      (!tipo || i.tipo === tipo) &&
      (!modalidad || i.modalidad === modalidad) &&
      (!estado || i.estado === estado) &&
      (!propietarioId || i.propietarioId === propietarioId) &&
      (disponibles !== "true" || i.estado === "disponible"),
  )
  const resumenEstados = Object.fromEntries(
    ESTADOS.map((e) => [e, inmuebles.filter((i) => i.estado === e).length]),
  ) as Record<EstadoInmueble, number>
  sendList(res, lista.map(aResumen), page, limit, { resumenEstados })
})

/** GET /inmuebles/:id */
inmueblesRouter.get("/:id", (req, res) => {
  const i = inmuebles.find((x) => x.id === req.params.id)
  if (!i) return fail(res, 404, "Inmueble no encontrado")
  ok(res, i)
})

/** POST /inmuebles */
inmueblesRouter.post("/", (req, res) => {
  const b = req.body ?? {}
  if (!b.direccion) return fail(res, 400, "La dirección es obligatoria")
  const nuevo = {
    id: nuevoId("inm-"),
    tipo: b.tipo, modalidad: b.modalidad, estado: "disponible" as EstadoInmueble,
    publicado: Boolean(b.publicado), direccion: b.direccion, ubicacion: b.ubicacion ?? "",
    area: Number(b.area) || 0, precio: Number(b.precio) || 0,
    propietario: b.propietario ?? "—", propietarioId: b.propietarioId ?? "",
    fechaRegistro: new Date().toISOString().slice(0, 10),
    coordenadas: (b.coordenadas ?? [4.711, -74.0721]) as [number, number],
    fotos: [] as FotoInmueble[],
    historial: [{ id: nuevoId("h-"), fecha: new Date().toISOString().slice(0, 10), campo: "—", valorAnterior: "—", valorNuevo: "Inmueble registrado", usuario: "Emily Perea" }] as CambioHistorial[],
  }
  inmuebles.unshift(nuevo)
  ok(res, aResumen(nuevo), 201)
})

/** PUT /inmuebles/:id */
inmueblesRouter.put("/:id", (req, res) => {
  const i = inmuebles.find((x) => x.id === req.params.id)
  if (!i) return fail(res, 404, "Inmueble no encontrado")
  Object.assign(i, req.body ?? {}, { id: i.id, fotos: i.fotos, historial: i.historial })
  ok(res, aResumen(i))
})

/** PATCH /inmuebles/:id/estado */
inmueblesRouter.patch("/:id/estado", (req, res) => {
  const i = inmuebles.find((x) => x.id === req.params.id)
  if (!i) return fail(res, 404, "Inmueble no encontrado")
  const anterior = i.estado
  i.estado = req.body?.estado
  i.historial.unshift({
    id: nuevoId("h-"), fecha: new Date().toISOString().slice(0, 10),
    campo: "estado", valorAnterior: anterior, valorNuevo: i.estado, usuario: "Emily Perea",
  })
  ok(res, { id: i.id, estado: i.estado })
})

/** GET /inmuebles/:id/fotos */
inmueblesRouter.get("/:id/fotos", (req, res) => {
  const i = inmuebles.find((x) => x.id === req.params.id)
  if (!i) return fail(res, 404, "Inmueble no encontrado")
  ok(res, i.fotos)
})

/** POST /inmuebles/:id/fotos (multipart) */
inmueblesRouter.post("/:id/fotos", upload.single("archivo"), (req, res) => {
  const i = inmuebles.find((x) => x.id === req.params.id)
  if (!i) return fail(res, 404, "Inmueble no encontrado")
  const foto: FotoInmueble = {
    id: nuevoId("f-"),
    url: urlSimulada(req.file?.originalname ?? "foto"),
    descripcion: req.body?.descripcion,
  }
  i.fotos.push(foto)
  ok(res, foto, 201)
})

/** DELETE /inmuebles/:id/fotos/:fotoId */
inmueblesRouter.delete("/:id/fotos/:fotoId", (req, res) => {
  const i = inmuebles.find((x) => x.id === req.params.id)
  if (!i) return fail(res, 404, "Inmueble no encontrado")
  i.fotos = i.fotos.filter((f) => f.id !== req.params.fotoId)
  res.status(204).end()
})

/** GET /inmuebles/:id/historial */
inmueblesRouter.get("/:id/historial", (req, res) => {
  const i = inmuebles.find((x) => x.id === req.params.id)
  if (!i) return fail(res, 404, "Inmueble no encontrado")
  const { page, limit } = pageParams(req)
  sendList(res, i.historial, page, limit)
})
