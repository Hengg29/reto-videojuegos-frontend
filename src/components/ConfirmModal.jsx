// Modal de confirmación genérico ("¿Estás seguro?"), con el mismo
// estilo del resto de la app — reemplaza el window.confirm() feo del
// navegador. Se usa para eliminar y para guardar cambios de un juego.
export function ConfirmModal({
  abierto,
  titulo,
  mensaje,
  textoConfirmar = 'Confirmar',
  peligroso = false,
  onConfirmar,
  onCancelar,
}) {
  if (!abierto) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onCancelar()
      }}
    >
      <div className="w-full max-w-sm rounded-lg border border-neutral-800 bg-neutral-950 p-6">
        <h2 className="font-heading text-base font-semibold text-white">
          {titulo}
        </h2>
        <p className="mt-2 text-sm text-neutral-400">{mensaje}</p>

        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancelar}
            className="cursor-pointer rounded-md border border-neutral-800 px-4 py-2 text-sm text-neutral-300 hover:border-neutral-600"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirmar}
            className={`cursor-pointer rounded-md px-4 py-2 text-sm font-medium transition-colors duration-150 ${
              peligroso
                ? 'bg-red-500/90 text-white hover:bg-red-500'
                : 'bg-white text-neutral-900 hover:bg-neutral-200'
            }`}
          >
            {textoConfirmar}
          </button>
        </div>
      </div>
    </div>
  )
}
