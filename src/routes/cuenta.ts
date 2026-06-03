import { Router } from "express"
import { ok, fail } from "../lib/http"
import type { SesionUsuario } from "../lib/auth"

export const cuentaRouter = Router()

interface PerfilExtra {
  telefono?: string
  ciudad?: string
}
const perfilExtra: Record<string, PerfilExtra> = {}

const notificaciones: Record<string, Record<string, boolean>> = {}
const NOTIF_DEFAULT = {
  vencimientoContrato: true,
  cobroEnMora: true,
  nuevoContrato: false,
  pagoRegistrado: true,
}

function sesion(req: import("express").Request): SesionUsuario {
  return (req as import("express").Request & { usuario: SesionUsuario }).usuario
}

/** GET /usuarios/me */
cuentaRouter.get("/me", (req, res) => {
  const u = sesion(req)
  ok(res, { ...u, ...(perfilExtra[u.id] ?? {}) })
})

/** PATCH /usuarios/me */
cuentaRouter.patch("/me", (req, res) => {
  const u = sesion(req)
  const { nombre, correo, telefono, ciudad } = req.body ?? {}
  if (nombre) u.nombre = nombre
  if (correo) u.correo = correo
  perfilExtra[u.id] = { ...(perfilExtra[u.id] ?? {}), ...(telefono !== undefined ? { telefono } : {}), ...(ciudad !== undefined ? { ciudad } : {}) }
  ok(res, { ...u, ...(perfilExtra[u.id] ?? {}) })
})

/** PATCH /usuarios/me/password */
cuentaRouter.patch("/me/password", (req, res) => {
  const { actual, nueva } = req.body ?? {}
  if (!actual || !nueva) return fail(res, 400, "Debe indicar la contraseña actual y la nueva")
  res.json({ data: { mensaje: "Contraseña actualizada." } })
})

/** GET /usuarios/me/notificaciones */
cuentaRouter.get("/me/notificaciones", (req, res) => {
  const u = sesion(req)
  ok(res, notificaciones[u.id] ?? NOTIF_DEFAULT)
})

/** PATCH /usuarios/me/notificaciones */
cuentaRouter.patch("/me/notificaciones", (req, res) => {
  const u = sesion(req)
  notificaciones[u.id] = { ...(notificaciones[u.id] ?? NOTIF_DEFAULT), ...(req.body ?? {}) }
  ok(res, notificaciones[u.id])
})
