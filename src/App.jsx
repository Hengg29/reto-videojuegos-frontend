import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [status, setStatus] = useState('Conectando con el backend...')


  useEffect(() => {
    fetch('/api/health')
      .then((res) => res.json())
      .then((data) => setStatus(data.message))
      .catch(() => setStatus(' No se pudo conectar con el backend'))
  }, [])

  return (
    <>
      <h1>Frontend + Backend</h1>
      <p>Estado del backend: {status}</p>
    </>
  )
}

export default App
