import { Link } from 'react-router-dom'
import { IconGamepad } from '../components/icons/IconGamepad'
import { LoginHero } from '../components/LoginHero'

function Login() {
  // Por ahora solo evitamos que el formulario recargue la página.
  // La lógica real (validar, llamar a la API, guardar el token) se
  // agrega después.
  const handleSubmit = (e) => {
    e.preventDefault()
  }

  return (
    <div className="flex min-h-screen bg-neutral-950 text-neutral-100">
      {/* Panel de marca — solo visible en pantallas medianas/grandes */}
      <div className="hidden w-1/2 border-r border-neutral-800 md:block">
        <LoginHero />
      </div>

      {/* Panel del formulario */}
      <div className="flex w-full flex-col md:w-1/2">
        {/* Logo visible solo en móvil, donde no hay panel de marca */}
        <Link
          to="/"
          className="flex items-center justify-center gap-2 py-8 md:hidden"
        >
          <IconGamepad className="h-6 w-6 text-neutral-400" />
          <span className="font-heading text-base font-semibold tracking-tight text-white">
            GameVault
          </span>
        </Link>

        <div className="flex flex-1 items-center justify-center px-4 pb-14 sm:px-6">
          <div className="w-full max-w-sm">
            <div className="rounded-lg border border-neutral-800 p-8">
              <div className="mb-8 text-center">
                <h1 className="font-heading text-2xl font-semibold tracking-tight text-white">
                  Iniciar sesión
                </h1>
                <p className="mt-2 text-sm text-neutral-400">
                  Entra con tu cuenta para administrar el catálogo.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                <div>
                  <label
                    htmlFor="email"
                    className="mb-1.5 block text-sm text-neutral-300"
                  >
                    Correo electrónico
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="tu@correo.com"
                    className="w-full rounded-md border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm text-white placeholder:text-neutral-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                  />
                </div>

                <div>
                  <div className="mb-1.5 flex items-center justify-between">
                    <label
                      htmlFor="password"
                      className="block text-sm text-neutral-300"
                    >
                      Contraseña
                    </label>
                    <a
                      href="#"
                      className="text-xs text-neutral-500 transition-colors duration-150 hover:text-white"
                    >
                      ¿Olvidaste tu contraseña?
                    </a>
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    placeholder="••••••••"
                    className="w-full rounded-md border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm text-white placeholder:text-neutral-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full cursor-pointer rounded-md bg-white px-4 py-2.5 text-sm font-medium text-neutral-900 transition-colors duration-150 hover:bg-neutral-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950"
                >
                  Iniciar sesión
                </button>
              </form>
            </div>

            <p className="mt-6 text-center text-sm text-neutral-500">
              <Link
                to="/"
                className="text-neutral-300 underline-offset-4 transition-colors duration-150 hover:text-white hover:underline"
              >
                ← Volver al catálogo
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
