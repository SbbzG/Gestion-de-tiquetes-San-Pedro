import { useId, useState } from "react"
import AppLayout from "../layouts/AppLayout"
import "../styles/BuscarEstudiante.css"

function DocumentacionEstudiantes() {
  const inputId = useId()
  const [documento, setDocumento] = useState("")
  const [estudiante, setEstudiante] = useState(null)
  const [error, setError] = useState("")
  const [cargando, setCargando] = useState(false)
  const [verificando, setVerificando] = useState(false)
  const [mensajeVerificacion, setMensajeVerificacion] = useState("")

  async function onSubmit(e) {
    e.preventDefault()
    const value = documento.trim()
    if (!value) return

    setCargando(true)
    setError("")
    setEstudiante(null)
    setMensajeVerificacion("")

    try {
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

  async function cambiarVerificacion(nuevoEstado) {
    setVerificando(true)
    setMensajeVerificacion("")
    try {
      const res = await fetch(
        `http://localhost:5080/api/estudiantes/${estudiante.idEstudiante}/verificar`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(nuevoEstado)
        }
      )
      if (res.ok) {
        setEstudiante(prev => ({
          ...prev,
          documento_Estudiante: {
            ...prev.documento_Estudiante,
            estadoVerificacion: nuevoEstado
          }
        }))
        setMensajeVerificacion(nuevoEstado ? "✅ Documentos aprobados." : "❌ Documentos rechazados.")
      }
    } catch {
      setMensajeVerificacion("Error al actualizar verificación.")
    } finally {
      setVerificando(false)
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
          <div className="buscarCard" role="region" aria-label="Documentación del estudiante">
            <h2 className="buscarCard__title">
              Ingrese el documento del estudiante para ver su documentación
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
                  <p><strong>Días de estudio:</strong> {estudiante.documento_Estudiante?.diasEstudio}</p>
                  <p><strong>Estado documentos:</strong> {estudiante.documento_Estudiante?.estadoVerificacion ? "✅ Aprobados" : "❌ Pendiente"}</p>
                  <p>
                    <strong>Cédula:</strong>{" "}
                    <a href={estudiante.documento_Estudiante?.urlCedula} target="_blank" rel="noreferrer">
                      Ver documento
                    </a>
                  </p>
                  <p>
                    <strong>Certificado:</strong>{" "}
                    <a href={estudiante.documento_Estudiante?.urlCertificado} target="_blank" rel="noreferrer">
                      Ver documento
                    </a>
                  </p>

                  <div style={{ marginTop: "1rem", display: "flex", gap: "1rem" }}>
                    <button
                      className="buscarForm__button"
                      onClick={() => cambiarVerificacion(true)}
                      disabled={verificando}
                    >
                      Aprobar documentos
                    </button>
                    <button
                      className="buscarForm__button"
                      onClick={() => cambiarVerificacion(false)}
                      disabled={verificando}
                      style={{ background: "#c0392b" }}
                    >
                      Rechazar documentos
                    </button>
                  </div>

                  {mensajeVerificacion && (
                    <p style={{ marginTop: "0.5rem" }}>{mensajeVerificacion}</p>
                  )}
                </div>
              )}
              {!error && !estudiante && !cargando && (
                <p className="buscarResult__text buscarResult__text--hint">
                  Ingrese un documento para ver la documentación del estudiante.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}

export default DocumentacionEstudiantes