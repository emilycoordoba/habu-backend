# Backend — Sistema de Gestión Inmobiliaria (Habu)

API REST en **Node + Express + TypeScript** que implementa el contrato de endpoints
consumido por el frontend (Next.js). Datos **en memoria**, sembrados desde los mocks
del frontend, de modo que las formas de respuesta calzan al 100% con lo que la UI espera.

## Usuarios de prueba (para que el profesor inicie sesión)

| Rol           | Correo               | Contraseña |
|---------------|----------------------|------------|
| Administrador | `admin@habu.com.co`  | `admin123` |
| Asesor        | `asesor@habu.com.co` | `asesor123`|

## Correr en local

```bash
npm install
npm start        # http://localhost:4000
```

Verificación rápida: abrir `http://localhost:4000/health` → debe responder `estado: ok`.

## Arquitectura

- `src/index.ts` — servidor Express, CORS, rutas públicas vs protegidas, manejo de errores.
- `src/lib/` — `auth` (JWT + usuarios sembrados), `http` (envoltura `{data}`/`{error}`, paginación), `upload` (multipart).
- `src/store.ts` — **única fuente de datos en memoria**. Aislada a propósito: migrar a Postgres = reescribir solo este archivo.
- `src/routes/` — un archivo por módulo (clientes, inmuebles, contratos, pagos, mantenimiento, chatbot, administración, cuenta, auth).
- `src/seed/` — tipos y mocks copiados del frontend; son la semilla de datos.

## Contrato de respuesta

- Objeto único → `{ "data": { ... } }`
- Listado → `{ "data": [ ... ], "total", "pagina", "totalPaginas", ...resumen }`
- Error → `{ "error": { "mensaje": "..." } }`
- Login → `{ "token", "usuario" }` (sin envoltura)

## Despliegue

Ver [`DEPLOY.md`](./DEPLOY.md).

## Nota

Los datos viven en memoria: las creaciones/ediciones persisten mientras el proceso
esté vivo y se reinician al reiniciar el servicio. Para persistencia real, reemplazar
`src/store.ts` por una capa contra Postgres.
