import { IconGamepad } from './icons/IconGamepad'
import { urlImagen } from '../config/api'

// Tarjeta individual de un juego.
// onEditar/onEliminar solo se pasan cuando el usuario logueado es
// admin (ver pages/Catalogo.jsx) — si no vienen, no se muestran los
// botones de administración.
export function TarjetaJuego({ juego, onEditar, onEliminar }) {
  const esAdmin = Boolean(onEditar || onEliminar)

  return (
    <article className="group relative overflow-hidden rounded-lg border border-neutral-800 transition-colors duration-150 hover:border-neutral-600">
      <div className="relative aspect-2/3 overflow-hidden bg-neutral-900">
        {juego.imagen_url ? (
          <>
            <div
              aria-hidden="true"
              className="absolute inset-0 scale-110 bg-cover bg-center opacity-40 blur-2xl"
              style={{ backgroundImage: `url(${urlImagen(juego.imagen_url)})` }}
            />
            <img
              src={urlImagen(juego.imagen_url)}
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

        {/* Acciones de administrador */}
        {esAdmin && (
          <div className="absolute right-2 top-2 z-10 flex gap-1.5 opacity-0 transition-opacity duration-150 group-hover:opacity-100">
            <button
              type="button"
              onClick={() => onEditar(juego)}
              className="cursor-pointer rounded-md border border-white/20 bg-black/70 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm transition-colors hover:bg-black/90"
            >
              Editar
            </button>
            <button
              type="button"
              onClick={() => onEliminar(juego)}
              className="cursor-pointer rounded-md border border-red-500/30 bg-black/70 px-2.5 py-1 text-xs font-medium text-red-300 backdrop-blur-sm transition-colors hover:bg-red-950/80"
            >
              Eliminar
            </button>
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
