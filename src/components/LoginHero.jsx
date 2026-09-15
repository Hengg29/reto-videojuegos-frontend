import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { IconGamepad } from './icons/IconGamepad'

// Panel de marca del login: una escena con dos carátulas superpuestas
// (una se revela con un "spotlight" que sigue al mouse), una ficha del
// juego destacado y sus especificaciones. Reemplaza el panel vacío de
// antes con algo que muestre la identidad del catálogo.
export function LoginHero() {
  const revealRef = useRef(null)
  const [mask, setMask] = useState(
    'radial-gradient(circle 0px at -999px -999px, #fff, transparent)'
  )

  useEffect(() => {
    const updateSpotlight = (clientX, clientY) => {
      const el = revealRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const x = clientX - rect.left
      const y = clientY - rect.top

      let radius = 260
      if (window.innerWidth < 480) radius = 120
      else if (window.innerWidth < 720) radius = 160

      setMask(
        `radial-gradient(circle ${radius}px at ${x}px ${y}px, ` +
          '#fff 0%, #fff 40%, rgba(255,255,255,0.75) 60%, ' +
          'rgba(255,255,255,0.4) 75%, rgba(255,255,255,0.12) 88%, transparent 100%)'
      )
    }

    const onMouseMove = (e) => updateSpotlight(e.clientX, e.clientY)
    const onTouchMove = (e) => {
      if (e.touches && e.touches[0]) {
        updateSpotlight(e.touches[0].clientX, e.touches[0].clientY)
      }
    }

    // Respeta la preferencia de "menos movimiento": no activamos el
    // seguimiento del mouse, la escena base se queda fija.
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches
    if (prefersReducedMotion) return

    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('touchmove', onTouchMove, { passive: true })
    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('touchmove', onTouchMove)
    }
  }, [])

  return (
    <div className="relative flex h-full flex-col justify-between overflow-hidden p-10 lg:p-16">
      {/* Estilos locales de animación (fade-in escalonado al montar) */}
      <style>{`
        @keyframes lh-base-in {
          from { opacity: 0; transform: scale(1.12); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes lh-fade-up {
          from { opacity: 0; transform: translateY(14px); filter: blur(6px); }
          to { opacity: 1; transform: translateY(0); filter: blur(0); }
        }
        .lh-base { animation: lh-base-in 1.1s cubic-bezier(0.25,0.46,0.45,0.94) forwards; opacity: 0; }
        .lh-fade { opacity: 0; animation: lh-fade-up 0.7s ease forwards; }
        @media (prefers-reduced-motion: reduce) {
          .lh-base, .lh-fade { animation: none !important; opacity: 1 !important; transform: none !important; filter: none !important; }
        }
      `}</style>

      {/* Escena de fondo: carátula base + carátula revelada por el mouse */}
      <div
        className="lh-base absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/gowr.webp')" }}
        aria-hidden="true"
      />
      <div
        ref={revealRef}
        className="pointer-events-none absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('/images/elden.webp')",
          WebkitMaskImage: mask,
          maskImage: mask,
        }}
        aria-hidden="true"
      />
      {/* Degradado oscuro para que el texto siempre sea legible */}
      <div
        className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/70"
        aria-hidden="true"
      />

      {/* Logo */}
      <Link to="/" className="relative z-10 flex items-center gap-2">
        <IconGamepad className="h-6 w-6 text-white" />
        <span className="font-heading text-base font-semibold tracking-tight text-white">
          GameVault
        </span>
      </Link>

      {/* Copy + producto destacado */}
      <div className="relative z-10 space-y-6">
        <div>
          <h1 className="font-heading text-2xl uppercase leading-tight text-white sm:text-3xl">
            <span className="lh-fade block" style={{ animationDelay: '0.15s' }}>
              GAMEVAULT //
            </span>
            <span className="lh-fade block" style={{ animationDelay: '0.25s' }}>
              PRÓXIMO
            </span>
            <span className="lh-fade block" style={{ animationDelay: '0.35s' }}>
              NIVEL
            </span>
          </h1>
          <p
            className="lh-fade mt-4 max-w-xs text-[13.5px] leading-relaxed text-white/70"
            style={{ animationDelay: '0.5s' }}
          >
            Catálogo curado con gráficos de última generación y control
            total sobre tu próxima aventura.
          </p>

          <div
            className="lh-fade mt-5 flex gap-2.5"
            style={{ animationDelay: '0.65s' }}
          >
            <IconoRedondo label="Núcleo principal">
              <path d="M8 1.4L13.8 4.7V11.3L8 14.6L2.2 11.3V4.7L8 1.4Z" />
              <circle cx="8" cy="8" r="1.35" fill="currentColor" stroke="none" />
            </IconoRedondo>
            <IconoRedondo label="Visión">
              <path d="M2 5.2V2h3.2" strokeLinecap="round" />
              <path d="M14 5.2V2h-3.2" strokeLinecap="round" />
              <path d="M2 10.8V14h3.2" strokeLinecap="round" />
              <path d="M14 10.8V14h-3.2" strokeLinecap="round" />
              <rect x="5.2" y="5.2" width="5.6" height="5.6" />
            </IconoRedondo>
            <IconoRedondo label="Fuerza">
              <path d="M9.2 1.6L4 9.1h3.5L6.8 14.4 12 6.9H8.5L9.2 1.6Z" strokeLinejoin="round" />
            </IconoRedondo>
          </div>
        </div>

        {/* Ficha del juego destacado */}
        <article
          className="lh-fade grid w-full max-w-[280px] grid-cols-[72px_1fr] gap-x-3.5 gap-y-2.5 rounded-2xl border border-white/10 bg-black/55 p-3 backdrop-blur-md"
          style={{ animationDelay: '1s' }}
        >
          <div
            className="col-start-1 row-span-2 min-h-[72px] rounded-xl bg-cover bg-center"
            style={{ backgroundImage: "url('/images/resident.webp')" }}
            aria-hidden="true"
          />
          <div className="col-start-2 row-start-1">
            <h2 className="text-[11px] uppercase leading-tight text-white">
              RE4: Resident Evil
            </h2>
            <p className="mt-1.5 text-[11px] leading-snug text-white/65">
              Survival horror clásico, renovado.
            </p>
          </div>
          <button
            type="button"
            className="col-start-2 row-start-2 w-fit cursor-pointer self-end rounded-full border border-white px-3.5 py-1.5 text-[11px] font-medium text-white transition-transform duration-200 hover:-translate-y-0.5"
          >
            Reservar ahora
          </button>
        </article>
      </div>

      {/* Specs */}
      <div className="lh-fade relative z-10" style={{ animationDelay: '1.2s' }}>
        <h3 className="mb-3 text-[11px] uppercase tracking-widest text-white/90">
          Especificaciones
        </h3>
        <FilaSpec label="Gráficos" valor="Ray Tracing 4K" />
        <FilaSpec label="Motor" valor="RE Engine" />
        <FilaSpec label="Rendimiento" valor="60–120 FPS" />
        <FilaSpec label="Plataformas" valor="PS5 / Xbox / PC" />
      </div>
    </div>
  )
}

function IconoRedondo({ label, children }) {
  return (
    <button
      type="button"
      aria-label={label}
      className="grid h-9 w-9 cursor-pointer place-items-center rounded-full border border-white/50 text-white transition-colors duration-200 hover:border-white hover:bg-white/10"
    >
      <svg
        viewBox="0 0 16 16"
        className="h-4 w-4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
      >
        {children}
      </svg>
    </button>
  )
}

function FilaSpec({ label, valor }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-t border-white/10 py-1.5 first:border-t-0">
      <span className="text-[11px] uppercase tracking-wide text-white/50">
        {label}
      </span>
      <span className="text-right text-xs text-white">{valor}</span>
    </div>
  )
}
