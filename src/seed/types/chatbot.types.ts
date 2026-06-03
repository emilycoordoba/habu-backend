export type EstadoSolicitud = "nueva" | "en_gestion" | "atendida"

export type TipoSolicitud = "visita" | "contacto" | "asesor"

export interface MensajeChatHistorial {
  tipo: "bot" | "usuario"
  texto: string
  timestamp: string
}

export interface SolicitudChatbot {
  id: string
  tipo: TipoSolicitud
  estado: EstadoSolicitud
  fecha: string
  nombre: string
  telefono: string
  correo: string
  inmuebleInteres: string | null
  mensaje: string | null
  fechaVisita: string | null
  horaVisita: string | null
  asesorAsignado: string | null
  historial: MensajeChatHistorial[]
}
