import multer from "multer"

// Guardamos los archivos en memoria y NO los persistimos: para la demo basta con
// aceptar el upload y devolver una URL de marcador de posición. Migrar a Vercel
// Blob / S3 sería el siguiente paso si se requiere almacenamiento real.
export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 15 * 1024 * 1024 },
})

/** URL simulada para un archivo recién "subido". */
export function urlSimulada(nombre = "archivo"): string {
  return `https://placehold.co/600x400?text=${encodeURIComponent(nombre)}`
}
