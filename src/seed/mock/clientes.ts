import type { Cliente, TipoCliente } from "@/types/cliente.types"
import type { TipoContrato, EstadoContrato } from "@/types/contrato.types"

// ---------------------------------------------------------------------------
// Interacciones (historial)
// ---------------------------------------------------------------------------

export type TipoInteraccion = "visita" | "llamada" | "mensaje" | "nota"

export interface Interaccion {
  id: string
  tipo: TipoInteraccion
  fecha: string
  hora?: string
  descripcion: string
  asesor: string
  inmueble?: string
}

export const INTERACCIONES_MOCK: Record<string, Interaccion[]> = {
  "1": [
    { id: "i1", tipo: "llamada", fecha: "2025-03-14", hora: "10:20", descripcion: "Propietaria llamó para preguntar por el estado de la renovación. Se le explicó el proceso y se acordó enviarle propuesta por correo.", asesor: "Emily Perea" },
    { id: "i2", tipo: "mensaje", fecha: "2025-02-28", hora: "15:45", descripcion: "Envió mensaje por WhatsApp solicitando el certificado de paz y salvo del arrendatario. Se le indicó que se gestiona en máximo 3 días hábiles.", asesor: "Emily Perea" },
    { id: "i3", tipo: "nota", fecha: "2025-02-10", descripcion: "Propietaria solicitó revisar cláusula de renovación antes del vencimiento. Prefiere renovar a largo plazo.", asesor: "Emily Perea" },
    { id: "i4", tipo: "visita", fecha: "2024-09-05", hora: "11:00", descripcion: "Visita al inmueble Cra 15 #93-47 para revisión previa a la firma del contrato. Inmueble en buen estado.", asesor: "Emily Perea", inmueble: "Cra 15 #93-47, Apto 301 Torre A" },
  ],
  "2": [
    { id: "i1", tipo: "mensaje", fecha: "2025-03-22", hora: "09:10", descripcion: "Correo de gerencia solicitando resumen de contratos activos para informe trimestral. Se adjuntó reporte en PDF.", asesor: "Emily Perea" },
    { id: "i2", tipo: "llamada", fecha: "2025-02-05", hora: "16:30", descripcion: "Llamada con el representante legal para confirmar datos de facturación. Verificado NIT y correo de contabilidad.", asesor: "Emily Perea" },
    { id: "i3", tipo: "nota", fecha: "2025-01-15", descripcion: "Empresa solicita facturación mensual antes del día 5. Contacto de pagos: contabilidad@pedrazasas.com.", asesor: "Emily Perea" },
  ],
  "3": [
    { id: "i1", tipo: "llamada", fecha: "2025-01-10", hora: "14:00", descripcion: "Llamó para preguntar si hay posibilidad de renovar por un año más. Se consultará con el propietario y se da respuesta en 48h.", asesor: "Emily Perea" },
    { id: "i2", tipo: "nota", fecha: "2024-11-02", descripcion: "Llamó para confirmar disponibilidad del apto en Chapinero. Interesado en contrato desde noviembre.", asesor: "Emily Perea" },
    { id: "i3", tipo: "visita", fecha: "2024-10-18", hora: "10:30", descripcion: "Primera visita al apartamento Cra 15 #93-47. Cliente conforme con el espacio y la ubicación. Consultó por mascotas — se revisa con propietario.", asesor: "Emily Perea", inmueble: "Cra 15 #93-47, Apto 301 Torre A" },
  ],
  "4": [
    { id: "i1", tipo: "mensaje", fecha: "2025-04-10", hora: "08:55", descripcion: "Envió mensaje solicitando información sobre el proceso para arrendar su local en Cali. Se le envió el checklist de documentos requeridos.", asesor: "Emily Perea" },
    { id: "i2", tipo: "llamada", fecha: "2025-03-20", hora: "11:15", descripcion: "Llamó para preguntar por el estado de la escrituración del Apto 502. Se le informó que está en revisión notarial.", asesor: "Emily Perea" },
    { id: "i3", tipo: "nota", fecha: "2025-03-20", descripcion: "Propietaria también interesada en arrendar su casa en Usaquén. Solicita avalúo comercial.", asesor: "Emily Perea" },
  ],
  "6": [
    { id: "i1", tipo: "llamada", fecha: "2025-03-18", hora: "17:00", descripcion: "Llamó para preguntar si el inmueble en Usaquén sigue disponible. Se confirmó disponibilidad y se ofreció nueva visita.", asesor: "Emily Perea" },
    { id: "i2", tipo: "nota", fecha: "2025-03-10", descripcion: "Decidieron no avanzar por ahora. Posible interés en 2-3 meses. Anotar para seguimiento.", asesor: "Emily Perea" },
    { id: "i3", tipo: "visita", fecha: "2025-03-05", hora: "10:00", descripcion: "Segunda visita con pareja. Revisan closets y cocina con detenimiento. Solicitan tiempo para decidir.", asesor: "Emily Perea", inmueble: "Cra 7 #120-30, Usaquén" },
    { id: "i4", tipo: "visita", fecha: "2025-02-20", hora: "15:30", descripcion: "Primera visita. Interesada en arrendar. Buen recibimiento del inmueble. Regresa con pareja la próxima semana.", asesor: "Emily Perea", inmueble: "Cra 7 #120-30, Usaquén" },
  ],
  "10": [
    { id: "i1", tipo: "mensaje", fecha: "2025-04-15", hora: "12:30", descripcion: "Envió WhatsApp preguntando si hay apartamentos de 2 habitaciones disponibles en Medellín. Se le compartió listado actualizado.", asesor: "Emily Perea" },
    { id: "i2", tipo: "visita", fecha: "2025-04-05", hora: "09:00", descripcion: "Visita al apartamento Av. Suba #91-20. Cliente llega puntual, hace preguntas sobre parqueadero y zonas comunes.", asesor: "Emily Perea", inmueble: "Av. Suba #91-20, Apto 204" },
    { id: "i3", tipo: "llamada", fecha: "2025-03-28", hora: "16:45", descripcion: "Primer contacto. Prospecto interesado en arrendar en Medellín. Se agendó visita para el 5 de abril.", asesor: "Emily Perea" },
  ],
}

