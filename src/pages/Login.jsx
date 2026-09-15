import { Link } from 'react-router-dom'
import { Header } from '../components/Header'

function Login() {
  // Por ahora solo evitamos que el formulario recargue la página.
  // La lógica real (validar, llamar a la API, guardar el token) se
  // agrega después.
  const handleSubmit = (e) => {
    e.preventDefault()
  }

  return (
    <div className="flex min-h-screen flex-col bg-neutral-950 text-neutral-100">
      <Header />

      <main className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center px-4 py-14 sm:px-6">
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
              <label htmlFor="password" className="block text-sm text-neutral-300">
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

        <p className="mt-8 text-center text-sm text-neutral-500">
          <Link
            to="/"
            className="text-neutral-300 underline-offset-4 transition-colors duration-150 hover:text-white hover:underline"
          >
            ← Volver al catálogo
          </Link>
        </p>
      </main>

      <footer className="border-t border-neutral-800 py-6 text-center text-sm text-neutral-500">
        Reto Videojuegos — Turing IA
      </footer>
    </div>
  )
}

export default Login
