import { IconGamepad } from './icons/IconGamepad'

// Tarjeta individual de un juego
export function TarjetaJuego({ juego }) {
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