// ---------------------------------------------------------------------------
// Contratos por cliente
// ---------------------------------------------------------------------------

export interface ContratoResumen {
  id: string
  referencia: string
  tipo: TipoContrato
  estado: EstadoContrato
  inmueble: string
  direccion: string
  rol: TipoCliente
}

export const CONTRATOS_POR_CLIENTE: Record<string, ContratoResumen[]> = {
  "1": [
    { id: "1", referencia: "CTR-2025-001", tipo: "arriendo", estado: "activo", inmueble: "Apto 301 Torre A", direccion: "Cra 15 #93-47, Bogotá", rol: "propietario" },
  ],
  "2": [
    { id: "2", referencia: "CTR-2025-002", tipo: "arriendo", estado: "activo", inmueble: "CC Plaza, Local 3", direccion: "Medellín — El Poblado", rol: "propietario" },
  ],
  "3": [
    { id: "1", referencia: "CTR-2025-001", tipo: "arriendo", estado: "activo", inmueble: "Apto 301 Torre A", direccion: "Cra 15 #93-47, Bogotá", rol: "arrendatario" },
  ],
  "4": [
    { id: "3", referencia: "CTR-2025-003", tipo: "promesa_compraventa", estado: "en_escrituracion", inmueble: "Apto 502", direccion: "Cll 80 #45-12, Bogotá", rol: "propietario" },
    { id: "4", referencia: "CTR-2025-004", tipo: "arriendo", estado: "por_vencer", inmueble: "Local Granada", direccion: "Cll 50 #10-15, Cali", rol: "arrendatario" },
  ],
  "7": [
    { id: "1", referencia: "CTR-2025-001", tipo: "arriendo", estado: "activo", inmueble: "Apto 301 Torre A", direccion: "Cra 15 #93-47, Bogotá", rol: "codeudor" },
  ],
  "9": [
    { id: "2", referencia: "CTR-2025-002", tipo: "arriendo", estado: "activo", inmueble: "CC Plaza, Local 3", direccion: "Medellín — El Poblado", rol: "propietario" },
    { id: "5", referencia: "CTR-2025-005", tipo: "arriendo", estado: "finalizado", inmueble: "Local 2 Granada", direccion: "Cll 50 #10-15, Cali", rol: "propietario" },
  ],
}

