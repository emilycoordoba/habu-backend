import express, { type ErrorRequestHandler } from "express"
import cors from "cors"

import { requireAuth } from "./lib/auth"
import { authRouter } from "./routes/auth"
import { clientesRouter } from "./routes/clientes"
import { inmueblesRouter } from "./routes/inmuebles"
import { contratosRouter } from "./routes/contratos"
import { cobrosRouter, reportesRouter } from "./routes/pagos"
import { mantenimientoRouter } from "./routes/mantenimiento"
import { chatbotRouter } from "./routes/chatbot"
import { administracionRouter, comisionesRouter } from "./routes/administracion"
import { cuentaRouter } from "./routes/cuenta"

const app = express()

// CORS abierto: el frontend (Vercel u otro origen) y el profesor pueden consumir
// la API desde cualquier dominio. El JWT viaja en el header Authorization, no en
// cookies, así que no necesitamos credentials.
app.use(cors())
app.use(express.json({ limit: "5mb" }))

// Salud / portada — útil para que el profesor confirme que la API está viva.
app.get(["/", "/health"], (_req, res) => {
  res.json({
    api: "Sistema de Gestión Inmobiliaria — Backend (Habu)",
    estado: "ok",
    documentacion: "Implementa el contrato de endpoints del frontend.",
    usuariosDePrueba: [
      { rol: "administrador", correo: "admin@habu.com.co", password: "admin123" },
      { rol: "asesor", correo: "asesor@habu.com.co", password: "asesor123" },
    ],
  })
})

// --- Rutas públicas ----------------------------------------------------------
app.use("/auth", authRouter)
app.use("/chatbot", chatbotRouter) // POST /chatbot/solicitudes es público (formulario del bot)

// --- Rutas protegidas (requieren JWT) ----------------------------------------
app.use(requireAuth)
app.use("/clientes", clientesRouter)
app.use("/inmuebles", inmueblesRouter)
app.use("/contratos", contratosRouter)
app.use("/cobros", cobrosRouter)
app.use("/reportes", reportesRouter)
app.use("/mantenimiento", mantenimientoRouter)
app.use("/administracion", administracionRouter)
app.use("/comisiones", comisionesRouter)
app.use("/usuarios", cuentaRouter)

// 404 con la envoltura de error que espera el frontend.
app.use((_req, res) => {
  res.status(404).json({ error: { mensaje: "Recurso no encontrado" } })
})

// Manejador global de errores (incluye errores de multer).
const onError: ErrorRequestHandler = (err, _req, res, _next) => {
  console.error("[error]", err)
  const status = typeof err?.status === "number" ? err.status : 500
  res.status(status).json({ error: { mensaje: err?.message ?? "Error interno del servidor" } })
}
app.use(onError)

const PORT = Number(process.env.PORT) || 4000
app.listen(PORT, () => {
  console.log(`✅ Backend Habu escuchando en http://localhost:${PORT}`)
})
