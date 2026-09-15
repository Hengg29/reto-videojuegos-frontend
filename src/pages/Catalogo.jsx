import { useEffect, useMemo, useState } from 'react'
import { useEsMovil } from '../hooks/useEsMovil'
import { Header } from '../components/Header'
import { FiltroPill } from '../components/FiltroPill'
import { TarjetaJuego } from '../components/TarjetaJuego'
import { TarjetaSkeleton } from '../components/TarjetaSkeleton'
import { Paginacion } from '../components/Paginacion'


const JUEGOS_POR_PAGINA_MOVIL = 8
const JUEGOS_POR_PAGINA_DESKTOP = 15

function Catalogo() {
  const [juegos, setJuegos] = useState([])
  const [generos, setGeneros] = useState([])
  const [generoActivo, setGeneroActivo] = useState('todos')
  const [paginaActual, setPaginaActual] = useState(1)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)
  const esMovil = useEsMovil()
  const juegosPorPagina = esMovil
    ? JUEGOS_POR_PAGINA_MOVIL
    : JUEGOS_POR_PAGINA_DESKTOP

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

  const totalPaginas = Math.max(
    1,
    Math.ceil(juegosFiltrados.length / juegosPorPagina)
  )
  const juegosVisibles = juegosFiltrados.slice(
    (paginaActual - 1) * juegosPorPagina,
    paginaActual * juegosPorPagina
  )

  // Al cambiar de categoría, siempre volvemos a la página 1.
  const cambiarGenero = (genero) => {
    setGeneroActivo(genero)
    setPaginaActual(1)
  }

  // Si cambia cuántos juegos caben por página (ej. el usuario rota el
  // teléfono), también volvemos a la página 1.
  useEffect(() => {
    setPaginaActual(1)
  }, [juegosPorPagina])

  const irAPagina = (pagina) => {
    setPaginaActual(pagina)
    // Sube el scroll al inicio del catálogo al cambiar de página.
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="flex min-h-screen flex-col bg-neutral-950 text-neutral-100">
      <Header />

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

        {/* Conteo de resultados */}
        <p className="mb-8 text-center text-sm text-neutral-500">
          {juegosFiltrados.length}{' '}
          {juegosFiltrados.length === 1 ? 'resultado' : 'resultados'}
          {generoActivo !== 'todos' && <> en «{generoActivo}»</>}
        </p>

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

export default Catalogo
