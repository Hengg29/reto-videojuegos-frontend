// Placeholder animado mientras cargan los juegos (evita "salto" de contenido)
export function TarjetaSkeleton() {
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
