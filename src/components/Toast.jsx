export function Toast({ mensaje, onCerrar }) {
  if (!mensaje) return null

  return (
    <div
      role="alert"
      className="fixed bottom-6 left-1/2 z-50 flex w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 items-start gap-3 rounded-lg border border-neutral-800 bg-neutral-950 p-4 shadow-xl shadow-black/40 animate-[toast-in_0.2s_ease]"
    >
      <p className="flex-1 text-sm text-neutral-200">{mensaje}</p>
      <button
        type="button"
        onClick={onCerrar}
        aria-label="Cerrar aviso"
        className="cursor-pointer text-neutral-500 hover:text-white"
      >
        ✕
      </button>
    </div>
  )
}
