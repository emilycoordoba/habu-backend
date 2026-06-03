import jwt from "jsonwebtoken"
import type { Request, Response, NextFunction } from "express"

const SECRET = process.env.JWT_SECRET ?? "habu-dev-secret-2026"

export interface SesionUsuario {
  id: string
  nombre: string
  correo: string
  rol: "administrador" | "asesor"
}

interface Credencial {
  password: string
  usuario: SesionUsuario
}

/**
 * Usuarios sembrados para que el profesor pueda iniciar sesión sin crear nada.
 * (En un sistema real esto vendría de la base de datos con contraseñas hasheadas.)
 */
export const CREDENCIALES: Record<string, Credencial> = {
  "admin@habu.com.co": {
    password: "admin123",
    usuario: { id: "u1", nombre: "Emily Perea", correo: "admin@habu.com.co", rol: "administrador" },
  },
  "asesor@habu.com.co": {
    password: "asesor123",
    usuario: { id: "u2", nombre: "Ana Rodríguez", correo: "asesor@habu.com.co", rol: "asesor" },
  },
}

export function firmarToken(usuario: SesionUsuario): string {
  return jwt.sign(usuario, SECRET, { expiresIn: "12h" })
}

/** Middleware: exige un Bearer token válido y adjunta req.usuario. */
export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  const header = req.headers.authorization
  if (!header || !header.startsWith("Bearer ")) {
    res.status(401).json({ error: { mensaje: "No autenticado" } })
    return
  }
  try {
    const payload = jwt.verify(header.slice(7), SECRET) as SesionUsuario
    ;(req as Request & { usuario?: SesionUsuario }).usuario = payload
    next()
  } catch {
    res.status(401).json({ error: { mensaje: "Sesión expirada" } })
  }
}
