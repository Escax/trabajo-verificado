import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { verificacionApi } from "../api/endpoints";
import { mensajeError } from "../api/errores";
import { formatoFecha, formatoPesos } from "../utils/formato";
import Aviso from "../components/Aviso";

const MENSAJE_FINAL = {
  CONFIRMADA: "Gracias. Confirmaste que este trabajo se realizó.",
  RECHAZADA: "Registramos que este trabajo no corresponde. Gracias por responder.",
  EXPIRADA: "Este enlace expiró. Pide al trabajador que te envíe uno nuevo.",
};

export default function Verificar() {
  const { token } = useParams();
  const [datos, setDatos] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [comentario, setComentario] = useState("");
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    verificacionApi.consultar(token)
      .then(setDatos)
      .catch((err) => setError(mensajeError(err)))
      .finally(() => setCargando(false));
  }, [token]);

  const responder = async (decision) => {
    if (decision === "RECHAZAR" && !window.confirm("¿Confirmas que este trabajo NO se realizó como se describe?")) return;
    setError("");
    setEnviando(true);
    try {
      setDatos(await verificacionApi.responder(token, { decision, comentario }));
    } catch (err) {
      setError(mensajeError(err));
      // Si ya se respondió o expiró (409/410), recargar para mostrar el estado real
      verificacionApi.consultar(token).then(setDatos).catch(() => {});
    } finally {
      setEnviando(false);
    }
  };

  if (cargando) return <div className="contenedor-auth"><p>Cargando...</p></div>;

  if (!datos) {
    return (
      <div className="contenedor-auth">
        <h1>Enlace no válido</h1>
        <p>{error || "No encontramos esta solicitud de verificación."}</p>
      </div>
    );
  }

  const pendiente = datos.estado === "PENDIENTE";

  return (
    <div className="contenedor-auth">
      <h1>Verificación de trabajo</h1>
      <p>
        <strong>{datos.nombreTrabajador}</strong>
        {datos.oficioTrabajador && ` (${datos.oficioTrabajador})`} te pide confirmar que realizó este trabajo para ti:
      </p>

      <dl className="detalle">
        <dt>Cliente</dt><dd>{datos.nombreCliente}</dd>
        <dt>Servicio</dt><dd>{datos.servicio}</dd>
        <dt>Fecha</dt><dd>{formatoFecha(datos.fecha)}</dd>
        <dt>Valor</dt><dd>{formatoPesos(datos.valor)}</dd>
      </dl>

      {pendiente ? (
        <>
          <label>
            Comentario (opcional)
            <textarea value={comentario} onChange={(e) => setComentario(e.target.value)}
                      maxLength={500} rows={3} placeholder="Ej: Muy puntual y ordenado" />
          </label>

          {error && <p className="error">{error}</p>}

          <div className="acciones">
            <button onClick={() => responder("CONFIRMAR")} disabled={enviando}>Sí, lo confirmo</button>
            <button className="secundario" onClick={() => responder("RECHAZAR")} disabled={enviando}>
              No corresponde
            </button>
          </div>
          <p className="nota">Solo puedes responder una vez. Disponible hasta el {formatoFecha(datos.fechaExpiracion)}.</p>
        </>
      ) : (
        <p className={`resultado resultado-${datos.estado.toLowerCase()}`}>{MENSAJE_FINAL[datos.estado]}</p>
      )}

      <Aviso />
    </div>
  );
}