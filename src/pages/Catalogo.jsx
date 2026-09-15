import { useCallback, useEffect, useMemo, useState } from 'react'
import { useEsMovil } from '../hooks/useEsMovil'
import { useAuth } from '../context/AuthContext'
import { Header } from '../components/Header'
import { FiltroPill } from '../components/FiltroPill'
import { TarjetaJuego } from '../components/TarjetaJuego'
import { TarjetaSkeleton } from '../components/TarjetaSkeleton'
import { Paginacion } from '../components/Paginacion'
import { JuegoFormModal } from '../components/JuegoFormModal'

const JUEGOS_POR_PAGINA_MOVIL = 8
const JUEGOS_POR_PAGINA_DESKTOP = 15

function Catalogo() {
  const { esAdmin, token } = useAuth()
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

  // Modal de crear/editar juego (solo lo usa el admin)
  const [modalAbierto, setModalAbierto] = useState(false)
  const [juegoEditando, setJuegoEditando] = useState(null)

  const cargarJuegos = useCallback(() => {
    return fetch('/api/juegos')
      .then((res) => res.json())
      .then(setJuegos)
  }, [])

  // Al cargar la página, traemos los juegos y los géneros desde el backend.
  useEffect(() => {
    Promise.all([cargarJuegos(), fetch('/api/generos').then((res) => res.json()).then(setGeneros)])
      .catch(() => setError('No se pudo conectar con el backend'))
      .finally(() => setCargando(false))
  }, [cargarJuegos])

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

  // ---- Acciones de administrador ----

  const abrirModalCrear = () => {
    setJuegoEditando(null)
    setModalAbierto(true)
  }

  const abrirModalEditar = (juego) => {
    setJuegoEditando(juego)
    setModalAbierto(true)
  }

  const eliminarJuego = async (juego) => {
    const confirmado = window.confirm(
      `¿Seguro que quieres eliminar "${juego.titulo}"? Esta acción no se puede deshacer.`
    )
    if (!confirmado) return

    try {
      const res = await fetch(`/api/juegos/${juego.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok && res.status !== 204) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'No se pudo eliminar el juego')
      }
      cargarJuegos()
    } catch (err) {
      alert(err.message)
    }
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
          className="mb-8 flex flex-wrap justify-center gap-2"
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

        {/* Conteo de resultados + acción de admin */}
        <div className="mb-8 flex items-center justify-center gap-4">
          <p className="text-center text-sm text-neutral-500">
            {juegosFiltrados.length}{' '}
            {juegosFiltrados.length === 1 ? 'resultado' : 'resultados'}
            {generoActivo !== 'todos' && <> en «{generoActivo}»</>}
          </p>
          {esAdmin && (
            <button
              type="button"
              onClick={abrirModalCrear}
              className="cursor-pointer rounded-md border border-neutral-700 px-3 py-1.5 text-xs font-medium text-neutral-200 transition-colors duration-150 hover:border-neutral-500 hover:text-white"
            >
              + Agregar juego
            </button>
          )}
        </div>

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
              <TarjetaJuego
                key={juego.id}
                juego={juego}
                onEditar={esAdmin ? abrirModalEditar : undefined}
                onEliminar={esAdmin ? eliminarJuego : undefined}
              />
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

      <JuegoFormModal
        abierto={modalAbierto}
        juego={juegoEditando}
        generos={generos}
        onCerrar={() => setModalAbierto(false)}
        onGuardado={cargarJuegos}
      />
    </div>
  )
}

export default Catalogo
