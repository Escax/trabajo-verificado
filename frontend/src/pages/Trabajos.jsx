import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { trabajosApi } from "../api/endpoints";
import { mensajeError } from "../api/errores";
import { ETIQUETA_ESTADO, formatoFecha, formatoPesos } from "../utils/formato";
import { Calendar, Check, Copy, Inbox, MessageCircle, Pencil, Plus, Send, Trash2, User } from "lucide-react";
import { useAuth } from "../context/AuthContext";

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

  const { usuario } = useAuth();
const primerNombre = usuario?.nombre?.split(" ")[0];
const conteo = (estado) => trabajos.filter((t) => t.estado === estado).length;

  if (cargando) return <p>Cargando...</p>;

  return (
  <>
    <div className="encabezado">
      <div>
        <h1>Hola, {primerNombre}</h1>
        <p>Registra tus trabajos y pide a tus clientes que los confirmen.</p>
      </div>
      <Link to="/trabajos/nuevo" className="boton"><Plus size={18} /> Registrar trabajo</Link>
    </div>

    {trabajos.length > 0 && (
      <div className="resumen">
        <div className="resumen-item"><strong>{conteo("VERIFICADO")}</strong><span>Verificados</span></div>
        <div className="resumen-item"><strong>{conteo("PENDIENTE")}</strong><span>Pendientes</span></div>
        <div className="resumen-item"><strong>{conteo("RECHAZADO")}</strong><span>Rechazados</span></div>
      </div>
    )}

    {error && <div className="alerta-error">{error}</div>}

    {trabajos.length === 0 ? (
      <div className="vacio">
        <div className="vacio-icono"><Inbox size={28} /></div>
        <h2>Aún no tienes trabajos registrados</h2>
        <p>Registra tu primer trabajo y envíale el enlace a tu cliente para que lo confirme.</p>
        <Link to="/trabajos/nuevo" className="boton"><Plus size={18} /> Registrar mi primer trabajo</Link>
      </div>
    ) : (
      <div className="lista">
        {trabajos.map((t) => (
          <div key={t.id} className="tarjeta">
            <div className="tarjeta-fila">
              <div>
                <div className="tarjeta-titulo">{t.servicio}</div>
                <div className="tarjeta-detalle">
                  <span><User size={14} /> {t.nombreCliente}</span>
                  <span><Calendar size={14} /> {formatoFecha(t.fecha)}</span>
                </div>
              </div>
              <div className="tarjeta-lado">
                <span className="tarjeta-valor">{formatoPesos(t.valor)}</span>
                <span className={`estado estado-${t.estado.toLowerCase()}`}>{ETIQUETA_ESTADO[t.estado]}</span>
              </div>
            </div>

            {t.estado !== "VERIFICADO" && (
              <div className="acciones">
                <button onClick={() => solicitar(t)}><Send size={16} /> Solicitar verificación</button>
                <Link to={`/trabajos/${t.id}/editar`} className="boton boton-secundario"><Pencil size={16} /> Editar</Link>
                <button className="peligro" onClick={() => eliminar(t)}><Trash2 size={16} /> Eliminar</button>
              </div>
            )}

            {enlaces[t.id] && (
              <div className="enlace">
                <p>Comparte este enlace con {t.nombreCliente} para que confirme el trabajo:</p>
                <div className="enlace-fila">
                  <input readOnly value={enlaces[t.id]} onFocus={(e) => e.target.select()} />
                  <button onClick={() => copiar(t.id)} title="Copiar enlace">
                    {copiado === t.id ? <Check size={16} /> : <Copy size={16} />}
                  </button>
                  <a href={whatsapp(t)} target="_blank" rel="noopener noreferrer" className="boton boton-whatsapp">
                    <MessageCircle size={16} /> <span className="menu-texto">WhatsApp</span>
                  </a>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    )}
  </>
);
}