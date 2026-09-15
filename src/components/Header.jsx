import { Link, useLocation, useNavigate } from 'react-router-dom'
import { IconGamepad } from './icons/IconGamepad'
import { useAuth } from '../context/AuthContext'

export function Header() {
  const { pathname } = useLocation()
  const { usuario, esAdmin, logout } = useAuth()
  const navigate = useNavigate()
  const enLogin = pathname === '/login'

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <header className="sticky top-0 z-20 border-b border-neutral-800 bg-neutral-950">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2">
          <IconGamepad className="h-6 w-6 text-neutral-400" />
          <span className="font-heading text-base font-semibold tracking-tight text-white">
            GameVault
          </span>
        </Link>

        {usuario ? (
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-neutral-400 sm:inline">
              {usuario.nombre}
              {esAdmin && (
                <span className="ml-2 rounded border border-neutral-700 px-1.5 py-0.5 text-xs uppercase text-neutral-400">
                  admin
                </span>
              )}
            </span>
            <button
              type="button"
              onClick={handleLogout}
              className="cursor-pointer rounded-md border border-neutral-800 px-4 py-2 text-sm font-medium text-neutral-200 transition-colors duration-150 hover:border-neutral-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              Cerrar sesión
            </button>
          </div>
        ) : (
          !enLogin && (
            <Link
              to="/login"
              className="cursor-pointer rounded-md bg-white px-4 py-2 text-sm font-medium text-neutral-900 transition-colors duration-150 hover:bg-neutral-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950"
            >
              Iniciar sesión
            </Link>
          )
        )}
      </div>
    </header>
  )
}
