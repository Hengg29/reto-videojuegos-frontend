import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { IconUser } from './icons/IconUser'


export function UserMenu() {
  const { usuario, esAdmin, logout } = useAuth()
  const navigate = useNavigate()
  const [abierto, setAbierto] = useState(false)
  const contenedorRef = useRef(null)

  // Cierra el menú si se hace clic afuera, o con la tecla Escape.
  useEffect(() => {
    const onClickFuera = (e) => {
      if (contenedorRef.current && !contenedorRef.current.contains(e.target)) {
        setAbierto(false)
      }
    }
    const onEscape = (e) => {
      if (e.key === 'Escape') setAbierto(false)
    }

    document.addEventListener('mousedown', onClickFuera)
    document.addEventListener('keydown', onEscape)
    return () => {
      document.removeEventListener('mousedown', onClickFuera)
      document.removeEventListener('keydown', onEscape)
    }
  }, [])

  const handleLogout = () => {
    logout()
    setAbierto(false)
    navigate('/')
  }

  if (!usuario) return null

  return (
    <div ref={contenedorRef} className="relative">
      <button
        type="button"
        onClick={() => setAbierto((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={abierto}
        aria-label="Menú de usuario"
        className="grid h-9 w-9 cursor-pointer place-items-center rounded-full border border-neutral-700 text-neutral-300 transition-colors duration-150 hover:border-neutral-500 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
      >
        <IconUser className="h-5 w-5" />
      </button>

      {abierto && (
        <div
          role="menu"
          className="absolute right-0 top-full z-30 mt-2 w-56 rounded-lg border border-neutral-800 bg-neutral-950 p-2 shadow-xl shadow-black/40"
        >
          <div className="border-b border-neutral-800 px-3 py-2.5">
            <p className="truncate text-sm font-medium text-white">
              {usuario.nombre}
            </p>
            <p className="mt-1 inline-block rounded border border-neutral-700 px-1.5 py-0.5 text-[10px] uppercase tracking-wide text-neutral-400">
              {esAdmin ? 'Administrador' : 'Usuario'}
            </p>
          </div>

          <button
            type="button"
            role="menuitem"
            onClick={handleLogout}
            className="mt-1 w-full cursor-pointer rounded-md px-3 py-2 text-left text-sm text-neutral-300 transition-colors duration-150 hover:bg-neutral-900 hover:text-white"
          >
            Cerrar sesión
          </button>
        </div>
      )}
    </div>
  )
}
