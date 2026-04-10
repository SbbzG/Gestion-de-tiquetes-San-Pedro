import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import BuscarEstudiante from "./pages/BuscarEstudiante"
import DocumentacionEstudiantes from "./pages/DocumentacionEstudiantes"
import EntregaTiquetes from "./pages/EntregaTiquetes"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/buscar" element={<BuscarEstudiante />} />
        <Route path="/documentacion" element={<DocumentacionEstudiantes />} />
        <Route path="/entrega" element={<EntregaTiquetes />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App