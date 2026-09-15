import { useEffect, useMemo, useState } from 'react'

const JUEGOS_POR_PAGINA = 15

function App() {
  const [juegos, setJuegos] = useState([])
  const [generos, setGeneros] = useState([])
  const [generoActivo, setGeneroActivo] = useState('todos')
  const [paginaActual, setPaginaActual] = useState(1)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    Promise.all([
      fetch('/api/juegos').then((res) => res.json()),
      fetch('/api/generos').then((res) => res.json()),
    ])
      .then(([juegosData, generosData]) => {
        setJuegos(juegosData)
        setGeneros(generosData)
      })
      .catch(() => setError('No se pudo conectar con el backend'))
      .finally(() => setCargando(false))
  }, [])

  // Filtra los juegos según el género seleccionado.
  const juegosFiltrados = useMemo(() => {
    if (generoActivo === 'todos') return juegos
    return juegos.filter((j) => j.genero === generoActivo)
  }, [juegos, generoActivo])

  const totalPaginas = Math.max(
    1,
    Math.ceil(juegosFiltrados.length / JUEGOS_POR_PAGINA)
  )
  const juegosVisibles = juegosFiltrados.slice(
    (paginaActual - 1) * JUEGOS_POR_PAGINA,
    paginaActual * JUEGOS_POR_PAGINA
  )

  // Al cambiar de categoría, siempre volvemos a la página 1.
  const cambiarGenero = (genero) => {
    setGeneroActivo(genero)
    setPaginaActual(1)
  }

  const irAPagina = (pagina) => {
    setPaginaActual(pagina)
    // Sube el scroll al inicio del catálogo al cambiar de página.
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="flex min-h-screen flex-col bg-neutral-950 text-neutral-100">
      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-neutral-800 bg-neutral-950">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6">
          <div className="flex items-center gap-2">
            <IconGamepad className="h-6 w-6 text-neutral-400" />
            <span className="font-heading text-base font-semibold tracking-tight text-white">
              GameVault
            </span>
          </div>
          <button
            type="button"
            className="cursor-pointer rounded-md bg-white px-4 py-2 text-sm font-medium text-neutral-900 transition-colors duration-150 hover:bg-neutral-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950"
          >
            Iniciar sesión
          </button>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-14 sm:px-6">
        {/* Hero */}
        <section className="mb-14 text-center">
          <h1 className="font-heading text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Catálogo de videojuegos
          </h1>
          <p className="mx-auto mt-3 max-w-md text-neutral-400">
            Filtra por género y descubre nuevos títulos.
          </p>
        </section>

        {/* Estado de error */}
        {error && (
          <p className="mb-6 rounded-md border border-neutral-800 bg-neutral-900 px-4 py-3 text-center text-neutral-300">
            {error}
          </p>
        )}

        {/* Filtros por género */}
        <section
          className="mb-12 flex flex-wrap justify-center gap-2"
          role="group"
          aria-label="Filtrar juegos por género"
        >
          <FiltroPill
            activo={generoActivo === 'todos'}
            onClick={() => cambiarGenero('todos')}
          >
            Todos
          </FiltroPill>
          {generos.map((g) => (
            <FiltroPill
              key={g.id}
              activo={generoActivo === g.nombre}
              onClick={() => cambiarGenero(g.nombre)}
            >
              {g.nombre}
            </FiltroPill>
          ))}
        </section>

        {/* Destacados rápidos */}
        <section className="mb-14 grid grid-cols-1 divide-y divide-neutral-800 border border-neutral-800 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          <Destacado numero={juegos.length} texto="Juegos en el catálogo" />
          <Destacado numero={generos.length} texto="Géneros disponibles" />
          <Destacado
            numero={juegosFiltrados.length}
            texto={`Resultados en "${generoActivo === 'todos' ? 'Todos' : generoActivo}"`}
          />
        </section>

        {/* Grid de juegos */}
        {cargando ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <TarjetaSkeleton key={i} />
            ))}
          </div>
        ) : juegosVisibles.length === 0 ? (
          <p className="text-center text-neutral-400">
            No hay juegos para este filtro.
          </p>
        ) : (
          <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {juegosVisibles.map((juego) => (
              <TarjetaJuego key={juego.id} juego={juego} />
            ))}
          </section>
        )}

        {/* Paginación */}
        {!cargando && totalPaginas > 1 && (
          <Paginacion
            paginaActual={paginaActual}
            totalPaginas={totalPaginas}
            onCambiarPagina={irAPagina}
          />
        )}
      </main>

      <footer className="border-t border-neutral-800 py-6 text-center text-sm text-neutral-500">
        Reto Videojuegos — Turing IA
      </footer>
    </div>
  )
}

