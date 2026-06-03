import type { PrioridadMantenimiento, EstadoMantenimiento } from "@/types/mantenimiento.types"

export interface HistorialEstado {
  id: string
  estado: EstadoMantenimiento
  fecha: string
  nota?: string
  usuario: string
}

export interface EvidenciaMantenimiento {
  id: string
  nombre: string
  url: string
  fechaCarga: string
}

export interface SolicitudMantenimiento {
  id: string
  inmuebleId: string
  inmuebleDireccion: string
  inmuebleUbicacion: string
  descripcion: string
  prioridad: PrioridadMantenimiento
  estado: EstadoMantenimiento
  proveedorId?: string
  proveedorNombre?: string
  proveedorEspecialidad?: string
  costo?: number
  fechaRegistro: string
  registradoPor: string
  historial: HistorialEstado[]
  evidencias: EvidenciaMantenimiento[]
}

export const MANTENIMIENTO_MOCK: Record<string, SolicitudMantenimiento> = {
  "1": {
    id: "1",
    inmuebleId: "6",
    inmuebleDireccion: "Cll 50 #10-15, Local 2",
    inmuebleUbicacion: "Cali — Granada",
    descripcion: "Fuga de agua en baño principal. El piso está anegado y hay humedad en la pared.",
    prioridad: "alta",
    estado: "en_proceso",
    proveedorId: "p1",
    proveedorNombre: "Fontanería Rápida S.A.S.",
    proveedorEspecialidad: "Plomería",
    fechaRegistro: "2025-05-10",
    registradoPor: "Laura Gómez",
    historial: [
      { id: "h1", estado: "pendiente",  fecha: "2025-05-10", usuario: "Laura Gómez", nota: "Solicitud registrada por reporte del arrendatario." },
      { id: "h2", estado: "en_proceso", fecha: "2025-05-11", usuario: "Carlos Ríos", nota: "Proveedor asignado. Visita programada para el 12 de mayo." },
    ],
    evidencias: [
      { id: "e1", nombre: "foto-fuga-01.jpg", url: "https://placehold.co/800x600/e0f2fe/0ea5e9?text=Evidencia+1", fechaCarga: "2025-05-10" },
      { id: "e2", nombre: "foto-humedad.jpg", url: "https://placehold.co/800x600/e0f2fe/0ea5e9?text=Evidencia+2", fechaCarga: "2025-05-10" },
    ],
  },
  "2": {
    id: "2",
    inmuebleId: "1",
    inmuebleDireccion: "Cra 15 #93-47, Apto 301 Torre A",
    inmuebleUbicacion: "Bogotá — Chapinero",
    descripcion: "Puerta del closet principal no cierra correctamente. Bisagra rota.",
    prioridad: "baja",
    estado: "pendiente",
    fechaRegistro: "2025-05-12",
    registradoPor: "Carlos Ríos",
    historial: [
      { id: "h1", estado: "pendiente", fecha: "2025-05-12", usuario: "Carlos Ríos", nota: "Solicitud registrada." },
    ],
    evidencias: [],
  },
  "3": {
    id: "3",
    inmuebleId: "2",
    inmuebleDireccion: "CC Plaza, Local 3",
    inmuebleUbicacion: "Medellín — El Poblado",
    descripcion: "Aire acondicionado no enfría. Revisión y recarga de gas requerida.",
    prioridad: "media",
    estado: "pendiente",
    fechaRegistro: "2025-05-13",
    registradoPor: "Laura Gómez",
    historial: [
      { id: "h1", estado: "pendiente", fecha: "2025-05-13", usuario: "Laura Gómez", nota: "Solicitud registrada por propietario." },
    ],
    evidencias: [
      { id: "e1", nombre: "foto-ac.jpg", url: "https://placehold.co/800x600/f0fdf4/22c55e?text=Evidencia+1", fechaCarga: "2025-05-13" },
    ],
  },
  "4": {
    id: "4",
    inmuebleId: "4",
    inmuebleDireccion: "Cra 7 #120-30",
    inmuebleUbicacion: "Bogotá — Usaquén",
    descripcion: "Daño en tablero eléctrico. Breaker de cocina se dispara constantemente.",
    prioridad: "alta",
    estado: "en_proceso",
    proveedorId: "p2",
    proveedorNombre: "Eléctricos del Norte",
    proveedorEspecialidad: "Electricidad",
    fechaRegistro: "2025-05-08",
    registradoPor: "Carlos Ríos",
    historial: [
      { id: "h1", estado: "pendiente",  fecha: "2025-05-08", usuario: "Carlos Ríos" },
      { id: "h2", estado: "en_proceso", fecha: "2025-05-09", usuario: "Carlos Ríos", nota: "Técnico eléctrico asignado. Revisará el tablero completo." },
    ],
    evidencias: [
      { id: "e1", nombre: "foto-tablero.jpg", url: "https://placehold.co/800x600/fef9c3/ca8a04?text=Evidencia+1", fechaCarga: "2025-05-08" },
    ],
  },
  "5": {
    id: "5",
    inmuebleId: "5",
    inmuebleDireccion: "Av. Suba #91-20, Apto 204",
    inmuebleUbicacion: "Bogotá — Suba",
    descripcion: "Pintura deteriorada en sala y comedor. Manchas de humedad en techo.",
    prioridad: "baja",
    estado: "finalizado",
    proveedorId: "p3",
    proveedorNombre: "Pinturas & Acabados Ortiz",
    proveedorEspecialidad: "Pintura y acabados",
    costo: 850000,
    fechaRegistro: "2025-04-20",
    registradoPor: "Laura Gómez",
    historial: [
      { id: "h1", estado: "pendiente",  fecha: "2025-04-20", usuario: "Laura Gómez" },
      { id: "h2", estado: "en_proceso", fecha: "2025-04-22", usuario: "Carlos Ríos", nota: "Proveedor asignado. Iniciará trabajos el 24 de abril." },
      { id: "h3", estado: "finalizado", fecha: "2025-04-28", usuario: "Carlos Ríos", nota: "Trabajo finalizado. Se pintaron sala, comedor y techo. Costo: $850.000." },
    ],
    evidencias: [
      { id: "e1", nombre: "antes-pintura.jpg",  url: "https://placehold.co/800x600/fce7f3/db2777?text=Antes", fechaCarga: "2025-04-20" },
      { id: "e2", nombre: "despues-pintura.jpg", url: "https://placehold.co/800x600/f0fdf4/16a34a?text=Después", fechaCarga: "2025-04-28" },
    ],
  },
  "6": {
    id: "6",
    inmuebleId: "7",
    inmuebleDireccion: "Cra 45 #60-10",
    inmuebleUbicacion: "Medellín — Laureles",
    descripcion: "Grieta en pared exterior del garaje. Requiere inspección estructural.",
    prioridad: "alta",
    estado: "pendiente",
    fechaRegistro: "2025-05-14",
    registradoPor: "Carlos Ríos",
    historial: [
      { id: "h1", estado: "pendiente", fecha: "2025-05-14", usuario: "Carlos Ríos", nota: "Solicitud urgente. Propietario reportó grieta que creció en el último mes." },
    ],
    evidencias: [
      { id: "e1", nombre: "grieta-01.jpg", url: "https://placehold.co/800x600/fee2e2/dc2626?text=Grieta", fechaCarga: "2025-05-14" },
    ],
  },
  "7": {
    id: "7",
    inmuebleId: "3",
    inmuebleDireccion: "Cll 80 #45-12, Apto 502",
    inmuebleUbicacion: "Bogotá — Barrios Unidos",
    descripcion: "Ventana de habitación no cierra bien. Deja pasar lluvia.",
    prioridad: "media",
    estado: "cancelado",
    fechaRegistro: "2025-04-15",
    registradoPor: "Laura Gómez",
    historial: [
      { id: "h1", estado: "pendiente", fecha: "2025-04-15", usuario: "Laura Gómez" },
      { id: "h2", estado: "cancelado", fecha: "2025-04-17", usuario: "Laura Gómez", nota: "Cancelado. Propietario realizó la reparación directamente." },
    ],
    evidencias: [],
  },
}

