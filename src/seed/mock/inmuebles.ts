import type { TipoInmueble, ModalidadInmueble, EstadoInmueble } from "@/types/inmueble.types"

export interface FotoInmueble {
  id: string
  url: string
  descripcion?: string
}

export interface CambioHistorial {
  id: string
  fecha: string
  campo: string
  valorAnterior: string
  valorNuevo: string
  usuario: string
}

export interface InmuebleDetalle {
  id: string
  tipo: TipoInmueble
  modalidad: ModalidadInmueble
  estado: EstadoInmueble
  publicado: boolean
  direccion: string
  ubicacion: string
  area: number
  precio: number
  propietario: string
  propietarioId: string
  fechaRegistro: string
  coordenadas: [number, number]
  fotos: FotoInmueble[]
  historial: CambioHistorial[]
}

export const INMUEBLES_MOCK: Record<string, InmuebleDetalle> = {
  "1": {
    id: "1", tipo: "apartamento", modalidad: "arriendo", estado: "arrendado",
    publicado: true, direccion: "Cra 15 #93-47, Apto 301 Torre A",
    ubicacion: "Bogotá — Chapinero", area: 68, precio: 2800000,
    propietario: "Ana Lucía Martínez Ruiz", propietarioId: "1",
    fechaRegistro: "2025-01-15", coordenadas: [4.6451, -74.0631],
    fotos: [
      { id: "f1", url: "https://placehold.co/800x600/e2e8f0/94a3b8?text=Sala", descripcion: "Sala principal" },
      { id: "f2", url: "https://placehold.co/800x600/e2e8f0/94a3b8?text=Cocina", descripcion: "Cocina" },
      { id: "f3", url: "https://placehold.co/800x600/e2e8f0/94a3b8?text=Habitación+1", descripcion: "Habitación 1" },
      { id: "f4", url: "https://placehold.co/800x600/e2e8f0/94a3b8?text=Habitación+2", descripcion: "Habitación 2" },
      { id: "f5", url: "https://placehold.co/800x600/e2e8f0/94a3b8?text=Baño", descripcion: "Baño principal" },
      { id: "f6", url: "https://placehold.co/800x600/e2e8f0/94a3b8?text=Balcón", descripcion: "Balcón" },
    ],
    historial: [
      { id: "h1", fecha: "2025-04-10", campo: "estado", valorAnterior: "disponible", valorNuevo: "arrendado", usuario: "Emily Perea" },
      { id: "h2", fecha: "2025-02-20", campo: "precio", valorAnterior: "$2.600.000", valorNuevo: "$2.800.000", usuario: "Emily Perea" },
      { id: "h3", fecha: "2025-01-15", campo: "—", valorAnterior: "—", valorNuevo: "Inmueble registrado", usuario: "Emily Perea" },
    ],
  },
  "2": {
    id: "2", tipo: "local", modalidad: "arriendo", estado: "arrendado",
    publicado: true, direccion: "CC Plaza, Local 3",
    ubicacion: "Medellín — El Poblado", area: 120, precio: 4800000,
    propietario: "Inversiones Pedraza S.A.S.", propietarioId: "2",
    fechaRegistro: "2025-01-20", coordenadas: [6.2087, -75.5636],
    fotos: [
      { id: "f1", url: "https://placehold.co/800x600/e2e8f0/94a3b8?text=Fachada", descripcion: "Fachada" },
      { id: "f2", url: "https://placehold.co/800x600/e2e8f0/94a3b8?text=Interior", descripcion: "Interior" },
      { id: "f3", url: "https://placehold.co/800x600/e2e8f0/94a3b8?text=Bodega", descripcion: "Bodega" },
      { id: "f4", url: "https://placehold.co/800x600/e2e8f0/94a3b8?text=Baño", descripcion: "Baño" },
    ],
    historial: [
      { id: "h1", fecha: "2025-03-01", campo: "estado", valorAnterior: "disponible", valorNuevo: "arrendado", usuario: "Ana Rodríguez" },
      { id: "h2", fecha: "2025-01-20", campo: "—", valorAnterior: "—", valorNuevo: "Inmueble registrado", usuario: "Emily Perea" },
    ],
  },
  "3": {
    id: "3", tipo: "apartamento", modalidad: "venta", estado: "en_proceso_venta",
    publicado: true, direccion: "Cll 80 #45-12, Apto 502",
    ubicacion: "Bogotá — Barrios Unidos", area: 54, precio: 320000000,
    propietario: "Luis Hernando Gómez Vargas", propietarioId: "5",
    fechaRegistro: "2025-02-03", coordenadas: [4.6648, -74.0837],
    fotos: [
      { id: "f1", url: "https://placehold.co/800x600/e2e8f0/94a3b8?text=Sala+comedor", descripcion: "Sala comedor" },
      { id: "f2", url: "https://placehold.co/800x600/e2e8f0/94a3b8?text=Cocina", descripcion: "Cocina" },
      { id: "f3", url: "https://placehold.co/800x600/e2e8f0/94a3b8?text=Habitación", descripcion: "Habitación principal" },
      { id: "f4", url: "https://placehold.co/800x600/e2e8f0/94a3b8?text=Vista", descripcion: "Vista desde el balcón" },
      { id: "f5", url: "https://placehold.co/800x600/e2e8f0/94a3b8?text=Parqueadero", descripcion: "Parqueadero" },
      { id: "f6", url: "https://placehold.co/800x600/e2e8f0/94a3b8?text=Zona+comunal", descripcion: "Zona comunal" },
      { id: "f7", url: "https://placehold.co/800x600/e2e8f0/94a3b8?text=Terraza", descripcion: "Terraza" },
      { id: "f8", url: "https://placehold.co/800x600/e2e8f0/94a3b8?text=Fachada", descripcion: "Fachada edificio" },
    ],
    historial: [
      { id: "h1", fecha: "2025-03-15", campo: "estado", valorAnterior: "disponible", valorNuevo: "en_proceso_venta", usuario: "Emily Perea" },
      { id: "h2", fecha: "2025-03-15", campo: "publicado", valorAnterior: "Sí", valorNuevo: "No", usuario: "Sistema" },
      { id: "h3", fecha: "2025-02-03", campo: "—", valorAnterior: "—", valorNuevo: "Inmueble registrado", usuario: "Emily Perea" },
    ],
  },
  "4": {
    id: "4", tipo: "casa", modalidad: "ambos", estado: "disponible",
    publicado: true, direccion: "Cra 7 #120-30",
    ubicacion: "Bogotá — Usaquén", area: 180, precio: 5200000,
    propietario: "María Fernanda Ospina Castro", propietarioId: "4",
    fechaRegistro: "2025-03-10", coordenadas: [4.7095, -74.0419],
    fotos: [
      { id: "f1", url: "https://placehold.co/800x600/e2e8f0/94a3b8?text=Fachada", descripcion: "Fachada" },
      { id: "f2", url: "https://placehold.co/800x600/e2e8f0/94a3b8?text=Sala", descripcion: "Sala" },
      { id: "f3", url: "https://placehold.co/800x600/e2e8f0/94a3b8?text=Comedor", descripcion: "Comedor" },
      { id: "f4", url: "https://placehold.co/800x600/e2e8f0/94a3b8?text=Cocina", descripcion: "Cocina" },
      { id: "f5", url: "https://placehold.co/800x600/e2e8f0/94a3b8?text=Patio", descripcion: "Patio" },
      { id: "f6", url: "https://placehold.co/800x600/e2e8f0/94a3b8?text=Jardín", descripcion: "Jardín" },
      { id: "f7", url: "https://placehold.co/800x600/e2e8f0/94a3b8?text=Garaje", descripcion: "Garaje" },
      { id: "f8", url: "https://placehold.co/800x600/e2e8f0/94a3b8?text=Habitación+1", descripcion: "Habitación 1" },
      { id: "f9", url: "https://placehold.co/800x600/e2e8f0/94a3b8?text=Habitación+2", descripcion: "Habitación 2" },
      { id: "f10", url: "https://placehold.co/800x600/e2e8f0/94a3b8?text=Baño+principal", descripcion: "Baño principal" },
    ],
    historial: [
      { id: "h1", fecha: "2025-03-10", campo: "—", valorAnterior: "—", valorNuevo: "Inmueble registrado", usuario: "Emily Perea" },
    ],
  },
  "5": {
    id: "5", tipo: "apartamento", modalidad: "arriendo", estado: "disponible",
    publicado: false, direccion: "Av. Suba #91-20, Apto 204",
    ubicacion: "Bogotá — Suba", area: 52, precio: 1900000,
    propietario: "Carlos Reyes", propietarioId: "p-5",
    fechaRegistro: "2025-03-18", coordenadas: [4.7464, -74.0825],
    fotos: [],
    historial: [
      { id: "h1", fecha: "2025-03-18", campo: "—", valorAnterior: "—", valorNuevo: "Inmueble registrado", usuario: "Emily Perea" },
    ],
  },
  "6": {
    id: "6", tipo: "local", modalidad: "arriendo", estado: "en_mantenimiento",
    publicado: false, direccion: "Cll 50 #10-15, Local 2",
    ubicacion: "Cali — Granada", area: 90, precio: 3200000,
    propietario: "Fondos Inmobiliarios Cali S.A.", propietarioId: "9",
    fechaRegistro: "2025-04-01", coordenadas: [3.4516, -76.5319],
    fotos: [
      { id: "f1", url: "https://placehold.co/800x600/e2e8f0/94a3b8?text=Interior", descripcion: "Interior" },
      { id: "f2", url: "https://placehold.co/800x600/e2e8f0/94a3b8?text=Fachada", descripcion: "Fachada" },
      { id: "f3", url: "https://placehold.co/800x600/e2e8f0/94a3b8?text=Baño", descripcion: "Baño" },
    ],
    historial: [
      { id: "h1", fecha: "2025-04-05", campo: "estado", valorAnterior: "disponible", valorNuevo: "en_mantenimiento", usuario: "Emily Perea" },
      { id: "h2", fecha: "2025-04-01", campo: "—", valorAnterior: "—", valorNuevo: "Inmueble registrado", usuario: "Emily Perea" },
    ],
  },
  "7": {
    id: "7", tipo: "casa", modalidad: "venta", estado: "disponible",
    publicado: true, direccion: "Cra 45 #60-10",
    ubicacion: "Medellín — Laureles", area: 240, precio: 850000000,
    propietario: "Hernando Castro", propietarioId: "p-7",
    fechaRegistro: "2025-04-05", coordenadas: [6.2518, -75.5636],
    fotos: [
      { id: "f1", url: "https://placehold.co/800x600/e2e8f0/94a3b8?text=Fachada", descripcion: "Fachada" },
      { id: "f2", url: "https://placehold.co/800x600/e2e8f0/94a3b8?text=Sala", descripcion: "Sala" },
      { id: "f3", url: "https://placehold.co/800x600/e2e8f0/94a3b8?text=Comedor", descripcion: "Comedor" },
      { id: "f4", url: "https://placehold.co/800x600/e2e8f0/94a3b8?text=Cocina", descripcion: "Cocina" },
      { id: "f5", url: "https://placehold.co/800x600/e2e8f0/94a3b8?text=Piscina", descripcion: "Piscina" },
      { id: "f6", url: "https://placehold.co/800x600/e2e8f0/94a3b8?text=Jardín", descripcion: "Jardín" },
      { id: "f7", url: "https://placehold.co/800x600/e2e8f0/94a3b8?text=Habitación+principal", descripcion: "Habitación principal" },
      { id: "f8", url: "https://placehold.co/800x600/e2e8f0/94a3b8?text=Estudio", descripcion: "Estudio" },
      { id: "f9", url: "https://placehold.co/800x600/e2e8f0/94a3b8?text=Garaje", descripcion: "Garaje doble" },
      { id: "f10", url: "https://placehold.co/800x600/e2e8f0/94a3b8?text=Terraza", descripcion: "Terraza" },
      { id: "f11", url: "https://placehold.co/800x600/e2e8f0/94a3b8?text=Vista+exterior", descripcion: "Vista exterior" },
      { id: "f12", url: "https://placehold.co/800x600/e2e8f0/94a3b8?text=Baño+principal", descripcion: "Baño principal" },
    ],
    historial: [
      { id: "h1", fecha: "2025-04-05", campo: "—", valorAnterior: "—", valorNuevo: "Inmueble registrado", usuario: "Emily Perea" },
    ],
  },
}
