import { useEffect, useState } from 'react'

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