export const MANTENIMIENTO_LIST = Object.values(MANTENIMIENTO_MOCK)

export interface ProveedorOpcion {
  id: string
  nombre: string
  especialidad: string
  telefono: string
  correo: string
  calificacion: number | null
}

export const PROVEEDORES_OPCIONES: ProveedorOpcion[] = [
  { id: "p1", nombre: "Fontanería Rápida S.A.S.",    especialidad: "Plomería",            telefono: "300 111 2233", correo: "contacto@fontaneria.co",  calificacion: 4.5 },
  { id: "p2", nombre: "Eléctricos del Norte",         especialidad: "Electricidad",         telefono: "315 444 5566", correo: "info@electricosnorte.co", calificacion: 4.8 },
  { id: "p3", nombre: "Pinturas & Acabados Ortiz",    especialidad: "Pintura y acabados",   telefono: "320 777 8899", correo: "ortiz.pinturas@gmail.com", calificacion: 4.2 },
  { id: "p4", nombre: "Cerrajería 24/7",              especialidad: "Cerrajería",           telefono: "310 222 3344", correo: "cerrajeria247@gmail.com",  calificacion: 4.0 },
  { id: "p5", nombre: "Climatización Total",          especialidad: "Aire acondicionado",   telefono: "312 555 6677", correo: "ventas@climatotal.co",     calificacion: 4.7 },
  { id: "p6", nombre: "Constructora Reparaciones",    especialidad: "Obra civil",           telefono: "318 888 9900", correo: "reparaciones@constructora.co", calificacion: 3.9 },
]

export const INMUEBLES_OPCIONES = [
  { id: "1", direccion: "Cra 15 #93-47, Apto 301 Torre A", ubicacion: "Bogotá — Chapinero" },
  { id: "2", direccion: "CC Plaza, Local 3",                ubicacion: "Medellín — El Poblado" },
  { id: "3", direccion: "Cll 80 #45-12, Apto 502",         ubicacion: "Bogotá — Barrios Unidos" },
  { id: "4", direccion: "Cra 7 #120-30",                   ubicacion: "Bogotá — Usaquén" },
  { id: "5", direccion: "Av. Suba #91-20, Apto 204",       ubicacion: "Bogotá — Suba" },
  { id: "6", direccion: "Cll 50 #10-15, Local 2",          ubicacion: "Cali — Granada" },
  { id: "7", direccion: "Cra 45 #60-10",                   ubicacion: "Medellín — Laureles" },
]
