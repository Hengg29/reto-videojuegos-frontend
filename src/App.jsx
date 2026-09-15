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
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/60 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <h1 className="text-xl font-bold tracking-tight text-emerald-400">
            🎮 GameVault
          </h1>
          <button className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400">
            Iniciar sesión
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        {/* Hero */}
        <section className="mb-10 text-center">
          <h2 className="text-3xl font-extrabold sm:text-4xl">
            Explora el catálogo de videojuegos
          </h2>
          <p className="mt-2 text-slate-400">
            Filtra por género, descubre nuevos títulos y mira el detalle de
            cada juego.
          </p>
        </section>

        {/* Estado de error */}
        {error && (
          <p className="mb-6 rounded-lg bg-red-500/10 px-4 py-3 text-center text-red-400">
            ❌ {error}
          </p>
        )}

        {/* Filtros por género */}
        <section className="mb-8 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => cambiarGenero('todos')}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              generoActivo === 'todos'
                ? 'bg-emerald-500 text-slate-950'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Todos
          </button>
          {generos.map((g) => (
            <button
              key={g.id}
              onClick={() => cambiarGenero(g.nombre)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                generoActivo === g.nombre
                  ? 'bg-emerald-500 text-slate-950'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {g.nombre}
            </button>
          ))}
        </section>

        {/* Destacados rápidos */}
        <section className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Destacado numero={juegos.length} texto="Juegos en el catálogo" />
          <Destacado numero={generos.length} texto="Géneros disponibles" />
          <Destacado
            numero={juegosFiltrados.length}
            texto={`Resultados en "${generoActivo === 'todos' ? 'Todos' : generoActivo}"`}
          />
        </section>

        {/* Grid de juegos */}
        {cargando ? (
          <p className="text-center text-slate-400">Cargando juegos...</p>
        ) : juegosVisibles.length === 0 ? (
          <p className="text-center text-slate-400">
            No hay juegos para este filtro.
          </p>
        ) : (
          <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {juegosVisibles.map((juego) => (
              <TarjetaJuego key={juego.id} juego={juego} />
            ))}
          </section>
        )}

        {/* Cargar más */}
        {hayMasPorMostrar && (
          <div className="mt-8 flex justify-center">
            <button
              onClick={() => setCantidadVisible((c) => c + JUEGOS_POR_PAGINA)}
              className="rounded-lg border border-slate-700 px-6 py-2 font-semibold text-slate-200 transition hover:bg-slate-800"
            >
              Cargar más
            </button>
          </div>
        )}
      </main>

      <footer className="border-t border-slate-800 py-6 text-center text-sm text-slate-500">
        Reto Videojuegos — Turing IA
      </footer>
    </div>
  )
}

// Tarjeta individual de un juego
function TarjetaJuego({ juego }) {
  return (
    <article className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900 transition hover:border-emerald-500/50">
      <div className="flex h-40 items-center justify-center bg-slate-800 text-slate-600">
        {juego.imagen_url ? (
          <img
            src={juego.imagen_url}
            alt={juego.titulo}
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="text-4xl">🎮</span>
        )}
      </div>
      <div className="p-4">
        <div className="mb-2 flex items-center justify-between gap-2">
          <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-400">
            {juego.genero}
          </span>
          <span className="rounded-full bg-slate-800 px-2 py-0.5 text-xs font-medium text-slate-400">
            {juego.clasificacion_codigo}
          </span>
        </div>
        <h3 className="mb-1 font-bold text-slate-100">{juego.titulo}</h3>
        <p className="mb-3 line-clamp-2 text-sm text-slate-400">
          {juego.descripcion}
        </p>
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-500">{juego.desarrollador}</span>
          <span className="font-bold text-emerald-400">${juego.precio}</span>
        </div>
      </div>
    </article>
  )
}

// Bloque de estadística rápida (los "3 círculos" del wireframe)
function Destacado({ numero, texto }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-slate-800 bg-slate-900 py-6 text-center">
      <span className="text-3xl font-extrabold text-emerald-400">{numero}</span>
      <span className="mt-1 text-sm text-slate-400">{texto}</span>
    </div>
  )
}

export default App
