import { useEffect, useMemo, useState } from 'react'

// Cuántas tarjetas se muestran al inicio, y cuántas se suman cada vez
// que el usuario le da a "Cargar más".
const JUEGOS_POR_PAGINA = 3

function App() {
  const [juegos, setJuegos] = useState([])
  const [generos, setGeneros] = useState([])
  const [generoActivo, setGeneroActivo] = useState('todos')
  const [cantidadVisible, setCantidadVisible] = useState(JUEGOS_POR_PAGINA)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)

  // Al cargar la página, traemos los juegos y los géneros desde el backend.
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

  const juegosVisibles = juegosFiltrados.slice(0, cantidadVisible)
  const hayMasPorMostrar = cantidadVisible < juegosFiltrados.length

  // Al cambiar de categoría, reiniciamos cuántas tarjetas se muestran.
  const cambiarGenero = (genero) => {
    setGeneroActivo(genero)
    setCantidadVisible(JUEGOS_POR_PAGINA)
  }

  return (
    <div className="min-h-screen bg-[#0f0f23] text-slate-100 selection:bg-violet-500/40">
      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-white/5 bg-[#0f0f23]/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <div className="flex items-center gap-2">
            <IconGamepad className="h-7 w-7 text-violet-400" />
            <span className="font-heading text-lg tracking-wide text-white">
              GAME<span className="text-violet-400">VAULT</span>
            </span>
          </div>
          <button
            type="button"
            className="cursor-pointer rounded-lg bg-gradient-to-r from-violet-600 to-rose-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-violet-900/40 transition-transform duration-200 hover:scale-[1.03] focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0f0f23]"
          >
            Iniciar sesión
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        {/* Hero */}
        <section className="relative mb-12 overflow-hidden text-center">
          {/* Glow decorativo de fondo */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-0 -z-10 h-64 w-[36rem] -translate-x-1/2 rounded-full bg-violet-600/20 blur-3xl"
          />
          <h1 className="font-heading text-3xl leading-tight text-white sm:text-5xl">
            Explora el <span className="text-violet-400">catálogo</span> de
            videojuegos
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-slate-400">
            Filtra por género, descubre nuevos títulos y mira el detalle de
            cada juego en tiempo real.
          </p>
        </section>

        {/* Estado de error */}
        {error && (
          <p className="mb-6 rounded-lg border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-center text-rose-400">
            {error}
          </p>
        )}

        {/* Filtros por género */}
        <section
          className="mb-10 flex flex-wrap justify-center gap-2"
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
        <section className="mb-12 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Destacado
            icon={<IconGamepad className="h-6 w-6" />}
            numero={juegos.length}
            texto="Juegos en el catálogo"
          />
          <Destacado
            icon={<IconTag className="h-6 w-6" />}
            numero={generos.length}
            texto="Géneros disponibles"
          />
          <Destacado
            icon={<IconFilter className="h-6 w-6" />}
            numero={juegosFiltrados.length}
            texto={`Resultados en "${generoActivo === 'todos' ? 'Todos' : generoActivo}"`}
          />
        </section>

        {/* Grid de juegos */}
        {cargando ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4 xl:grid-cols-5">
            {Array.from({ length: JUEGOS_POR_PAGINA }).map((_, i) => (
              <TarjetaSkeleton key={i} />
            ))}
          </div>
        ) : juegosVisibles.length === 0 ? (
          <p className="text-center text-slate-400">
            No hay juegos para este filtro.
          </p>
        ) : (
          <section className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4 xl:grid-cols-5">
            {juegosVisibles.map((juego) => (
              <TarjetaJuego key={juego.id} juego={juego} />
            ))}
          </section>
        )}

        {/* Cargar más */}
        {hayMasPorMostrar && (
          <div className="mt-10 flex justify-center">
            <button
              type="button"
              onClick={() => setCantidadVisible((c) => c + JUEGOS_POR_PAGINA)}
              className="cursor-pointer rounded-lg border border-violet-500/40 px-6 py-2.5 font-semibold text-slate-200 transition-colors duration-200 hover:bg-violet-500/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400"
            >
              Cargar más
            </button>
          </div>
        )}
      </main>

      <footer className="border-t border-white/5 py-6 text-center text-sm text-slate-500">
        Reto Videojuegos — Turing IA
      </footer>
    </div>
  )
}

