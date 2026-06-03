export interface UsuarioAsesor {
  id: string
  nombre: string
  email: string
}

export const ASESORES_MOCK: UsuarioAsesor[] = [
  { id: "u1", nombre: "Emily Perea",      email: "emily@habu.com.co" },
  { id: "u2", nombre: "Ana Rodríguez",    email: "ana.rodriguez@habu.com.co" },
  { id: "u3", nombre: "Luis Martínez",    email: "luis.martinez@habu.com.co" },
  { id: "u4", nombre: "Jorge Castaño",    email: "jorge.castano@habu.com.co" },
]
