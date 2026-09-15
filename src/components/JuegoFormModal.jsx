import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'

// Clasificaciones fijas (coinciden con las filas de la tabla
// `clasificaciones` en la base de datos). No hay endpoint para
// traerlas todavía, así que por ahora viven aquí, del lado del
// frontend.
const CLASIFICACIONES = [
  { id: 1, codigo: 'E', nombre: 'Para todos' },
  { id: 2, codigo: 'T', nombre: 'Adolescentes' },
  { id: 3, codigo: 'M', nombre: 'Maduro' },
  { id: 4, codigo: 'AO', nombre: 'Solo adultos' },
]

const FORM_VACIO = {
  titulo: '',
  descripcion: '',
  precio: '',
  desarrollador: '',
  fecha_lanzamiento: '',
  genero_id: '',
  clasificacion_id: '',
  imagen_url: '',
}

// Modal para crear o editar un juego. Si `juego` viene con datos, es
// modo edición (PUT); si viene null, es modo creación (POST).
export function JuegoFormModal({ abierto, juego, generos, onCerrar, onGuardado }) {
  const { token } = useAuth()
  const [form, setForm] = useState(FORM_VACIO)
  const [archivoPreview, setArchivoPreview] = useState(null)
  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState(null)

  const esEdicion = Boolean(juego)

  // Cada vez que se abre el modal, carga los datos del juego (edición)
  // o deja el formulario en blanco (creación).
  useEffect(() => {
    if (!abierto) return

    if (juego) {
      setForm({
        titulo: juego.titulo || '',
        descripcion: juego.descripcion || '',
        precio: juego.precio || '',
        desarrollador: juego.desarrollador || '',
        // La fecha llega como ISO completo (2022-11-09T06:00:00.000Z),
        // el <input type="date"> solo entiende la parte YYYY-MM-DD.
        fecha_lanzamiento: juego.fecha_lanzamiento
          ? juego.fecha_lanzamiento.slice(0, 10)
          : '',
        genero_id: juego.genero_id || '',
        clasificacion_id: juego.clasificacion_id || '',
        imagen_url: juego.imagen_url || '',
      })
    } else {
      setForm(FORM_VACIO)
    }
    setArchivoPreview(null)
    setError(null)
  }, [abierto, juego])

  if (!abierto) return null

  const actualizarCampo = (campo, valor) => {
    setForm((f) => ({ ...f, [campo]: valor }))
  }

  // Solo genera una vista previa local del archivo — no hay endpoint
  // de subida de imágenes todavía. El archivo real hay que guardarlo
  // en frontend/public/images/ y escribir su ruta abajo.
  const handleArchivo = (e) => {
    const archivo = e.target.files?.[0]
    if (!archivo) return
    setArchivoPreview(URL.createObjectURL(archivo))
    if (!form.imagen_url) {
      actualizarCampo('imagen_url', `/images/${archivo.name}`)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    if (!form.titulo.trim()) {
      setError('El título es requerido')
      return
    }

    setGuardando(true)
    try {
      const url = esEdicion ? `/api/juegos/${juego.id}` : '/api/juegos'
      const metodo = esEdicion ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method: metodo,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      })
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'No se pudo guardar el juego')
      }

      onGuardado()
      onCerrar()
    } catch (err) {
      setError(err.message)
    } finally {
      setGuardando(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onCerrar()
      }}
    >
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-lg border border-neutral-800 bg-neutral-950 p-6">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-heading text-lg font-semibold text-white">
            {esEdicion ? 'Editar juego' : 'Agregar juego'}
          </h2>
          <button
            type="button"
            onClick={onCerrar}
            aria-label="Cerrar"
            className="cursor-pointer rounded-md p-1 text-neutral-400 hover:text-white"
          >
            ✕
          </button>
        </div>

        {error && (
          <p className="mb-4 rounded-md border border-red-900/50 bg-red-950/40 px-3 py-2 text-sm text-red-300">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Imagen */}
          <div>
            <label className="mb-1.5 block text-sm text-neutral-300">
              Imagen
            </label>
            <div className="flex items-center gap-3">
              <div className="flex h-20 w-14 shrink-0 items-center justify-center overflow-hidden rounded-md border border-neutral-800 bg-neutral-900">
                {archivoPreview || form.imagen_url ? (
                  <img
                    src={archivoPreview || form.imagen_url}
                    alt="Vista previa"
                    className="h-full w-full object-cover"
                    onError={(e) => (e.currentTarget.style.display = 'none')}
                  />
                ) : (
                  <span className="text-xs text-neutral-600">Sin imagen</span>
                )}
              </div>
              <div className="flex-1 space-y-1.5">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleArchivo}
                  className="block w-full cursor-pointer text-xs text-neutral-400 file:mr-3 file:cursor-pointer file:rounded-md file:border file:border-neutral-800 file:bg-neutral-900 file:px-2.5 file:py-1.5 file:text-xs file:text-neutral-200 hover:file:border-neutral-600"
                />
                <input
                  type="text"
                  value={form.imagen_url}
                  onChange={(e) => actualizarCampo('imagen_url', e.target.value)}
                  placeholder="/images/nombre-del-archivo.webp"
                  className="w-full rounded-md border border-neutral-800 bg-neutral-900 px-2.5 py-1.5 text-xs text-white placeholder:text-neutral-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                />
              </div>
            </div>
            <p className="mt-1.5 text-xs text-neutral-500">
              La vista previa es solo local. Guarda el archivo en{' '}
              <code className="text-neutral-400">frontend/public/images/</code>{' '}
              y confirma que la ruta de arriba sea correcta.
            </p>
          </div>

          {/* Título */}
          <div>
            <label htmlFor="titulo" className="mb-1.5 block text-sm text-neutral-300">
              Título
            </label>
            <input
              id="titulo"
              type="text"
              value={form.titulo}
              onChange={(e) => actualizarCampo('titulo', e.target.value)}
              required
              className="w-full rounded-md border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            />
          </div>

          {/* Descripción */}
          <div>
            <label htmlFor="descripcion" className="mb-1.5 block text-sm text-neutral-300">
              Descripción
            </label>
            <textarea
              id="descripcion"
              rows={2}
              value={form.descripcion}
              onChange={(e) => actualizarCampo('descripcion', e.target.value)}
              className="w-full resize-none rounded-md border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            />
          </div>

          {/* Género + Clasificación */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="genero_id" className="mb-1.5 block text-sm text-neutral-300">
                Género
              </label>
              <select
                id="genero_id"
                value={form.genero_id}
                onChange={(e) => actualizarCampo('genero_id', e.target.value)}
                className="w-full cursor-pointer rounded-md border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <option value="">Selecciona...</option>
                {generos.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="clasificacion_id" className="mb-1.5 block text-sm text-neutral-300">
                Clasificación
              </label>
              <select
                id="clasificacion_id"
                value={form.clasificacion_id}
                onChange={(e) => actualizarCampo('clasificacion_id', e.target.value)}
                className="w-full cursor-pointer rounded-md border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <option value="">Selecciona...</option>
                {CLASIFICACIONES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.codigo} — {c.nombre}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Precio + Fecha */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="precio" className="mb-1.5 block text-sm text-neutral-300">
                Precio
              </label>
              <input
                id="precio"
                type="number"
                step="0.01"
                min="0"
                value={form.precio}
                onChange={(e) => actualizarCampo('precio', e.target.value)}
                className="w-full rounded-md border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
              />
            </div>
            <div>
              <label htmlFor="fecha_lanzamiento" className="mb-1.5 block text-sm text-neutral-300">
                Lanzamiento
              </label>
              <input
                id="fecha_lanzamiento"
                type="date"
                value={form.fecha_lanzamiento}
                onChange={(e) => actualizarCampo('fecha_lanzamiento', e.target.value)}
                className="w-full rounded-md border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white [color-scheme:dark]"
              />
            </div>
          </div>

          {/* Desarrollador */}
          <div>
            <label htmlFor="desarrollador" className="mb-1.5 block text-sm text-neutral-300">
              Desarrollador
            </label>
            <input
              id="desarrollador"
              type="text"
              value={form.desarrollador}
              onChange={(e) => actualizarCampo('desarrollador', e.target.value)}
              className="w-full rounded-md border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onCerrar}
              className="cursor-pointer rounded-md border border-neutral-800 px-4 py-2 text-sm text-neutral-300 hover:border-neutral-600"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={guardando}
              className="cursor-pointer rounded-md bg-white px-4 py-2 text-sm font-medium text-neutral-900 hover:bg-neutral-200 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {guardando ? 'Guardando...' : esEdicion ? 'Guardar cambios' : 'Agregar juego'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
