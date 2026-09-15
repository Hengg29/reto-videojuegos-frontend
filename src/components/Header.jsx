import { Link, useLocation } from 'react-router-dom'
import { IconGamepad } from './icons/IconGamepad'

export function Header() {
  const { pathname } = useLocation()
  const enLogin = pathname === '/login'

  return (
    <header className="sticky top-0 z-20 border-b border-neutral-800 bg-neutral-950">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2">
          <IconGamepad className="h-6 w-6 text-neutral-400" />
          <span className="font-heading text-base font-semibold tracking-tight text-white">
            GameVault
          </span>
        </Link>
        {!enLogin && (
          <Link
            to="/login"
            className="cursor-pointer rounded-md bg-white px-4 py-2 text-sm font-medium text-neutral-900 transition-colors duration-150 hover:bg-neutral-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950"
          >
            Iniciar sesión
          </Link>
        )}
      </div>
    </header>
  )
}
