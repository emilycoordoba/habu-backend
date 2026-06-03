export type PrioridadMantenimiento = "baja" | "media" | "alta"
export type EstadoMantenimiento = "pendiente" | "en_proceso" | "finalizado" | "cancelado"

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

export interface ProveedorOpcion {
  id: string
  nombre: string
  especialidad: string
  telefono: string
  correo?: string
  calificacion?: number
}