// Controles de paginación: Anterior / números de página / Siguiente
function Paginacion({ paginaActual, totalPaginas, onCambiarPagina }) {
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

function FiltroPill({ activo, onClick, children }) {
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

function TarjetaJuego({ juego }) {
  return (
    <article className="group cursor-pointer overflow-hidden rounded-lg border border-neutral-800 transition-colors duration-150 hover:border-neutral-600">
      <div className="relative aspect-2/3 overflow-hidden bg-neutral-900">
        {juego.imagen_url ? (
          <>
            <div
              aria-hidden="true"
              className="absolute inset-0 scale-110 bg-cover bg-center opacity-40 blur-2xl"
              style={{ backgroundImage: `url(${juego.imagen_url})` }}
            />
            <img
              src={juego.imagen_url}
              alt={`Portada de ${juego.titulo}`}
              loading="lazy"
              className="relative h-full w-full object-contain"
            />
          </>
        ) : (
          <div className="flex h-full items-center justify-center text-neutral-700">
            <IconGamepad className="h-10 w-10" />
          </div>
        )}
      </div>
      <div className="space-y-3 p-4">
        <div className="flex items-center justify-between gap-2 text-xs text-neutral-500">
          <span>{juego.genero}</span>
          <span className="rounded border border-neutral-800 px-1.5 py-0.5">
            {juego.clasificacion_codigo}
          </span>
        </div>
        <h3 className="font-heading text-base font-medium leading-snug text-white">
          {juego.titulo}
        </h3>
        <p className="line-clamp-2 text-sm text-neutral-500">
          {juego.descripcion}
        </p>
        <div className="flex items-center justify-between border-t border-neutral-800 pt-3 text-sm">
          <span className="text-neutral-500">{juego.desarrollador}</span>
          <span className="font-heading font-semibold text-white">
            ${juego.precio}
          </span>
        </div>
      </div>
    </article>
  )
}

// Placeholder animado mientras cargan los juegos (evita "salto" de contenido)
function TarjetaSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="animate-pulse overflow-hidden rounded-lg border border-neutral-800"
    >
      <div className="aspect-2/3 bg-neutral-900" />
      <div className="space-y-3 p-4">
        <div className="h-3 w-1/3 rounded bg-neutral-900" />
        <div className="h-4 w-3/4 rounded bg-neutral-900" />
        <div className="h-3 w-full rounded bg-neutral-900" />
        <div className="h-3 w-1/2 rounded bg-neutral-900" />
      </div>
    </div>
  )
}

// Bloque de estadística rápida
function Destacado({ numero, texto }) {
  return (
    <div className="flex flex-col items-center justify-center gap-1 py-8 text-center">
      <span className="font-heading text-2xl font-semibold text-white">
        {numero}
      </span>
      <span className="text-sm text-neutral-500">{texto}</span>
    </div>
  )
}

// ---- Icono SVG (sin dependencias externas) ----

function IconGamepad({ className }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect x="2" y="7" width="20" height="10" rx="5" />
      <path d="M7 10v4M5 12h4" />
      <circle cx="16" cy="10.5" r="1" fill="currentColor" stroke="none" />
      <circle cx="18.5" cy="13" r="1" fill="currentColor" stroke="none" />
    </svg>
  )
}

export default App
