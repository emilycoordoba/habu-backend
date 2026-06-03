# Guía de despliegue (para que el profesor pueda probarlo)

Objetivo: **backend en Render** + **frontend en Vercel**, ambos públicos.
Los pasos marcados con 🔑 requieren **tu login** (no se pueden automatizar).
Todo lo demás (código, repos, push) ya está hecho o lo hace Claude por ti tras el login.

---

## Paso 1 — Subir el backend a GitHub  🔑 login de GitHub

En la terminal de Claude Code, escribe esto (el `!` lo ejecuta en tu sesión):

```
! gh auth login
```

Elige: **GitHub.com → HTTPS → autenticar en el navegador**. Cuando termines, avísale a
Claude: él crea el repositorio y sube el backend con:

```bash
gh repo create sistema-gestion-inmobiliaria-backend --public --source=. --push
```

---

## Paso 2 — Desplegar en Render  🔑 cuenta de Render

1. Entra a https://dashboard.render.com → **New +** → **Web Service**.
2. Conecta tu GitHub y elige el repo `sistema-gestion-inmobiliaria-backend`.
3. Render detecta `render.yaml`. Si te pide los datos manualmente:
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free
4. **Create Web Service**. Espera a que el log diga `Backend Habu escuchando`.
5. Copia la URL pública, ej: `https://habu-backend-xxxx.onrender.com`.
6. Pruébala: abre `<esa-url>/health` → debe responder `estado: ok`.

> Nota: en el plan Free, Render "duerme" el servicio tras ~15 min de inactividad.
> La primera petición tras dormir tarda ~30–50 s en responder. Para la presentación,
> abre `/health` un minuto antes para "despertarlo".

---

## Paso 3 — Desplegar el frontend en Vercel  🔑 cuenta de Vercel

1. Entra a https://vercel.com → **Add New… → Project** → importa el repo
   `sistema-gestion-inmobiliaria-frontend`.
2. En **Environment Variables**, añade:
   - **Name**: `NEXT_PUBLIC_API_URL`
   - **Value**: la URL de Render del Paso 2 (sin barra final, **sin** `/api`).
     Ej: `https://habu-backend-xxxx.onrender.com`
3. **Deploy**. Copia la URL pública del frontend, ej: `https://....vercel.app`.

---

## Paso 4 — Probar como el profesor

1. Abre la URL del frontend (Vercel).
2. Inicia sesión:
   - `admin@habu.com.co` / `admin123` (ve todos los módulos, incl. Administración)
   - `asesor@habu.com.co` / `asesor123` (vista de asesor)
3. Navega: Clientes, Inmuebles, Contratos, Pagos, Mantenimiento, Chatbot.

---

## Resumen de URLs (rellénalas al desplegar)

- Backend (Render): `____________________`
- Frontend (Vercel): `____________________`
- Repo backend: `https://github.com/emilycodesoft/sistema-gestion-inmobiliaria-backend`
