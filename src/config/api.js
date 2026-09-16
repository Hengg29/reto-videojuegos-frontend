export const API_URL = import.meta.env.VITE_API_URL || ''

export function urlImagen(ruta) {
  if (!ruta) return ruta
  if (ruta.startsWith('http://') || ruta.startsWith('https://')) return ruta
  return `${API_URL}${ruta}`
}
