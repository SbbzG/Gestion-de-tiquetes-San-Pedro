import { useId, useState } from "react"
import AppLayout from "../layouts/AppLayout"
import "../styles/BuscarEstudiante.css"

function EntregaTiquetes() {
  const inputId = useId()
  const [documento, setDocumento] = useState("")
  const [estudiante, setEstudiante] = useState(null)
  const [error, setError] = useState("")
  const [cargando, setCargando] = useState(false)
  const [cantidad, setCantidad] = useState("")
  const [entregando, setEntregando] = useState(false)
  const [mensajeEntrega, setMensajeEntrega] = useState("")

  async function onSubmit(e) {
    e.preventDefault()
    const value = documento.trim()
    if (!value) return

    setCargando(true)
    setError("")
    setEstudiante(null)
    setMensajeEntrega("")

    try {
      const res = await fetch("http://localhost:5080/api/estudiantes")
      const data = await res.json()
      const encontrado = data.find(e => e.documento === value)

      if (!encontrado) {
        setError("No se encontró ningún estudiante con ese documento.")
      } else if (!encontrado.documento_Estudiante?.estadoVerificacion) {
        setError("⚠️ Este estudiante no tiene los documentos verificados. No se pueden entregar tiquetes.")
      } else {
        setEstudiante(encontrado)
      }
    } catch {
      setError("Error al conectar con el servidor.")
    } finally {
      setCargando(false)
    }
  }

  async function entregarTiquetes(e) {
    e.preventDefault()
    const cantidadNum = parseInt(cantidad)
    if (!cantidadNum || cantidadNum <= 0) return

    setEntregando(true)
    setMensajeEntrega("")

    try {
      const res = await fetch(
        `http://localhost:5080/api/estudiantes/${estudiante.idEstudiante}/tiquetes`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(cantidadNum)
        }
      )
      if (res.ok) {
        const data = await res.json()
        setEstudiante(prev => ({
          ...prev,
          entregaTiquete: data
        }))
        setMensajeEntrega(`✅ Se entregaron ${cantidadNum} tiquetes correctamente.`)
        setCantidad("")
      }
    } catch {
      setMensajeEntrega("Error al registrar la entrega.")
    } finally {
      setEntregando(false)
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
          <div className="buscarCard" role="region" aria-label="Entrega de tiquetes">
            <h2 className="buscarCard__title">
              Ingrese el documento del estudiante para entregar tiquetes
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
                  <p><strong>Tiquetes entregados hasta ahora:</strong> {estudiante.entregaTiquete?.tiquetesEntregados}</p>
                  <p><strong>Última entrega:</strong> {estudiante.entregaTiquete?.ultimaEntrega ? new Date(estudiante.entregaTiquete.ultimaEntrega).toLocaleString("es-CO") : "Sin entregas aún"}</p>
                  <p><strong>Tiquetes entregados la última vez:</strong> {estudiante.entregaTiquete?.tiquetesUltimaEntrega ?? 0}</p>

                  <form onSubmit={entregarTiquetes} style={{ marginTop: "1rem" }}>
                    <label className="buscarForm__label">Cantidad a entregar</label>
                    <div className="buscarForm__row">
                      <input
                        className="buscarForm__input"
                        type="number"
                        min="1"
                        value={cantidad}
                        onChange={(e) => setCantidad(e.target.value)}
                        placeholder="Ej: 10"
                      />
                      <button className="buscarForm__button" type="submit" disabled={entregando}>
                        {entregando ? "Entregando..." : "Confirmar entrega"}
                      </button>
                    </div>
                  </form>

                  {mensajeEntrega && (
                    <p style={{ marginTop: "0.5rem" }}>{mensajeEntrega}</p>
                  )}
                </div>
              )}
              {!error && !estudiante && !cargando && (
                <p className="buscarResult__text buscarResult__text--hint">
                  Ingrese un documento para gestionar la entrega de tiquetes.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}

export default EntregaTiquetes