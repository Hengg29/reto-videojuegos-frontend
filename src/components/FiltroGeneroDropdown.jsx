import { useEffect, useRef, useState } from 'react'

// Dropdown con checkboxes para filtrar por uno o varios géneros a la
// vez, sin ocupar tanto espacio como una fila de botones fija.
export function FiltroGeneroDropdown({ generos, seleccionados, onCambiar }) {
  const [abierto, setAbierto] = useState(false)
  const contenedorRef = useRef(null)

  useEffect(() => {
    const onClickFuera = (e) => {
      if (contenedorRef.current && !contenedorRef.current.contains(e.target)) {
        setAbierto(false)
      }
    }
    const onEscape = (e) => {
      if (e.key === 'Escape') setAbierto(false)
    }
    document.addEventListener('mousedown', onClickFuera)
    document.addEventListener('keydown', onEscape)
    return () => {
      document.removeEventListener('mousedown', onClickFuera)
      document.removeEventListener('keydown', onEscape)
    }
  }, [])

  const toggleGenero = (nombre) => {
    if (seleccionados.includes(nombre)) {
      onCambiar(seleccionados.filter((g) => g !== nombre))
    } else {
      onCambiar([...seleccionados, nombre])
    }
  }

  const hayFiltroActivo = seleccionados.length > 0

  return (
    <div ref={contenedorRef} className="relative w-full sm:w-48">
      <button
        type="button"
        onClick={() => setAbierto((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={abierto}
        className={`flex w-full cursor-pointer items-center justify-between gap-2 rounded-md border px-3 py-2 text-sm transition-colors duration-150 ${
          hayFiltroActivo
            ? 'border-white bg-white font-medium text-neutral-900'
            : 'border-neutral-800 bg-neutral-900 text-neutral-300 hover:border-neutral-600'
        }`}
      >
        <span>Género{hayFiltroActivo ? ` (${seleccionados.length})` : ''}</span>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`h-4 w-4 shrink-0 transition-transform duration-150 ${abierto ? 'rotate-180' : ''}`}
          aria-hidden="true"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {abierto && (
        <div
          role="menu"
          className="absolute left-0 top-full z-30 mt-2 w-56 rounded-lg border border-neutral-800 bg-neutral-950 p-2 shadow-xl shadow-black/40"
        >
          {generos.map((g) => (
            <label
              key={g.id}
              className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm text-neutral-300 transition-colors duration-150 hover:bg-neutral-900"
            >
              <input
                type="checkbox"
                checked={seleccionados.includes(g.nombre)}
                onChange={() => toggleGenero(g.nombre)}
                className="h-4 w-4 cursor-pointer accent-white"
              />
              {g.nombre}
            </label>
          ))}

          {hayFiltroActivo && (
            <button
              type="button"
              onClick={() => onCambiar([])}
              className="mt-1 w-full cursor-pointer rounded-md px-2 py-1.5 text-left text-sm text-neutral-500 transition-colors duration-150 hover:bg-neutral-900 hover:text-white"
            >
              Limpiar selección
            </button>
          )}
        </div>
      )}
    </div>
  )
}
