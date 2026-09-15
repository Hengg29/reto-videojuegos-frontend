// Botón de filtro por género
export function FiltroPill({ activo, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={activo}
      className={`cursor-pointer rounded-md px-3.5 py-1.5 text-sm transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-white ${
        activo
          ? 'bg-white font-medium text-neutral-900'
          : 'border border-neutral-800 text-neutral-400 hover:border-neutral-600 hover:text-white'
      }`}
    >
      {children}
    </button>
  )
}
