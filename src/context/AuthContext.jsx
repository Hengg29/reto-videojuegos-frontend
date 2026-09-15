import { createContext, useContext, useEffect, useState } from 'react'

// Contexto de autenticación: guarda el usuario y el token en memoria +
// localStorage (para no perder la sesión al recargar la página), y
// expone login()/logout() para que cualquier componente los use.

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null)
  const [token, setToken] = useState(null)
  const [cargando, setCargando] = useState(true)

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

  const esAdmin = usuario?.rol === 'admin'

  return (
    <AuthContext.Provider
      value={{ usuario, token, cargando, esAdmin, login, logout }}
    >
      {children}
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
