import { Routes, Route } from 'react-router-dom'
import Catalogo from './pages/Catalogo'
import Login from './pages/Login'
import Registro from './pages/Registro'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Catalogo />} />
      <Route path="/login" element={<Login />} />
      <Route path="/registro" element={<Registro />} />
    </Routes>
  )
}

export default App