// Botón "pill" de filtro por género
function FiltroPill({ activo, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={activo}
      className={`cursor-pointer rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 ${
        activo
          ? 'bg-gradient-to-r from-violet-600 to-violet-500 text-white shadow-md shadow-violet-900/50'
          : 'border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10'
      }`}
    >
      {children}
    </button>
  )
}

// Tarjeta individual de un juego
function TarjetaJuego({ juego }) {
  return (
    <article className="group cursor-pointer overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] transition-all duration-200 motion-reduce:transition-none hover:-translate-y-1 hover:border-violet-500/50 hover:shadow-xl hover:shadow-violet-900/30">
      <div className="relative aspect-2/3 overflow-hidden bg-slate-950">
        {juego.imagen_url ? (
          <>
            {}
            <div
              aria-hidden="true"
              className="absolute inset-0 scale-110 bg-cover bg-center opacity-60 blur-2xl"
              style={{ backgroundImage: `url(${juego.imagen_url})` }}
            />
            <img
              src={juego.imagen_url}
              alt={`Portada de ${juego.titulo}`}
              loading="lazy"
              className="relative h-full w-full object-contain transition-transform duration-300 motion-reduce:transition-none group-hover:scale-105"
            />
          </>
        ) : (
          <div className="flex h-full items-center justify-center text-slate-600">
            <IconGamepad className="h-10 w-10" />
          </div>
        )}
      </div>
      <div className="space-y-3 p-4">
        <div className="flex items-center justify-between gap-2">
          <span className="rounded-full bg-violet-500/10 px-2.5 py-0.5 text-xs font-medium text-violet-300">
            {juego.genero}
          </span>
          <span className="rounded-full bg-white/5 px-2.5 py-0.5 text-xs font-medium text-slate-400">
            {juego.clasificacion_codigo}
          </span>
        </div>
        <h3 className="font-heading text-base leading-snug text-white">
          {juego.titulo}
        </h3>
        <p className="line-clamp-2 text-sm text-slate-400">
          {juego.descripcion}
        </p>
        <div className="flex items-center justify-between border-t border-white/5 pt-3 text-sm">
          <span className="text-slate-500">{juego.desarrollador}</span>
          <span className="font-heading text-violet-300">
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
      className="animate-pulse overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]"
    >
      <div className="aspect-2/3 bg-white/5" />
      <div className="space-y-3 p-4">
        <div className="h-3 w-1/3 rounded bg-white/5" />
        <div className="h-4 w-3/4 rounded bg-white/5" />
        <div className="h-3 w-full rounded bg-white/5" />
        <div className="h-3 w-1/2 rounded bg-white/5" />
      </div>
    </div>
  )
}

// Bloque de estadística rápida
function Destacado({ icon, numero, texto }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] py-7 text-center">
      <span className="text-violet-400">{icon}</span>
      <span className="font-heading text-2xl text-white">{numero}</span>
      <span className="text-sm text-slate-400">{texto}</span>
    </div>
  )
}

// ---- Iconos SVG (sin dependencias externas) ----

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

function IconTag({ className }) {
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
      <path d="M20.59 13.41 12 22l-9-9 8.59-8.59A2 2 0 0 1 13 4h6a1 1 0 0 1 1 1v6a2 2 0 0 1-.41 1.41Z" />
      <circle cx="16.5" cy="7.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  )
}

function IconFilter({ className }) {
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
      <path d="M4 5h16l-6 8v5l-4 2v-7z" />
    </svg>
  )
}

export default App
