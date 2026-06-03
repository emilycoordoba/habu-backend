import type { Request, Response, NextFunction, RequestHandler } from "express"

/** Respuesta de recurso único: { data: T } */
export function ok<T>(res: Response, data: T, status = 200): Response {
  return res.status(status).json({ data })
}

/**
 * Respuesta paginada: { data, total, pagina, totalPaginas, ...extra }.
 * `extra` permite añadir resumenEstados / resumen que algunos listados exigen.
 */
export function sendList<T>(
  res: Response,
  items: T[],
  page: number,
  limit: number,
  extra: Record<string, unknown> = {},
): Response {
  const total = items.length
  const totalPaginas = Math.max(1, Math.ceil(total / limit))
  const start = (page - 1) * limit
  const data = items.slice(start, start + limit)
  return res.json({ data, total, pagina: page, totalPaginas, ...extra })
}

/** Error con el shape que el interceptor del frontend espera: { error: { mensaje } } */
export function fail(res: Response, status: number, mensaje: string, codigo?: string): Response {
  return res.status(status).json({ error: { mensaje, codigo } })
}

/** Lee page/limit de la query con los defaults del frontend (limit 200). */
export function pageParams(req: Request): { page: number; limit: number } {
  const page = Math.max(1, parseInt(String(req.query.page ?? "1"), 10) || 1)
  const limit = Math.max(1, parseInt(String(req.query.limit ?? "200"), 10) || 200)
  return { page, limit }
}

/** Filtro de texto genérico, sin acentos ni mayúsculas. */
export function matchBusqueda(busqueda: unknown, ...campos: (string | undefined)[]): boolean {
  const q = String(busqueda ?? "").trim().toLowerCase()
  if (!q) return true
  return campos.some((c) => (c ?? "").toLowerCase().includes(q))
}

/** Envuelve handlers async para que los errores caigan en el manejador global. */
export function wrap(fn: RequestHandler): RequestHandler {
  return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)
}

/** Genera ids legibles y únicos para entidades creadas en runtime. */
let contador = 1000
export function nuevoId(prefijo = ""): string {
  contador += 1
  return `${prefijo}${contador}`
}

export type { Request, Response, NextFunction }
