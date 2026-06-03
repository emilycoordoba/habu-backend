import { Router } from "express"
import { CREDENCIALES, firmarToken } from "../lib/auth"
import { fail } from "../lib/http"

export const authRouter = Router()

/** POST /auth/login → { token, usuario }  (sin envoltura data) */
authRouter.post("/login", (req, res) => {
  const { correo, password } = req.body ?? {}
  if (!correo || !password) return fail(res, 400, "Correo y contraseña son obligatorios")

  const cred = CREDENCIALES[String(correo).trim().toLowerCase()]
  if (!cred || cred.password !== password) {
    return fail(res, 401, "Credenciales inválidas")
  }
  res.json({ token: firmarToken(cred.usuario), usuario: cred.usuario })
})

/** POST /auth/recuperar — siempre responde 200 para no revelar qué correos existen. */
authRouter.post("/recuperar", (_req, res) => {
  res.json({ data: { mensaje: "Si el correo existe, enviamos un enlace de recuperación." } })
})

/** POST /auth/restablecer */
authRouter.post("/restablecer", (req, res) => {
  const { token, nuevaPassword } = req.body ?? {}
  if (!token || !nuevaPassword) return fail(res, 400, "Token y nueva contraseña son obligatorios")
  res.json({ data: { mensaje: "Contraseña actualizada." } })
})
