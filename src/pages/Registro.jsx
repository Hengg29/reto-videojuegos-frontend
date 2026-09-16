import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { IconGamepad } from '../components/icons/IconGamepad'
import { LoginHero } from '../components/LoginHero'
import { useAuth } from '../context/AuthContext'
import { API_URL } from '../config/api'

function Registro() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [cargando, setCargando] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setCargando(true)

    try {
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, email, password }),
      })
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'No se pudo crear la cuenta')
      }

      // El registro ya devuelve token + usuario, igual que el login,
      // así que dejamos al usuario logueado de una vez.
      login(data.usuario, data.token)
      navigate('/')
    } catch (err) {
      setError(err.message)
    } finally {
      setCargando(false)
    }
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
                  Crear cuenta
                </h1>
                <p className="mt-2 text-sm text-neutral-400">
                  Regístrate para guardar tus juegos favoritos.
                </p>
              </div>

              {error && (
                <p className="mb-5 rounded-md border border-red-900/50 bg-red-950/40 px-3 py-2 text-sm text-red-300">
                  {error}
                </p>
              )}

              <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                <div>
                  <label
                    htmlFor="nombre"
                    className="mb-1.5 block text-sm text-neutral-300"
                  >
                    Nombre
                  </label>
                  <input
                    id="nombre"
                    name="nombre"
                    type="text"
                    autoComplete="name"
                    required
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    placeholder="Tu nombre"
                    className="w-full rounded-md border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm text-white placeholder:text-neutral-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                  />
                </div>

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
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tu@correo.com"
                    className="w-full rounded-md border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm text-white placeholder:text-neutral-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                  />
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="mb-1.5 block text-sm text-neutral-300"
                  >
                    Contraseña
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Mínimo 6 caracteres"
                    className="w-full rounded-md border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm text-white placeholder:text-neutral-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                  />
                </div>

                <button
                  type="submit"
                  disabled={cargando}
                  className="w-full cursor-pointer rounded-md bg-white px-4 py-2.5 text-sm font-medium text-neutral-900 transition-colors duration-150 hover:bg-neutral-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {cargando ? 'Creando cuenta...' : 'Crear cuenta'}
                </button>
              </form>
            </div>

            <p className="mt-6 text-center text-sm text-neutral-500">
              ¿Ya tienes cuenta?{' '}
              <Link
                to="/login"
                className="text-neutral-300 underline-offset-4 transition-colors duration-150 hover:text-white hover:underline"
              >
                Inicia sesión
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Registro
