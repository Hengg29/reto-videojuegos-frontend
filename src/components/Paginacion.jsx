// Controles de paginación: Anterior / números de página / Siguiente
export function Paginacion({ paginaActual, totalPaginas, onCambiarPagina }) {
  const numeros = Array.from({ length: totalPaginas }, (_, i) => i + 1)

  return (
    <nav
      aria-label="Paginación de resultados"
      className="mt-12 flex items-center justify-center gap-1"
    >
      <button
        type="button"
        disabled={paginaActual === 1}
        onClick={() => onCambiarPagina(paginaActual - 1)}
        className="cursor-pointer rounded-md border border-neutral-800 px-3 py-2 text-sm text-neutral-300 transition-colors duration-150 hover:border-neutral-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-white disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:border-neutral-800"
      >
        Anterior
      </button>

      {numeros.map((n) => (
        <button
          key={n}
          type="button"
          aria-current={n === paginaActual ? 'page' : undefined}
          onClick={() => onCambiarPagina(n)}
          className={`h-9 w-9 cursor-pointer rounded-md text-sm transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-white ${
            n === paginaActual
              ? 'bg-white font-medium text-neutral-900'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          {n}
        </button>
      ))}

      <button
        type="button"
        disabled={paginaActual === totalPaginas}
        onClick={() => onCambiarPagina(paginaActual + 1)}
        className="cursor-pointer rounded-md border border-neutral-800 px-3 py-2 text-sm text-neutral-300 transition-colors duration-150 hover:border-neutral-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-white disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:border-neutral-800"
      >
        Siguiente
      </button>
    </nav>
  )
}
