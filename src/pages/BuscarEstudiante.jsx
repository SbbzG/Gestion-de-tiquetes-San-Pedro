import { useId, useState } from "react"
import AppLayout from "../layouts/AppLayout"
import "../styles/BuscarEstudiante.css"

function BuscarEstudiante() {
  const inputId = useId()
  const [documento, setDocumento] = useState("")
  const [estudiante, setEstudiante] = useState(null)
  const [error, setError] = useState("")
  const [cargando, setCargando] = useState(false)

  async function onSubmit(e) {
    e.preventDefault()
    const value = documento.trim()
    if (!value) return

    setCargando(true)
    setError("")
    setEstudiante(null)

    try {
      // Primero buscamos por documento en la lista completa
      const res = await fetch("http://localhost:5080/api/estudiantes")
      const data = await res.json()
      const encontrado = data.find(e => e.documento === value)

      if (!encontrado) {
        setError("No se encontró ningún estudiante con ese documento.")
      } else {
        setEstudiante(encontrado)
      }
    } catch {
      setError("Error al conectar con el servidor.")
    } finally {
      setCargando(false)
    }
  }

  return (
    <AppLayout headerVariant="compact">
      <div id="body" className="buscarPage">
        <div className="buscarPage__overlay" />
        <div className="buscarPage__stripes">
          <div id="green-stripe"></div>
          <div id="yellow-stripe"></div>
        </div>
        <div className="container buscarPage__container">
          <div className="buscarCard" role="region" aria-label="Buscar estudiante">
            <h2 className="buscarCard__title">
              Ingrese el documento del estudiante a buscar
            </h2>
            <form className="buscarForm" onSubmit={onSubmit}>
              <label className="buscarForm__label" htmlFor={inputId}>
                Documento
              </label>
              <div className="buscarForm__row">
                <input
                  id={inputId}
                  className="buscarForm__input"
                  value={documento}
                  onChange={(e) => setDocumento(e.target.value)}
                  placeholder="Ej: 1000123456"
                  inputMode="numeric"
                  autoComplete="off"
                />
                <button className="buscarForm__button" type="submit">
                  {cargando ? "Buscando..." : "Buscar"}
                </button>
              </div>
            </form>

            <div className="buscarResult" aria-live="polite">
              {error && (
                <p className="buscarResult__text" style={{ color: "red" }}>{error}</p>
              )}
              {estudiante && (
                <div className="buscarResult__text">
                  <p><strong>Nombre:</strong> {estudiante.nombreCompleto}</p>
                  <p><strong>Documento:</strong> {estudiante.documento}</p>
                  <p><strong>Teléfono:</strong> {estudiante.telefono}</p>
                  <p><strong>Correo:</strong> {estudiante.correo}</p>
                  <p><strong>Días de estudio:</strong> {estudiante.documento_Estudiante?.diasEstudio}</p>
                  <p><strong>Documentos verificados:</strong> {estudiante.documento_Estudiante?.estadoVerificacion ? "✅ Sí" : "❌ No"}</p>
                  <p><strong>Tiquetes entregados:</strong> {estudiante.entregaTiquete?.tiquetesEntregados}</p>
                </div>
              )}
              {!error && !estudiante && !cargando && (
                <p className="buscarResult__text buscarResult__text--hint">
                  Ingrese un documento para buscar el estudiante.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}

export default BuscarEstudiante