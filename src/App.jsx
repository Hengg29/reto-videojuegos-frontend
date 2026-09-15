import { Routes, Route } from 'react-router-dom'
import Catalogo from './pages/Catalogo'
import Login from './pages/Login'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Catalogo />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  )
}

export default App
