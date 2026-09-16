// Barra de búsqueda por nombre + selector de orden por fecha de
// lanzamiento. Vive junto a los filtros de género en el catálogo.
export function BuscadorJuegos({ busqueda, onCambiarBusqueda, orden, onCambiarOrden }) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-center">
      <div className="relative w-full sm:w-64">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </svg>
        <input
          type="search"
          value={busqueda}
          onChange={(e) => onCambiarBusqueda(e.target.value)}
          placeholder="Buscar por nombre..."
          aria-label="Buscar juegos por nombre"
          className="w-full rounded-md border border-neutral-800 bg-neutral-900 py-2 pl-9 pr-3 text-sm text-white placeholder:text-neutral-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
        />
      </div>

      <select
        value={orden}
        onChange={(e) => onCambiarOrden(e.target.value)}
        aria-label="Ordenar por fecha de lanzamiento"
        className="w-full cursor-pointer rounded-md border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white sm:w-56"
      >
        <option value="">Sin ordenar</option>
        <option value="desc">Lanzamiento: más recientes</option>
        <option value="asc">Lanzamiento: más antiguos</option>
      </select>
    </div>
  )
}
