import { useEffect, useState } from 'react'

// Detecta si la pantalla es de tamaño "móvil" (menor al breakpoint sm
// de Tailwind, 640px) y se actualiza si el usuario rota el teléfono o
// cambia el tamaño de la ventana.
export function useEsMovil() {
  const [esMovil, setEsMovil] = useState(
    () => typeof window !== 'undefined' && window.innerWidth < 640
  )

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 639px)')
    const actualizar = (e) => setEsMovil(e.matches)
    mediaQuery.addEventListener('change', actualizar)
    return () => mediaQuery.removeEventListener('change', actualizar)
  }, [])

  return esMovil
}
