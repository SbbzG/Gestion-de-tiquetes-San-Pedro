import { useId, useState } from "react"
import AppLayout from "../layouts/AppLayout"
import "../styles/BuscarEstudiante.css"

function BuscarEstudiante() {
  const inputId = useId()
  const [documento, setDocumento] = useState("")
  const [submittedDocumento, setSubmittedDocumento] = useState("")

  function onSubmit(e) {
    e.preventDefault()
    const value = documento.trim()
    setSubmittedDocumento(value)
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
                  Buscar
                </button>
              </div>
            </form>

            <div className="buscarResult" aria-live="polite">
              {submittedDocumento ? (
                <p className="buscarResult__text">
                  Consultando estudiante con documento:{" "}
                  <span className="buscarResult__doc">{submittedDocumento}</span>
                </p>
              ) : (
                <p className="buscarResult__text buscarResult__text--hint">
                  Aún no hay consulta. Cuando se conecte el backend, aquí mostramos
                  si existe y su información.
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

