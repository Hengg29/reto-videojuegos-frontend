import { useCallback, useEffect, useMemo, useState } from 'react'
import { useEsMovil } from '../hooks/useEsMovil'
import { useAuth } from '../context/AuthContext'
import { Header } from '../components/Header'
import { BuscadorJuegos } from '../components/BuscadorJuegos'
import { FiltroGeneroDropdown } from '../components/FiltroGeneroDropdown'
import { TarjetaJuego } from '../components/TarjetaJuego'
import { TarjetaSkeleton } from '../components/TarjetaSkeleton'
import { Paginacion } from '../components/Paginacion'
import { JuegoFormModal } from '../components/JuegoFormModal'
import { ConfirmModal } from '../components/ConfirmModal'
import { API_URL } from '../config/api'

const JUEGOS_POR_PAGINA_MOVIL = 8
const JUEGOS_POR_PAGINA_DESKTOP = 15

function Catalogo() {
  const { esAdmin, token, mostrarToast, cerrarSesionPorExpiracion } = useAuth()
  const [juegos, setJuegos] = useState([])
  const [generos, setGeneros] = useState([])
  const [generosSeleccionados, setGenerosSeleccionados] = useState([])
  const [busqueda, setBusqueda] = useState('')
  const [orden, setOrden] = useState('')
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

  const [juegoAEliminar, setJuegoAEliminar] = useState(null)

  const cargarJuegos = useCallback(() => {
    return fetch(`${API_URL}/api/juegos`)
      .then((res) => res.json())
      .then(setJuegos)
  }, [])

  // Al cargar la página, traemos los juegos y los géneros desde el backend.
  useEffect(() => {
    Promise.all([cargarJuegos(), fetch(`${API_URL}/api/generos`).then((res) => res.json()).then(setGeneros)])
      .catch(() => setError('No se pudo conectar con el backend'))
      .finally(() => setCargando(false))
  }, [cargarJuegos])

  // Filtra por género(s) + nombre, y ordena por fecha de lanzamiento.
  const juegosFiltrados = useMemo(() => {
    let resultado = juegos

    if (generosSeleccionados.length > 0) {
      resultado = resultado.filter((j) => generosSeleccionados.includes(j.genero))
    }

    if (busqueda.trim() !== '') {
      const texto = busqueda.trim().toLowerCase()
      resultado = resultado.filter((j) => j.titulo.toLowerCase().includes(texto))
    }

    if (orden === 'asc' || orden === 'desc') {
      resultado = [...resultado].sort((a, b) => {
        const fechaA = new Date(a.fecha_lanzamiento).getTime()
        const fechaB = new Date(b.fecha_lanzamiento).getTime()
        return orden === 'asc' ? fechaA - fechaB : fechaB - fechaA
      })
    }

    return resultado
  }, [juegos, generosSeleccionados, busqueda, orden])

  const totalPaginas = Math.max(
    1,
    Math.ceil(juegosFiltrados.length / juegosPorPagina)
  )
  const juegosVisibles = juegosFiltrados.slice(
    (paginaActual - 1) * juegosPorPagina,
    paginaActual * juegosPorPagina
  )

  // Si cambian los filtros/orden, o cuántos juegos caben por página
  // (ej. el usuario rota el teléfono), siempre volvemos a la página 1.
  useEffect(() => {
    setPaginaActual(1)
  }, [juegosPorPagina, generosSeleccionados, busqueda, orden])

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

  // Solo abre el modal de confirmación — el borrado real pasa en
  // confirmarEliminacion(), una vez que el usuario le da "Eliminar".
  const pedirEliminar = (juego) => {
    setJuegoAEliminar(juego)
  }

  const confirmarEliminacion = async () => {
    const juego = juegoAEliminar
    setJuegoAEliminar(null)

    try {
      const res = await fetch(`${API_URL}/api/juegos/${juego.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })

      if (res.status === 401) {
        cerrarSesionPorExpiracion()
        return
      }
      if (!res.ok && res.status !== 204) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'No se pudo eliminar el juego')
      }

      mostrarToast(`"${juego.titulo}" fue eliminado.`)
      cargarJuegos()
    } catch (err) {
      mostrarToast(err.message)
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
            Busca por nombre, filtra por género y ordena por fecha de
            lanzamiento.
          </p>
        </section>

        {/* Estado de error */}
        {error && (
          <p className="mb-6 rounded-md border border-neutral-800 bg-neutral-900 px-4 py-3 text-center text-neutral-300">
            {error}
          </p>
        )}

        {/* Buscador + filtro de género (multi) + orden por fecha */}
        <div className="mb-6 flex flex-col items-center gap-2 sm:flex-row sm:justify-center">
          <BuscadorJuegos
            busqueda={busqueda}
            onCambiarBusqueda={setBusqueda}
            orden={orden}
            onCambiarOrden={setOrden}
          />
          <FiltroGeneroDropdown
            generos={generos}
            seleccionados={generosSeleccionados}
            onCambiar={setGenerosSeleccionados}
          />
        </div>

        {/* Conteo de resultados + acción de admin */}
        <div className="mb-8 flex items-center justify-center gap-4">
          <p className="text-center text-sm text-neutral-500">
            {juegosFiltrados.length}{' '}
            {juegosFiltrados.length === 1 ? 'resultado' : 'resultados'}
            {generosSeleccionados.length > 0 && (
              <> en «{generosSeleccionados.join(', ')}»</>
            )}
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
                onEliminar={esAdmin ? pedirEliminar : undefined}
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

      <ConfirmModal
        abierto={juegoAEliminar !== null}
        titulo="Eliminar juego"
        mensaje={
          juegoAEliminar &&
          `¿Seguro que quieres eliminar "${juegoAEliminar.titulo}"? Esta acción no se puede deshacer.`
        }
        textoConfirmar="Eliminar"
        peligroso
        onConfirmar={confirmarEliminacion}
        onCancelar={() => setJuegoAEliminar(null)}
      />
    </div>
  )
}

export default Catalogo
