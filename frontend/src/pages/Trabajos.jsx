import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { trabajosApi } from "../api/endpoints";
import { mensajeError } from "../api/errores";
import { ETIQUETA_ESTADO, formatoFecha, formatoPesos } from "../utils/formato";

export default function Trabajos() {
  const [trabajos, setTrabajos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [enlaces, setEnlaces] = useState({});   // { [idTrabajo]: enlace }
  const [copiado, setCopiado] = useState(null);

  const cargar = () => {
    setCargando(true);
    trabajosApi.listar()
      .then(setTrabajos)
      .catch((err) => setError(mensajeError(err)))
      .finally(() => setCargando(false));
  };

  useEffect(cargar, []);

  const solicitar = async (t) => {
    setError("");
    try {
      const r = await trabajosApi.solicitarVerificacion(t.id);
      setEnlaces({ ...enlaces, [t.id]: r.enlace });
    } catch (err) {
      setError(mensajeError(err));
    }
  };

  const copiar = async (id) => {
    await navigator.clipboard.writeText(enlaces[id]);
    setCopiado(id);
    setTimeout(() => setCopiado(null), 2000);
  };

  const whatsapp = (t) => {
    const texto = `Hola ${t.nombreCliente}, ¿me ayudas a confirmar el trabajo "${t.servicio}"? ${enlaces[t.id]}`;
    return `https://wa.me/?text=${encodeURIComponent(texto)}`;
  };

  const eliminar = async (t) => {
    if (!window.confirm(`¿Eliminar el trabajo "${t.servicio}"?`)) return;
    setError("");
    try {
      await trabajosApi.eliminar(t.id);
      cargar();
    } catch (err) {
      setError(mensajeError(err));
    }
  };

  if (cargando) return <p>Cargando...</p>;

  return (
    <>
      <div className="encabezado">
        <h1>Mis trabajos</h1>
        <Link to="/trabajos/nuevo" className="boton">+ Registrar trabajo</Link>
      </div>

      {error && <p className="error">{error}</p>}

      {trabajos.length === 0 ? (
        <p>Aún no has registrado trabajos. Empieza con el botón de arriba.</p>
      ) : (
        <div className="lista">
          {trabajos.map((t) => (
            <div key={t.id} className="tarjeta">
              <div className="tarjeta-fila">
                <strong>{t.servicio}</strong>
                <span className={`estado estado-${t.estado.toLowerCase()}`}>
                  {ETIQUETA_ESTADO[t.estado]}
                </span>
              </div>
              <div className="tarjeta-detalle">
                {t.nombreCliente} · {formatoFecha(t.fecha)} · {formatoPesos(t.valor)}
              </div>

              {t.estado !== "VERIFICADO" && (
                <div className="acciones">
                  <button onClick={() => solicitar(t)}>Solicitar verificación</button>
                  <Link to={`/trabajos/${t.id}/editar`}>Editar</Link>
                  <button className="secundario" onClick={() => eliminar(t)}>Eliminar</button>
                </div>
              )}

              {enlaces[t.id] && (
                <div className="enlace">
                  <input readOnly value={enlaces[t.id]} onFocus={(e) => e.target.select()} />
                  <button onClick={() => copiar(t.id)}>{copiado === t.id ? "¡Copiado!" : "Copiar"}</button>
                  <a href={whatsapp(t)} target="_blank" rel="noopener noreferrer">WhatsApp</a>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </>
  );
}