export const CLIENTES_MOCK: Cliente[] = [
  {
    id: "1",
    tipoPersona: "natural",
    nombre: "Ana Lucía Martínez Ruiz",
    documento: "52.789.034",
    tipoDocumento: "CC",
    tipos: ["propietario"],
    telefono: "310 456 7890",
    email: "ana.martinez@gmail.com",
    ciudad: "Bogotá",
    fechaRegistro: "2024-08-12",
    activo: true,
  },
  {
    id: "2",
    tipoPersona: "juridica",
    nombre: "Inversiones Pedraza S.A.S.",
    documento: "900.234.567-1",
    tipoDocumento: "NIT",
    tipos: ["propietario"],
    telefono: "601 745 1200",
    email: "gerencia@pedrazasas.com",
    ciudad: "Medellín",
    fechaRegistro: "2024-09-03",
    representanteLegal: "Roberto Pedraza Núñez",
    activo: true,
  },
  {
    id: "3",
    tipoPersona: "natural",
    nombre: "Carlos Eduardo Reyes Mora",
    documento: "80.123.456",
    tipoDocumento: "CC",
    tipos: ["arrendatario"],
    telefono: "315 234 9876",
    email: "carlosreyes@hotmail.com",
    ciudad: "Bogotá",
    fechaRegistro: "2024-10-15",
    activo: true,
  },
  {
    id: "4",
    tipoPersona: "natural",
    nombre: "María Fernanda Ospina Castro",
    documento: "43.210.987",
    tipoDocumento: "CC",
    tipos: ["propietario", "arrendatario"],
    telefono: "312 876 5432",
    email: "mf.ospina@outlook.com",
    ciudad: "Bogotá",
    fechaRegistro: "2024-11-20",
    activo: true,
  },
  {
    id: "5",
    tipoPersona: "natural",
    nombre: "Luis Hernando Gómez Vargas",
    documento: "71.456.789",
    tipoDocumento: "CC",
    tipos: ["propietario"],
    telefono: "317 654 3210",
    email: "luisgomez@gmail.com",
    ciudad: "Cali",
    fechaRegistro: "2025-01-08",
    activo: true,
  },
  {
    id: "6",
    tipoPersona: "natural",
    nombre: "Sofía Valentina Torres Pinto",
    documento: "1.023.456.789",
    tipoDocumento: "CC",
    tipos: ["prospecto"],
    telefono: "304 321 6547",
    email: "sofia.torres@gmail.com",
    ciudad: "Bogotá",
    fechaRegistro: "2025-02-14",
    activo: true,
  },
  {
    id: "7",
    tipoPersona: "natural",
    nombre: "Andrés Felipe Suárez Medina",
    documento: "1.098.765.432",
    tipoDocumento: "CC",
    tipos: ["arrendatario", "codeudor"],
    telefono: "321 987 6543",
    email: "asuarez@empresa.co",
    ciudad: "Bogotá",
    fechaRegistro: "2025-02-28",
    activo: true,
  },
  {
    id: "8",
    tipoPersona: "natural",
    nombre: "Patricia Inés Herrera Lozano",
    documento: "39.876.543",
    tipoDocumento: "CC",
    tipos: ["codeudor"],
    telefono: "313 456 7891",
    email: "patricia.herrera@gmail.com",
    ciudad: "Medellín",
    fechaRegistro: "2025-03-05",
    activo: true,
  },
  {
    id: "9",
    tipoPersona: "juridica",
    nombre: "Fondos Inmobiliarios Cali S.A.",
    documento: "800.987.654-2",
    tipoDocumento: "NIT",
    tipos: ["propietario"],
    telefono: "602 345 6780",
    email: "contacto@fondoscali.com",
    ciudad: "Cali",
    fechaRegistro: "2025-03-18",
    representanteLegal: "Hernando Castro Vélez",
    activo: false,
  },
  {
    id: "10",
    tipoPersona: "natural",
    nombre: "Jorge Iván Ramírez Ossa",
    documento: "98.456.123",
    tipoDocumento: "CC",
    tipos: ["prospecto"],
    telefono: "318 543 2109",
    email: "j.ramirez.ossa@gmail.com",
    ciudad: "Medellín",
    fechaRegistro: "2025-04-02",
    activo: true,
  },
]
