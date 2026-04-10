import { Link } from "react-router-dom"

function Torso() {
  return (
    <div id="body">
      <div id="green-stripe"></div>
      <div id="yellow-stripe"></div>

      <div className="container">
        <div id="barraBotones">
          <Link className="mainButton" to="/buscar">
            Buscar estudiante
          </Link>
          <Link className="mainButton" to="/documentacion">
            Documentacion estudiantes
          </Link>
          <Link className="mainButton" to="/entrega">
            Entrega tiquetes
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Torso