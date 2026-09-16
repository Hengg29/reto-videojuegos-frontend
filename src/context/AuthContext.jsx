import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Toast } from '../components/Toast'

// Contexto de autenticación: guarda el usuario y el token en memoria +
// localStorage (para no perder la sesión al recargar la página), y
// expone login()/logout() para que cualquier componente los use.
// También centraliza el aviso de "tu sesión expiró" (toast + logout +
// redirigir al login), para no repetir esa lógica en cada componente
// que hace peticiones protegidas.

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null)
  const [token, setToken] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [toast, setToast] = useState(null)
  const navigate = useNavigate()

  // Al montar la app, recupera la sesión guardada (si había una).
  useEffect(() => {
    const tokenGuardado = localStorage.getItem('token')
    const usuarioGuardado = localStorage.getItem('usuario')
    if (tokenGuardado && usuarioGuardado) {
      setToken(tokenGuardado)
      setUsuario(JSON.parse(usuarioGuardado))
    }
    setCargando(false)
  }, [])

  const login = (usuarioNuevo, tokenNuevo) => {
    setUsuario(usuarioNuevo)
    setToken(tokenNuevo)
    localStorage.setItem('token', tokenNuevo)
    localStorage.setItem('usuario', JSON.stringify(usuarioNuevo))
  }

  const logout = () => {
    setUsuario(null)
    setToken(null)
    localStorage.removeItem('token')
    localStorage.removeItem('usuario')
  }

  const mostrarToast = useCallback((mensaje) => {
    setToast(mensaje)
    // Se cierra solo después de unos segundos.
    setTimeout(() => setToast(null), 4000)
  }, [])

  // Llama esto cuando una petición protegida responda 401 (token
  // vencido o inválido): cierra la sesión, avisa con un toast y
  // manda al usuario al login.
  const cerrarSesionPorExpiracion = useCallback(() => {
    logout()
    mostrarToast('Tu sesión expiró. Inicia sesión de nuevo.')
    navigate('/login')
  }, [mostrarToast, navigate])

  const esAdmin = usuario?.rol === 'admin'

  return (
    <AuthContext.Provider
      value={{
        usuario,
        token,
        cargando,
        esAdmin,
        login,
        logout,
        mostrarToast,
        cerrarSesionPorExpiracion,
      }}
    >
      {children}
      <Toast mensaje={toast} onCerrar={() => setToast(null)} />
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth debe usarse dentro de <AuthProvider>')
  }
  return context
}
